// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;

contract Proxy {
    uint256 x;
    address owner;
    address logicContract;

    constructor(address _logicContract) {
        logicContract = _logicContract;
        owner = msg.sender;
    }

    function upgrade(address _newContractAddress) external {
        require(msg.sender == owner, "Accss restricted");
        logicContract = _newContractAddress;
    }

    fallback() external {
        (bool success, )= logicContract.delegatecall(msg.data);
        require(success, "Unexpected error");
    }
}