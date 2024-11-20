// SPDX-License-Identifier: MIT
// Find the vuln, write the exploit POC, how to mitigate, and what is the flag
pragma solidity ^0.8.18;
import "forge-std/Test.sol";

/*
Your mission: Find a way to bypass this security measure.
Objective: Make vaultManager.accessGranted() return true
Difficulty: Medium
FLAG FORMAT: "CTF{address_that_succeeded}"

RULES:
1. The VaultManager contract cannot be modified
2. You can only write code in testVaultAccess()
3. The vault must be accessed programmatically
4. No external contract deployments allowed
*/

contract ContractTest is Test {
    VaultManager public vaultManager;
    
    constructor() {
        vaultManager = new VaultManager();
    }
    
    function testVaultAccess() public {

        assertFalse(vaultManager.accessGranted(), "Invalid initial state");

        vm.expectEmit(true, true, true, true);
        emit VaultManager.AccessGranted();
        
        // Challenge: Write your solution here
        // Tip: Study how validateUser() determines if an address belongs to a contract
        
        assertTrue(vaultManager.accessGranted(), "Challenge incomplete: The vault remains locked");
    }
}

contract VaultManager {
    bool public accessGranted;
    event AccessGranted();
    
    function validateUser(address account) public view returns (bool) {
        uint256 codeFootprint;
        assembly {
            codeFootprint := extcodesize(account)
        }
        return codeFootprint > 0;
    }
    
    function authenticateAccess() external {
        require(!validateUser(msg.sender), "Access denied: Contracts not allowed");
        accessGranted = true;
        emit AccessGranted();
    }
}
