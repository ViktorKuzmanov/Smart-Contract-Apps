//SPDX-License-Identifier: Unlicense
pragma solidity 0.6.0;

contract VictimContract {
    address public owner;
    mapping(address => uint256) public balanceOf;
    uint256 public totalSupply;

    constructor(uint256 _initialSupply) public {
        totalSupply = _initialSupply;
        balanceOf[msg.sender] = _initialSupply;
        owner = msg.sender;
    }

    function transfer(address _to, uint256 _amount) public {
        // to fix this overflow error just check for "balanceOf[msg.sender] >= _amount"
        require(balanceOf[msg.sender] - _amount >= 0,"Not enough tokens");
        balanceOf[msg.sender] -= _amount;
        balanceOf[_to] += _amount;
    }

    function mint(uint256 amount) external {
        totalSupply += amount;
        balanceOf[owner] += amount;
    }
}
