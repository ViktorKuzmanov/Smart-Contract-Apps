//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Valut is Ownable {
    bytes32 private password;

    constructor(bytes32 _password) {
        password = _password;
    }

    function deposit() external payable onlyOwner {}

    modifier checkPassword(bytes32 _password) {
        require(_password == password, "Wrong password");
        _;
    }

    function withdraw(bytes32 _password) external checkPassword(_password) {
        payable(msg.sender).transfer(address(this).balance);
    }
}
