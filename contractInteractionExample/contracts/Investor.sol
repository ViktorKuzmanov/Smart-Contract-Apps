// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

interface ISavingsAccount {
    function deposit() external payable;
    function withdraw() external;
}

contract Investor is Ownable {
    // this immutable is read-only, but assignable in the constructor
    ISavingsAccount public immutable savingsAccount;

    constructor(address savingsAccountAddress) {
        savingsAccount = ISavingsAccount(savingsAccountAddress);
    }

    function depositIntoSavingsAccount() external payable onlyOwner {
        savingsAccount.deposit{value: msg.value}();
    }

    function withdrawFromSavingsAccount() external onlyOwner {
        savingsAccount.withdraw();
    }

    receive() external payable {}
}