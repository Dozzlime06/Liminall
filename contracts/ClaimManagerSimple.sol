// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ClaimManagerSimple is Ownable, ReentrancyGuard {
    IERC721 public immutable nftContract;
    IERC20 public immutable ldToken;
    
    uint256 public constant TOKENS_PER_NFT = 25_000 * 10**18;
    
    mapping(uint256 => bool) public tokenIdClaimed;
    
    bool public claimingEnabled;
    
    event TokensClaimed(address indexed claimer, uint256[] tokenIds, uint256 amount);
    
    constructor(
        address _nftContract,
        address _ldToken
    ) Ownable(msg.sender) {
        require(_nftContract != address(0), "Invalid NFT contract");
        require(_ldToken != address(0), "Invalid LD token");
        
        nftContract = IERC721(_nftContract);
        ldToken = IERC20(_ldToken);
        claimingEnabled = true;
    }
    
    function toggleClaiming() external onlyOwner {
        claimingEnabled = !claimingEnabled;
    }
    
    function claimTokens(uint256[] calldata tokenIds) external nonReentrant {
        require(claimingEnabled, "Claiming is disabled");
        require(tokenIds.length > 0, "No token IDs provided");
        require(tokenIds.length <= 100, "Too many token IDs");
        
        uint256 totalTokens = 0;
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            
            require(!tokenIdClaimed[tokenId], "Token already claimed");
            require(nftContract.ownerOf(tokenId) == msg.sender, "Not the NFT owner");
            
            tokenIdClaimed[tokenId] = true;
            totalTokens += TOKENS_PER_NFT;
        }
        
        require(ldToken.transfer(msg.sender, totalTokens), "Token transfer failed");
        
        emit TokensClaimed(msg.sender, tokenIds, totalTokens);
    }
    
    function getClaimableAmount(address wallet, uint256[] calldata tokenIds) external view returns (uint256) {
        uint256 claimable = 0;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (!tokenIdClaimed[tokenIds[i]]) {
                try nftContract.ownerOf(tokenIds[i]) returns (address owner) {
                    if (owner == wallet) {
                        claimable += TOKENS_PER_NFT;
                    }
                } catch {}
            }
        }
        return claimable;
    }
    
    function isTokenClaimed(uint256 tokenId) external view returns (bool) {
        return tokenIdClaimed[tokenId];
    }
    
    function getUserNFTs(address wallet) external view returns (uint256[] memory, uint256) {
        uint256 balance = nftContract.balanceOf(wallet);
        uint256[] memory tokenIds = new uint256[](balance);
        uint256 count = 0;
        uint256 claimableCount = 0;
        
        for (uint256 i = 0; i < 10000; i++) {
            try nftContract.ownerOf(i) returns (address owner) {
                if (owner == wallet) {
                    tokenIds[count] = i;
                    if (!tokenIdClaimed[i]) {
                        claimableCount++;
                    }
                    count++;
                    if (count >= balance) break;
                }
            } catch {}
        }
        
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = tokenIds[i];
        }
        
        return (result, claimableCount * TOKENS_PER_NFT);
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = ldToken.balanceOf(address(this));
        require(ldToken.transfer(owner(), balance), "Withdrawal failed");
    }
}
