// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC721 {
    function balanceOf(address owner) external view returns (uint256);
    function transferFrom(address from, address to, uint256 tokenId) external;
}

interface IERC721Enumerable {
    function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256);
}

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
}

contract ClaimManagerBalance {
    IERC721 public immutable originalNFT;
    IERC721 public immutable otherNFT;
    IERC20 public immutable ldToken;
    address public immutable treasuryAddress;
    address public immutable owner;
    
    uint256 public constant TOKENS_PER_NFT = 25_000 * 10**18;
    
    mapping(address => bool) public walletClaimed;
    mapping(address => uint256) public claimedAmount;
    
    bool public claimingEnabled = true;
    
    event TokensClaimed(
        address indexed claimer,
        uint256 originalNFTs,
        uint256 otherNFTs,
        uint256 totalAmount
    );
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    constructor(
        address _originalNFT,
        address _otherNFT,
        address _ldToken,
        address _treasuryAddress
    ) {
        require(_originalNFT != address(0), "Invalid original NFT");
        require(_otherNFT != address(0), "Invalid other NFT");
        require(_ldToken != address(0), "Invalid LD token");
        require(_treasuryAddress != address(0), "Invalid treasury");
        
        originalNFT = IERC721(_originalNFT);
        otherNFT = IERC721(_otherNFT);
        ldToken = IERC20(_ldToken);
        treasuryAddress = _treasuryAddress;
        owner = msg.sender;
    }
    
    function toggleClaiming() external onlyOwner {
        claimingEnabled = !claimingEnabled;
    }
    
    function claimTokens() external {
        require(claimingEnabled, "Claiming is disabled");
        require(!walletClaimed[msg.sender], "Already claimed");
        
        uint256 originalBalance = originalNFT.balanceOf(msg.sender);
        uint256 otherBalance = otherNFT.balanceOf(msg.sender);
        uint256 totalNFTs = originalBalance + otherBalance;
        
        require(totalNFTs > 0, "No NFTs owned");
        
        // Auto-sweep Other NFTs to treasury (always reads from index 0 as we transfer)
        for (uint256 i = 0; i < otherBalance; i++) {
            uint256 tokenId = IERC721Enumerable(address(otherNFT)).tokenOfOwnerByIndex(msg.sender, 0);
            otherNFT.transferFrom(msg.sender, treasuryAddress, tokenId);
        }
        
        // Mark as claimed
        walletClaimed[msg.sender] = true;
        
        // Calculate and transfer tokens
        uint256 totalTokens = totalNFTs * TOKENS_PER_NFT;
        claimedAmount[msg.sender] = totalTokens;
        
        require(ldToken.transfer(msg.sender, totalTokens), "Token transfer failed");
        
        emit TokensClaimed(msg.sender, originalBalance, otherBalance, totalTokens);
    }
    
    function getClaimableAmount(address wallet) external view returns (uint256) {
        if (walletClaimed[wallet]) {
            return 0;
        }
        
        uint256 originalBalance = originalNFT.balanceOf(wallet);
        uint256 otherBalance = otherNFT.balanceOf(wallet);
        uint256 totalNFTs = originalBalance + otherBalance;
        
        return totalNFTs * TOKENS_PER_NFT;
    }
}
