// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SmallWallet {
    address public owner;
    constructor() {
        owner = tx.origin;
    }

    function withdrawAll(address recipient) external payable {
        require(owner == tx.origin, "Recipient is not owner");
        payable(recipient).transfer(address(this).balance);
    }

    receive() external payable {}
}