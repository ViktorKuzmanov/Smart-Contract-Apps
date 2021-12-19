this hardhat project shows the important Overflow vunerability in
smart conracts with version less than 0.8.0

In the transfer function the require statement doesnt check for 
anything and it never reverts the transactions because of overflow problem.




