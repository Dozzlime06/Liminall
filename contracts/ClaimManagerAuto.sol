// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ClaimManagerAuto is Ownable, ReentrancyGuard {
    IERC721 public immutable originalNFT;
    IERC721 public immutable otherNFT;
    IERC20 public immutable ldToken;
    address public immutable treasuryAddress;
    
    uint256 public constant TOKENS_PER_NFT = 25_000 * 10**18;
    
    mapping(uint256 => bool) public originalNFTClaimed;
    mapping(uint256 => bool) public otherNFTClaimed;
    
    bool public claimingEnabled;
    
    event TokensClaimed(
        address indexed claimer, 
        uint256 originalCount, 
        uint256 otherCount, 
        uint256 totalAmount
    );
    
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
    
    function claimTokens(
        uint256[] calldata originalTokenIds,
        uint256[] calldata otherTokenIds
    ) external nonReentrant {
        require(claimingEnabled, "Claiming is disabled");
        require(
            originalTokenIds.length + otherTokenIds.length > 0, 
            "No token IDs provided"
        );
        
        uint256 totalTokens = 0;
        
        for (uint256 i = 0; i < originalTokenIds.length; i++) {
            uint256 tokenId = originalTokenIds[i];
            
            require(!originalNFTClaimed[tokenId], "Original NFT already claimed");
            require(originalNFT.ownerOf(tokenId) == msg.sender, "Not owner of original NFT");
            
            originalNFTClaimed[tokenId] = true;
            totalTokens += TOKENS_PER_NFT;
        }
        
        for (uint256 i = 0; i < otherTokenIds.length; i++) {
            uint256 tokenId = otherTokenIds[i];
            
            require(!otherNFTClaimed[tokenId], "Other NFT already claimed");
            require(otherNFT.ownerOf(tokenId) == msg.sender, "Not owner of other NFT");
            
            otherNFTClaimed[tokenId] = true;
            
            otherNFT.transferFrom(msg.sender, treasuryAddress, tokenId);
            
            totalTokens += TOKENS_PER_NFT;
        }
        
        require(ldToken.transfer(msg.sender, totalTokens), "Token transfer failed");
        
        emit TokensClaimed(
            msg.sender, 
            originalTokenIds.length, 
            otherTokenIds.length, 
            totalTokens
        );
    }
    
    function getUserClaimableNFTs(address wallet) external view returns (
        uint256[] memory originalTokenIds,
        uint256[] memory otherTokenIds,
        uint256 totalClaimable
    ) {
        uint256 originalBalance = originalNFT.balanceOf(wallet);
        uint256 otherBalance = otherNFT.balanceOf(wallet);
        
        uint256[] memory tempOriginal = new uint256[](originalBalance);
        uint256[] memory tempOther = new uint256[](otherBalance);
        uint256 originalCount = 0;
        uint256 otherCount = 0;
        
        for (uint256 i = 0; i < 10000 && originalCount < originalBalance; i++) {
            try originalNFT.ownerOf(i) returns (address owner) {
                if (owner == wallet && !originalNFTClaimed[i]) {
                    tempOriginal[originalCount] = i;
                    originalCount++;
                }
            } catch {}
        }
        
        for (uint256 i = 0; i < 10000 && otherCount < otherBalance; i++) {
            try otherNFT.ownerOf(i) returns (address owner) {
                if (owner == wallet && !otherNFTClaimed[i]) {
                    tempOther[otherCount] = i;
                    otherCount++;
                }
            } catch {}
        }
        
        originalTokenIds = new uint256[](originalCount);
        otherTokenIds = new uint256[](otherCount);
        
        for (uint256 i = 0; i < originalCount; i++) {
            originalTokenIds[i] = tempOriginal[i];
        }
        
        for (uint256 i = 0; i < otherCount; i++) {
            otherTokenIds[i] = tempOther[i];
        }
        
        totalClaimable = (originalCount + otherCount) * TOKENS_PER_NFT;
        
        return (originalTokenIds, otherTokenIds, totalClaimable);
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = ldToken.balanceOf(address(this));
        require(ldToken.transfer(owner(), balance), "Withdrawal failed");
    }
}
