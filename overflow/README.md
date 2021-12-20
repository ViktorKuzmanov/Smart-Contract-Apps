this hardhat project shows important Overflow vunerability in
smart conracts with version less than 0.8.0

VictimContract.sol:

- In the transfer function the require statement doesnt check for 
anything beacause the difference between 2 uint numbers will always be uint again.
And it never reverts the transactions because of overflow problem.
This is an overflow error, and solidity doesn't check for this error because 
we are using version 0.6.0




