const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Testing SavingsAccount contract", function () {
  let deployer, user;

  beforeEach(async function() {
    [deployer, user] = await ethers.getSigners();
    
    const SavingsAccount = await ethers.getContractFactory("SavingsAccount", deployer);
    this.savingsAccount = await SavingsAccount.deploy();

    const Investor = await ethers.getContractFactory("Investor", deployer);
    this.investor = await Investor.deploy(this.savingsAccount.address);
  })

  describe("test depositing from externally owned account (not from Investor account)", function() {
    it("Should be able to deposit", async function() {
      expect(await this.savingsAccount.balanceOf(user.address)).to.eq(0);
      await this.savingsAccount.connect(user).deposit({value: 10});
      expect(await this.savingsAccount.balanceOf(user.address)).to.eq(10);
    })
    
    it("Should be able to withdraw", async function() {
      expect(await this.savingsAccount.balanceOf(user.address)).to.eq(0);
      await this.savingsAccount.connect(user).deposit({value: 10});
      expect(await this.savingsAccount.balanceOf(user.address)).to.eq(10);
      await this.savingsAccount.connect(user).withdraw();
      expect(await this.savingsAccount.balanceOf(user.address)).to.eq(0);
    })
  })
});
