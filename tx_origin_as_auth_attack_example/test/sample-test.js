const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  beforeEach(async function () {
    [deployer, attacker, user] = await ethers.getSigners();

    const SmallWallet = await ethers.getContractFactory("SmallWallet", deployer);
    this.smallWallet = await SmallWallet.deploy();

    await deployer.sendTransaction({ to: this.smallWallet.address, value: 10000 });

    const AttackerContract = await ethers.getContractFactory("Attacker", attacker);
    this.attackerContract = await AttackerContract.deploy(this.smallWallet.address);
  });


  describe("SmallWallet test suite", function () {
    it("Should accept deposits", async function () {
      expect(await ethers.provider.getBalance(this.smallWallet.address)).to.eq(10000);
    });

    it("Should allow owner to withdraw funds", async function () {
      await this.smallWallet.withdrawAll(deployer.address);
      expect(await ethers.provider.getBalance(this.smallWallet.address)).to.eq(0);
    });

  });


  describe("Attack", function () {
    it("Should drain the victim(smallWallet contract) if victim's owner sends ether", async function () {
      const initialAttackerBalance = await ethers.provider.getBalance(attacker.address);
      await deployer.sendTransaction({ to: this.attackerContract.address, value: 1});
      expect(await ethers.provider.getBalance(this.smallWallet.address)).to.eq(0);
      expect(await ethers.provider.getBalance(attacker.address)).to.eq(initialAttackerBalance.add(10000));
    });
  });
});
