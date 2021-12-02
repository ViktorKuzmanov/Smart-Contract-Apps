const MultiSigWallet = artifacts.require("MultiSigWallet");
const { expectRevert } = require("@openzeppelin/test-helpers");
const { web3 } = require("@openzeppelin/test-helpers/src/setup");

contract("MultiSigWallet", (accounts) => {
	let wallet;
	beforeEach(async () => {
		wallet = await MultiSigWallet.new([accounts[0], accounts[1], accounts[2]], 2);
		await web3.eth.sendTransaction({ from: accounts[0], to: wallet.address, value: 690 });
	});

	it("it should have correct approveers nad quorum", async () => {
		const approvers = await wallet.getApprovers();
		const quorum = await wallet.quorum();
		assert(approvers.length === 3);
		assert(approvers[0] === accounts[0]);
		assert(approvers[1] === accounts[1]);
		assert(approvers[2] === accounts[2]);
		assert(quorum.toNumber() === 2);
	});

	it("should create transfers", async () => {
		await wallet.createTransfer(9, accounts[4], { from: accounts[0] });
		const transfers = await wallet.getTransfers();
		assert(transfers.length === 1);
		assert(transfers[0].id === "0");
		assert(transfers[0].amount === "9");
		assert(transfers[0].to == accounts[4]);
		assert(transfers[0].approvals === "0");
		assert(transfers[0].sent === false);
	});

	it("should NOT create transfer if sender is not approved", async () => {
		// we are testing the unhappy path here contracry to before
		// when we where testing the happy path
		// call the funcion in a way they will provoke error
		await expectRevert(wallet.createTransfer(10, accounts[5], { from: accounts[4] }), "only approved is allowed");
	});

	it("should increment approval", async () => {
		await wallet.createTransfer(100, accounts[5], { from: accounts[0] });
		await wallet.approveTransfer(0, { from: accounts[0] });
		const transfers = await wallet.getTransfers();
		const balance = await web3.eth.getBalance(wallet.address);
		assert(transfers[0].approvals === "1");
		assert(transfers[0].sent === false);
		// 690 was the initial balance of the smart contract
		assert(balance === "690");
	});

	it("should send transfer if quorum reached", async () => {
		const balanceBefore = web3.utils.toBN(await web3.eth.getBalance(accounts[6]));
		await wallet.createTransfer(100, accounts[6], { from: accounts[0] });
		await wallet.approveTransfer(0, { from: accounts[0] });
		await wallet.approveTransfer(0, { from: accounts[1] });
		const balanceAfter = web3.utils.toBN(await web3.eth.getBalance(accounts[6]));
		assert(balanceAfter.sub(balanceBefore).toNumber() === 100);
	});

	it("should NOT approve transfer if sender is not approved", async () => {
		await wallet.createTransfer(100, accounts[5], { from: accounts[0] });
		await expectRevert(wallet.approveTransfer(0, { from: accounts[4] }), "only approved is allowed");
	});

	it("should NOT approve transfer if transfer is already sent", async () => {
		await wallet.createTransfer(100, accounts[6], { from: accounts[0] });
		await wallet.approveTransfer(0, { from: accounts[0] });
		await wallet.approveTransfer(0, { from: accounts[1] });
		await expectRevert(wallet.approveTransfer(0, { from: accounts[2] }), "this transfer was send already");
	});

	it("should NOT approve transfer twice", async () => {
		await wallet.createTransfer(100, accounts[6], { from: accounts[0] });
		await wallet.approveTransfer(0, { from: accounts[0] });
		await expectRevert(wallet.approveTransfer(0, { from: accounts[0] }), "this cannot be approved twice");
	});
});
