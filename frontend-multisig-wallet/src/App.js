import React, { useState, useEffect } from "react";
import { getWeb3, getMultiSigWallet } from "./utils.js";
import Header from "./Header";
// TODO import newTrandfe component
// TODO import transferList component
import NewTransfer from "./NewTransfer.js";
import TransferList from "./TransferList.js";

function App() {
	// when App component mounts we still haven't imported web3
	// and that's why its undefined
	const [web3, setWeb3] = useState(undefined);
	const [accounts, setAccounts] = useState(undefined);
	const [wallet, setWallet] = useState(undefined);
	// Define quorum and approvers state (data from smart contract)
	const [approvers, setApprovers] = useState([]);
	const [quorum, setQuorum] = useState(undefined);
	// todo transferst state
	const [transfers, setTransfers] = useState([]);

	useEffect(() => {
		const init = async () => {
			// todo await treba da e vaa funkcija aa kej a immplementiras so metamask
			const web3 = await getWeb3();
			const accounts = await web3.eth.getAccounts();
			const wallet = await getMultiSigWallet(web3);
			// ? read approvers and quorum from the smart contract
			const approvers = await wallet.methods.getApprovers().call();
			const quorum = await wallet.methods.quorum().call();
			// todo load the transfers and update their state
			const transfers = await wallet.methods.getTransfers().call();
			setTransfers(transfers);
			setWeb3(web3);
			setAccounts(accounts);
			setWallet(wallet);
			setApprovers(approvers);
			setQuorum(quorum);
		};
		init();
	}, []);

	// TODO create the createTransfer function
	// we use send because we want to create the transaction and
	// we use
	const createTransfer = (transfer) => {
		wallet.methods.createTransfer(transfer.amount, transfer.to).send({ from: accounts[0] });
	};

	// todo approve transfer function and pass the approveTranfser function
	const approveTransfer = (transferId) => {
		wallet.methods.approveTransfer(transferId).send({ from: accounts[0] });
	};

	if (typeof web3 === "undefined" || typeof accounts === "undefined" || typeof wallet === "undefined" || approvers.length === 0 || typeof quorum === "undefined") {
		return <div>Loading...</div>;
	}

	return (
		<div>
			{" "}
			<p>Multi sig wallet app</p>
			<Header approvers={approvers} quorum={quorum} />
			<NewTransfer createTransfer={createTransfer} />
			<TransferList transfers={transfers} approveTransfer={approveTransfer} />
		</div>
	);
}

export default App;
