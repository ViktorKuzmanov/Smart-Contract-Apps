// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

contract AgreedPrice {
    uint256 public price;
    address public owner;
    
    constructor(uint256 _price) {
        price = _price;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can change the price");
        _;
    }

    function updatePrice(uint256 _price) external onlyOwner() {
        price = _price;
    }
}