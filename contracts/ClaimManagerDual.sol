// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ClaimManagerDual is Ownable, ReentrancyGuard {
    IERC721 public immutable originalNFT;
    IERC721 public immutable otherNFT;
    IERC20 public immutable ldToken;
    address public immutable treasuryAddress;
    
    uint256 public constant TOKENS_PER_NFT = 25_000 * 10**18;
    
    mapping(uint256 => bool) public originalNFTClaimed;
    mapping(uint256 => bool) public otherNFTClaimed;
    
    bool public claimingEnabled;
    
    event OriginalNFTClaimed(address indexed claimer, uint256[] tokenIds, uint256 amount);
    event OtherNFTClaimed(address indexed claimer, uint256[] tokenIds, uint256 amount);
    
    constructor(
        address _originalNFT,
        address _otherNFT,
        address _ldToken,
        address _treasuryAddress
    ) Ownable(msg.sender) {
        require(_originalNFT != address(0), "Invalid original NFT");
        require(_otherNFT != address(0), "Invalid other NFT");
        require(_ldToken != address(0), "Invalid LD token");
        require(_treasuryAddress != address(0), "Invalid treasury");
        
        originalNFT = IERC721(_originalNFT);
        otherNFT = IERC721(_otherNFT);
        ldToken = IERC20(_ldToken);
        treasuryAddress = _treasuryAddress;
        claimingEnabled = true;
    }
    
    function toggleClaiming() external onlyOwner {
        claimingEnabled = !claimingEnabled;
    }
    
    function claimFromOriginalNFT(uint256[] calldata tokenIds) external nonReentrant {
        require(claimingEnabled, "Claiming is disabled");
        require(tokenIds.length > 0, "No token IDs provided");
        require(tokenIds.length <= 100, "Too many token IDs");
        
        uint256 totalTokens = 0;
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            
            require(!originalNFTClaimed[tokenId], "Token already claimed");
            require(originalNFT.ownerOf(tokenId) == msg.sender, "Not the NFT owner");
            
            originalNFTClaimed[tokenId] = true;
            totalTokens += TOKENS_PER_NFT;
        }
        
        require(ldToken.transfer(msg.sender, totalTokens), "Token transfer failed");
        
        emit OriginalNFTClaimed(msg.sender, tokenIds, totalTokens);
    }
    
    function claimFromOtherNFT(uint256[] calldata tokenIds) external nonReentrant {
        require(claimingEnabled, "Claiming is disabled");
        require(tokenIds.length > 0, "No token IDs provided");
        require(tokenIds.length <= 100, "Too many token IDs");
        
        uint256 totalTokens = 0;
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            
            require(!otherNFTClaimed[tokenId], "Token already claimed");
            require(otherNFT.ownerOf(tokenId) == msg.sender, "Not the NFT owner");
            
            otherNFTClaimed[tokenId] = true;
            
            otherNFT.transferFrom(msg.sender, treasuryAddress, tokenId);
            
            totalTokens += TOKENS_PER_NFT;
        }
        
        require(ldToken.transfer(msg.sender, totalTokens), "Token transfer failed");
        
        emit OtherNFTClaimed(msg.sender, tokenIds, totalTokens);
    }
    
    function getOriginalNFTClaimable(address wallet, uint256[] calldata tokenIds) external view returns (uint256) {
        uint256 claimable = 0;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (!originalNFTClaimed[tokenIds[i]]) {
                try originalNFT.ownerOf(tokenIds[i]) returns (address owner) {
                    if (owner == wallet) {
                        claimable += TOKENS_PER_NFT;
                    }
                } catch {}
            }
        }
        return claimable;
    }
    
    function getOtherNFTClaimable(address wallet, uint256[] calldata tokenIds) external view returns (uint256) {
        uint256 claimable = 0;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (!otherNFTClaimed[tokenIds[i]]) {
                try otherNFT.ownerOf(tokenIds[i]) returns (address owner) {
                    if (owner == wallet) {
                        claimable += TOKENS_PER_NFT;
                    }
                } catch {}
            }
        }
        return claimable;
    }
    
    function isOriginalNFTClaimed(uint256 tokenId) external view returns (bool) {
        return originalNFTClaimed[tokenId];
    }
    
    function isOtherNFTClaimed(uint256 tokenId) external view returns (bool) {
        return otherNFTClaimed[tokenId];
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = ldToken.balanceOf(address(this));
        require(ldToken.transfer(owner(), balance), "Withdrawal failed");
    }
}
