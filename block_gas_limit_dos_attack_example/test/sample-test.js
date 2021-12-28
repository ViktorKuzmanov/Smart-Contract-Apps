const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Dos attack", function () {

  beforeEach(async function() {
    [deployer, attacker, user] = await ethers.getSigners();

    const Auction = await ethers.getContractFactory("Auction", deployer);
    this.auction = await Auction.deploy();

    this.auction.bid({value: 100});
  })


  describe("Auction", function() {
    describe("if bid is lower than higherstBid", function() {
      it("Should NOT accept bids lower than current", async function () {
        await expect(this.auction.connect(user).bid({value: 50})).to.be.revertedWith("Not big enough bid");
      });
    })
    describe("if bid is higher than higherstBid", function() {
      it("Should accept it and update highestBid", async function () {
        await this.auction.connect(user).bid({value :150});
        expect(await this.auction.highestBid()).to.eq(150);
      });
      it("Should make msg.sender currentLeader", async function () {
        await this.auction.connect(user).bid({value :150});
        expect(await this.auction.currentLeader()).to.eq(user.address);
      });
      it("Should add previous leader and highestBid to refunds", async function () {
        await this.auction.connect(user).bid({ value: 150 });
        [addr, amount] = await this.auction.refunds(0);
        expect(addr).to.eq(deployer.address);
        expect(amount).to.eq(100);
      });
    })
  })

  describe("When calling refundAll", function() {
    it("Should refund the bidders that didn't win", async function () {
      await this.auction.connect(user).bid({ value: 150 });
        await this.auction.bid({ value: 200 });

        const userBalanceBefore = await ethers.provider.getBalance(user.address);
        await this.auction.refundAll();
        const userBalanceAfter = await ethers.provider.getBalance(user.address);

        expect(userBalanceAfter).to.eq(userBalanceBefore.add(150));
    });
    it("Should revert if the amount of computations hits the block gas limit", async function () {
      for (let i = 0; i < 1500; i++) {
        await this.auction.connect(attacker).bid({ value: 150 + i });
      }
      await this.auction.refundAll();
    });
  })
});
