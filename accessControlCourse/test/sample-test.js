const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Access Control", function () {

  let deployer, attacker;

  this.beforeEach(async function() {
    [deployer, attacker] = await ethers.getSigners();

    const AgreedPrice = await ethers.getContractFactory("AgreedPrice", deployer);
    this.agreedPrice = await AgreedPrice.deploy(100);
  })

  describe("AgreedPrice", ()=>{
    it("should set price at deployment", async function() {
      expect(await this.agreedPrice.price()).to.eq(100);
    })
  })

  it("should be possible for anyone to change price", async function() {
    await this.agreedPrice.connect(attacker).updatePrice(1000);
    expect(await this.agreedPrice.price()).to.eq(1000);
  })
  
});
