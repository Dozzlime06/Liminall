// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ClaimManagerHybrid is Ownable, ReentrancyGuard {
    IERC721 public immutable nftContract;
    IERC20 public immutable ldToken;
    address public immutable treasuryAddress;
    
    uint256 public constant TOKENS_PER_NFT = 25_000 * 10**18;
    
    mapping(address => uint256) public snapshotAllocations;
    mapping(address => bool) public hasClaimed;
    mapping(uint256 => bool) public swappedTokenIds;
    
    bool public snapshotFinalized;
    
    event TokensClaimed(address indexed claimer, uint256 amount, uint256[] swappedNFTs);
    event NFTSwapped(address indexed from, uint256 tokenId);
    event SnapshotSet(address indexed wallet, uint256 nftCount);
    
    constructor(
        address _nftContract,
        address _ldToken,
        address _treasuryAddress
    ) Ownable(msg.sender) {
        require(_nftContract != address(0), "Invalid NFT contract");
        require(_ldToken != address(0), "Invalid LD token");
        require(_treasuryAddress != address(0), "Invalid treasury address");
        
        nftContract = IERC721(_nftContract);
        ldToken = IERC20(_ldToken);
        treasuryAddress = _treasuryAddress;
    }
    
    function setSnapshotAllocations(
        address[] calldata wallets,
        uint256[] calldata nftCounts
    ) external onlyOwner {
        require(!snapshotFinalized, "Snapshot already finalized");
        require(wallets.length == nftCounts.length, "Array length mismatch");
        
        for (uint256 i = 0; i < wallets.length; i++) {
            snapshotAllocations[wallets[i]] = nftCounts[i];
            emit SnapshotSet(wallets[i], nftCounts[i]);
        }
    }
    
    function finalizeSnapshot() external onlyOwner {
        snapshotFinalized = true;
    }
    
    function claimTokens() external nonReentrant {
        require(snapshotFinalized, "Snapshot not finalized");
        require(!hasClaimed[msg.sender], "Already claimed");
        require(snapshotAllocations[msg.sender] > 0, "No allocation for this address");
        
        hasClaimed[msg.sender] = true;
        
        uint256 baseAllocation = snapshotAllocations[msg.sender] * TOKENS_PER_NFT;
        uint256[] memory swappedNFTs = new uint256[](0);
        
        uint256 nftBalance = nftContract.balanceOf(msg.sender);
        if (nftBalance > 0) {
            uint256[] memory ownedTokenIds = new uint256[](nftBalance);
            uint256 swappedCount = 0;
            
            for (uint256 i = 0; i < 1000; i++) {
                try nftContract.ownerOf(i) returns (address owner) {
                    if (owner == msg.sender && !swappedTokenIds[i]) {
                        ownedTokenIds[swappedCount] = i;
                        swappedCount++;
                        if (swappedCount >= nftBalance) break;
                    }
                } catch {}
            }
            
            if (swappedCount > 0) {
                swappedNFTs = new uint256[](swappedCount);
                for (uint256 i = 0; i < swappedCount; i++) {
                    uint256 tokenId = ownedTokenIds[i];
                    swappedNFTs[i] = tokenId;
                    swappedTokenIds[tokenId] = true;
                    
                    nftContract.transferFrom(msg.sender, treasuryAddress, tokenId);
                    emit NFTSwapped(msg.sender, tokenId);
                }
            }
        }
        
        require(ldToken.transfer(msg.sender, baseAllocation), "Token transfer failed");
        
        emit TokensClaimed(msg.sender, baseAllocation, swappedNFTs);
    }
    
    function getClaimableAmount(address wallet) external view returns (uint256) {
        if (hasClaimed[wallet] || snapshotAllocations[wallet] == 0) {
            return 0;
        }
        return snapshotAllocations[wallet] * TOKENS_PER_NFT;
    }
    
    function getUserNFTs(address wallet) external view returns (uint256[] memory) {
        uint256 balance = nftContract.balanceOf(wallet);
        uint256[] memory tokenIds = new uint256[](balance);
        uint256 count = 0;
        
        for (uint256 i = 0; i < 1000; i++) {
            try nftContract.ownerOf(i) returns (address owner) {
                if (owner == wallet && !swappedTokenIds[i]) {
                    tokenIds[count] = i;
                    count++;
                    if (count >= balance) break;
                }
            } catch {}
        }
        
        return tokenIds;
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = ldToken.balanceOf(address(this));
        require(ldToken.transfer(owner(), balance), "Withdrawal failed");
    }
}
