// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract LDToken is ERC20, AccessControl {
    bytes32 public constant CLAIM_MANAGER_ROLE = keccak256("CLAIM_MANAGER_ROLE");
    
    uint256 public constant TOTAL_SUPPLY = 200_000_000 * 10**18;
    
    constructor() ERC20("Liminal Dreams", "LD") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _mint(msg.sender, TOTAL_SUPPLY);
    }
    
    function grantClaimManagerRole(address claimManager) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(CLAIM_MANAGER_ROLE, claimManager);
    }
    
    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        return super.transfer(to, amount);
    }
    
    function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
        return super.transferFrom(from, to, amount);
    }
}
