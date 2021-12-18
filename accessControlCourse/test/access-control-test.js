const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Access Control", function () {

  let deployer, attacker, user;

  this.beforeEach(async function() {
    [deployer, attacker, user] = await ethers.getSigners();

    const AgreedPrice = await ethers.getContractFactory("AgreedPrice", deployer);
    this.agreedPrice = await AgreedPrice.deploy(100);
  })

  describe("AgreedPrice", ()=>{
    it("should set price at deployment", async function() {
      expect(await this.agreedPrice.price()).to.eq(100);
    })
  })

  // this test should fail:
  // it("should be possible for anyone to change price", async function() {
  //   await this.agreedPrice.connect(attacker).updatePrice(1000);
  //   expect(await this.agreedPrice.price()).to.eq(1000);
  // })

  it("should set the deployer account as the owner", async function() {
    expect(await this.agreedPrice.owner()).to.eq(deployer.address);
  })

  it("should be possible for owner to change the price", async function(){
    // the owner is trying to set the price
    await this.agreedPrice.updatePrice(1000);
    expect(await this.agreedPrice.price()).to.eq(1000);
  })

  it("should NOT be possible for anyone other than the owner to change the price", async function(){
    await expect(this.agreedPrice.connect(attacker).updatePrice(1000)).to.be.revertedWith("Ownable: caller is not the owner")
  })

  it("should be possible for owner to transfer ownership", async function() {
    await this.agreedPrice.transferOwnership(user.address);
    expect(await this.agreedPrice.owner()).to.eq(user.address);
  })
  it("should be possible for new owner to call updatePrice/change price", async function() {
    await this.agreedPrice.transferOwnership(user.address);
    await this.agreedPrice.connect(user).updatePrice(1000);
    expect(await this.agreedPrice.price()).to.eq(1000);
  })
  it("should NOT be possible for anyone other than the owner to transfer ownership", async function() {
    await expect(this.agreedPrice.connect(attacker).transferOwnership(attacker.address)).to.be.revertedWith("Ownable: caller is not the owner");
  })
  
});
