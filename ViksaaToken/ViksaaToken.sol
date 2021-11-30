// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ViksaaToken {
    mapping(address=>uint256) public balances;
    // addres to the right will pull your tokens from your adress to its adress. 
    // the uint256 in the nested mapping is the amount you can spend on your behalf
    // spender => (actualPerson => amountPersonWhatsTOSpend)
    mapping(address => mapping(address=>uint256)) public allowances;

    uint public totalSupply = 39000 * 10 ** 18;
    string public name = "ViksaaToken";
    string public tokenSymbol = "VIKSA";
    // It defines the smallest fraction of the token that you can transfer
    uint256 decimals = 18;

    constructor() {
        balances[msg.sender] = totalSupply;
    }

    function balanceOf(address someGuy) public view returns(uint256) {
        return balances[someGuy];
    }

    event Transfer(address from, address to, uint256 value);

    function transfer(address to, uint256 value) public returns(bool) {
        require(balanceOf(msg.sender) >= value, "Balance is too low");
        balances[msg.sender] -= value;
        balances[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    event Approval(address owner, address spender, uint256 amount);

    function approval(address spender, uint256 value) public returns(bool) {
        allowances[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 value) public returns(bool) {
        require(allowances[from][msg.sender] >= value, "allowance too low");
        require(balanceOf(from) >= value, "balance too low");
        balances[from] -= value;
        balances[to] += value;
        emit Transfer(from, to, value);
        return true;
    }
}