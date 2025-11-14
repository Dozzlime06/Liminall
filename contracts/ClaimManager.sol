// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ClaimManager is Ownable, ReentrancyGuard {
    IERC721 public immutable nftContract;
    IERC20 public immutable ldToken;
    address public immutable treasuryAddress;
    
    uint256 public constant TOKENS_PER_NFT = 25_000 * 10**18;
    
    mapping(uint256 => bool) public claimedTokenIds;
    
    event TokensClaimed(address indexed claimer, uint256[] tokenIds, uint256 totalAmount);
    event NFTTransferred(address indexed from, address indexed to, uint256 tokenId);
    
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
    
    function claimTokens(uint256[] calldata tokenIds) external nonReentrant {
        require(tokenIds.length > 0, "No token IDs provided");
        require(tokenIds.length <= 50, "Too many token IDs");
        
        uint256 totalTokens = 0;
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            
            require(!claimedTokenIds[tokenId], "Token already claimed");
            require(nftContract.ownerOf(tokenId) == msg.sender, "Not the NFT owner");
            
            claimedTokenIds[tokenId] = true;
            
            nftContract.transferFrom(msg.sender, treasuryAddress, tokenId);
            emit NFTTransferred(msg.sender, treasuryAddress, tokenId);
            
            totalTokens += TOKENS_PER_NFT;
        }
        
        require(ldToken.transfer(msg.sender, totalTokens), "Token transfer failed");
        
        emit TokensClaimed(msg.sender, tokenIds, totalTokens);
    }
    
    function isTokenClaimed(uint256 tokenId) external view returns (bool) {
        return claimedTokenIds[tokenId];
    }
    
    function getClaimableAmount(uint256[] calldata tokenIds) external view returns (uint256) {
        uint256 claimable = 0;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (!claimedTokenIds[tokenIds[i]] && nftContract.ownerOf(tokenIds[i]) == msg.sender) {
                claimable += TOKENS_PER_NFT;
            }
        }
        return claimable;
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = ldToken.balanceOf(address(this));
        require(ldToken.transfer(owner(), balance), "Withdrawal failed");
    }
}
