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
    mapping(address => bool) public hasClaimedSnapshot;
    mapping(uint256 => bool) public swappedTokenIds;
    
    bool public snapshotFinalized;
    bool public claimingEnabled;
    
    event SnapshotClaimed(address indexed claimer, uint256 amount, uint256[] swappedNFTs);
    event NFTSwapped(address indexed from, uint256[] tokenIds, uint256 amount);
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
        claimingEnabled = true;
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
    
    function toggleClaiming() external onlyOwner {
        claimingEnabled = !claimingEnabled;
    }
    
    function claimFromSnapshot() external nonReentrant {
        require(claimingEnabled, "Claiming is disabled");
        require(snapshotFinalized, "Snapshot not finalized");
        require(!hasClaimedSnapshot[msg.sender], "Already claimed snapshot");
        require(snapshotAllocations[msg.sender] > 0, "No snapshot allocation");
        
        hasClaimedSnapshot[msg.sender] = true;
        
        uint256 baseAllocation = snapshotAllocations[msg.sender] * TOKENS_PER_NFT;
        uint256[] memory swappedNFTs = _sweepUserNFTs(msg.sender);
        
        require(ldToken.transfer(msg.sender, baseAllocation), "Token transfer failed");
        
        emit SnapshotClaimed(msg.sender, baseAllocation, swappedNFTs);
    }
    
    function claimFromNFTOwnership(uint256[] calldata tokenIds) external nonReentrant {
        require(claimingEnabled, "Claiming is disabled");
        require(tokenIds.length > 0, "No token IDs provided");
        require(tokenIds.length <= 50, "Too many token IDs");
        
        uint256 totalTokens = 0;
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            
            require(!swappedTokenIds[tokenId], "Token already swapped");
            require(nftContract.ownerOf(tokenId) == msg.sender, "Not the NFT owner");
            
            swappedTokenIds[tokenId] = true;
            
            nftContract.transferFrom(msg.sender, treasuryAddress, tokenId);
            
            totalTokens += TOKENS_PER_NFT;
        }
        
        require(ldToken.transfer(msg.sender, totalTokens), "Token transfer failed");
        
        emit NFTSwapped(msg.sender, tokenIds, totalTokens);
    }
    
    function _sweepUserNFTs(address user) internal returns (uint256[] memory) {
        uint256 nftBalance = nftContract.balanceOf(user);
        if (nftBalance == 0) {
            return new uint256[](0);
        }
        
        uint256[] memory ownedTokenIds = new uint256[](nftBalance);
        uint256 swappedCount = 0;
        
        for (uint256 i = 0; i < 10000; i++) {
            try nftContract.ownerOf(i) returns (address owner) {
                if (owner == user && !swappedTokenIds[i]) {
                    ownedTokenIds[swappedCount] = i;
                    swappedTokenIds[i] = true;
                    
                    nftContract.transferFrom(user, treasuryAddress, i);
                    
                    swappedCount++;
                    if (swappedCount >= nftBalance) break;
                }
            } catch {}
        }
        
        uint256[] memory result = new uint256[](swappedCount);
        for (uint256 i = 0; i < swappedCount; i++) {
            result[i] = ownedTokenIds[i];
        }
        
        return result;
    }
    
    function getClaimableFromSnapshot(address wallet) external view returns (uint256) {
        if (hasClaimedSnapshot[wallet] || snapshotAllocations[wallet] == 0) {
            return 0;
        }
        return snapshotAllocations[wallet] * TOKENS_PER_NFT;
    }
    
    function getClaimableFromNFTs(address wallet, uint256[] calldata tokenIds) external view returns (uint256) {
        uint256 claimable = 0;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (!swappedTokenIds[tokenIds[i]]) {
                try nftContract.ownerOf(tokenIds[i]) returns (address owner) {
                    if (owner == wallet) {
                        claimable += TOKENS_PER_NFT;
                    }
                } catch {}
            }
        }
        return claimable;
    }
    
    function getUserNFTs(address wallet) external view returns (uint256[] memory, uint256) {
        uint256 balance = nftContract.balanceOf(wallet);
        uint256[] memory tokenIds = new uint256[](balance);
        uint256 count = 0;
        
        for (uint256 i = 0; i < 10000; i++) {
            try nftContract.ownerOf(i) returns (address owner) {
                if (owner == wallet && !swappedTokenIds[i]) {
                    tokenIds[count] = i;
                    count++;
                    if (count >= balance) break;
                }
            } catch {}
        }
        
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = tokenIds[i];
        }
        
        return (result, count * TOKENS_PER_NFT);
    }
    
    function isTokenSwapped(uint256 tokenId) external view returns (bool) {
        return swappedTokenIds[tokenId];
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = ldToken.balanceOf(address(this));
        require(ldToken.transfer(owner(), balance), "Withdrawal failed");
    }
}
