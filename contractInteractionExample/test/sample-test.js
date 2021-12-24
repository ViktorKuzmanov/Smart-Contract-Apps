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

  describe("test depositing from Investor contract (NOT externally owned account)", function() {
    it("Should be able to deposit", async function() {
      expect(await this.savingsAccount.balanceOf(this.investor.address)).to.eq(0);
      await this.investor.depositIntoSavingsAccount({value: 100});
      expect(await this.savingsAccount.balanceOf(this.investor.address)).to.eq(100);
    })
    
    it("Should be able to withdraw", async function() {
      expect(await this.savingsAccount.balanceOf(this.investor.address)).to.eq(0);
      await this.investor.depositIntoSavingsAccount({value: 100});
      expect(await this.savingsAccount.balanceOf(this.investor.address)).to.eq(100);
      await this.investor.withdrawFromSavingsAccount();
      expect(await this.savingsAccount.balanceOf(this.investor.address)).to.eq(0);
    })
  })
});


describe("Testing SavingsAccountV2 and InvestorV2 contracts", function () {
  let deployer, user, attacker;

  beforeEach(async function() {
    [deployer, user] = await ethers.getSigners();
    
    const SavingsAccount = await ethers.getContractFactory("SavingsAccountV2", deployer);
    this.savingsAccountV2 = await SavingsAccount.deploy();

    await this.savingsAccountV2.deposit({value: ethers.utils.parseEther("100")});
    await this.savingsAccountV2.connect(user).deposit({value: ethers.utils.parseEther("50")});

    const Investor = await ethers.getContractFactory("InvestorV2", deployer);
    this.investor = await Investor.deploy(this.savingsAccountV2.address);
  })

  describe("SavingsAccountV2 test", function() {
    it("Funds should already be deposited", async function() {
      expect(await this.savingsAccountV2.balanceOf(deployer.address)).to.eq(ethers.utils.parseEther("100"));
      expect(await this.savingsAccountV2.balanceOf(user.address)).to.eq(ethers.utils.parseEther("50"));
    })
    
    it("Should accept withdraws", async function() {
      this.savingsAccountV2.withdraw();

      const deployerBalance = await this.savingsAccountV2.balanceOf(deployer.address);
      const userBalance = await this.savingsAccountV2.balanceOf(user.address);

      expect(deployerBalance).to.eq(0);
      expect(userBalance).to.eq(ethers.utils.parseEther("50"));
    })
  })
});
