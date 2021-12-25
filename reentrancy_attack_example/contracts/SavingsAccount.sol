// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Address.sol";

contract SavingsAccount {
    using Address for address payable;
    mapping(address=>uint256) public balanceOf;

    function deposit() external payable {
        balanceOf[msg.sender] += msg.value;
    }

    function withdraw() external payable {
        uint256 amountDeposited = balanceOf[msg.sender];
        balanceOf[msg.sender] = 0;
        payable(msg.sender).sendValue(amountDeposited);
    }
}