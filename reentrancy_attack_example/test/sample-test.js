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


describe("Reentrancy", function () {
  let deployer, user, attacker;

  beforeEach(async function () {
    [deployer, user, attacker] = await ethers.getSigners();

    const SavingsAccountV2 = await ethers.getContractFactory("SavingsAccountV2", deployer);
    this.savingsAccountV2 = await SavingsAccountV2.deploy();

    await this.savingsAccountV2.deposit({ value: ethers.utils.parseEther("100") });
    await this.savingsAccountV2.connect(user).deposit({ value: ethers.utils.parseEther("50") });

    const InvestorV2 = await ethers.getContractFactory("InvestorV2", attacker);
    this.investorV2 = await InvestorV2.deploy(this.savingsAccountV2.address);
  });

  describe("SavingsAccountV2", function () {
    it("Should accept deposits", async function () {
      const deployerBalance = await this.savingsAccountV2.balanceOf(deployer.address);
      expect(deployerBalance).to.eq(ethers.utils.parseEther("100"));

      const userBalance = await this.savingsAccountV2.balanceOf(user.address);
      expect(userBalance).to.eq(ethers.utils.parseEther("50"));
    });

    it("Should accept withdrawals", async function () {
      await this.savingsAccountV2.withdraw();

      const deployerBalance = await this.savingsAccountV2.balanceOf(deployer.address);
      const userBalance = await this.savingsAccountV2.balanceOf(user.address);

      expect(deployerBalance).to.eq(0);
      expect(userBalance).to.eq(ethers.utils.parseEther("50"));
    });

    it("InvestorV2 Attack", async function () {
      console.log("");
      console.log("*** Before ***");
      console.log(`SavingsAccountV2's balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(this.savingsAccountV2.address)).toString()}`);
      console.log(`Attackers's balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(attacker.address)).toString()}`);

      await this.investorV2.attack({ value: ethers.utils.parseEther("10") });

      console.log("");
      console.log("*** After ***");
      console.log(`SavingsAccountV2's balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(this.savingsAccountV2.address)).toString()}`);
      console.log(`Attackers's balance: ${ethers.utils.formatEther(await ethers.provider.getBalance(attacker.address)).toString()}`);
      console.log("");

      expect(await ethers.provider.getBalance(this.savingsAccountV2.address)).to.eq(0);
    });
  });
});