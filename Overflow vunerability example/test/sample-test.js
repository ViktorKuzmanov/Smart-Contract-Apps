const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Overflow error test", function () {
  
  beforeEach(async function() {
    [deployer, attacker, user] = await ethers.getSigners();

    const VictimContract = await ethers.getContractFactory("VictimContract", deployer);
    this.victimConract = await VictimContract.deploy(1000);
  });

  it("Should should allow a user to transfer amounts smaller or equal to its balance", async function () {
    await this.victimConract.transfer(user.address, 10);
    expect(await this.victimConract.balanceOf(user.address)).to.eq(10);
    expect(await this.victimConract.balanceOf(deployer.address)).to.eq((await this.victimConract.totalSupply()) - 10);
  });

  // This test will fail because there is an overflwo error in the contract
  // Test this code for this test to pass - the attacker gets max tokens because of the overflow error
  // expect(await this.victimConract.balanceOf(attacker.address)).to.eq(ethers.constants.MaxUint256);
  it("Should revert if the user tries totransfer an amount greater that its balance", async function () {
    await this.victimConract.transfer(attacker.address, 10);
    await this.victimConract.connect(attacker).transfer(user.address, 11);

    await expect(this.victimConract.connect(attacker).transfer(user.address, 11)).to.be.revertedWith("Not enough tokens");;    
  });
});
