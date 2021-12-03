import React, { useState, useEffect } from "react";
import { getWeb3, getMultiSigWallet } from "./utils.js";
import Header from "./Header";

function App() {
	// when App component mounts we still haven't imported web3
	// and that's why its undefined
	const [web3, setWeb3] = useState(undefined);
	const [accounts, setAccounts] = useState(undefined);
	const [wallet, setWallet] = useState(undefined);
	// Define quorum and approvers state (data from smart contract)
	const [approvers, setApprovers] = useState([]);
	const [quorum, setQuorum] = useState(undefined);

	useEffect(() => {
		const init = async () => {
			const web3 = getWeb3();
			const accounts = await web3.eth.getAccounts();
			const wallet = await getMultiSigWallet(web3);
			// ? read approvers and quorum from the smart contract
			const approvers = await wallet.methods.getApprovers().call();
			const quorum = await wallet.methods.quorum().call();
			setWeb3(web3);
			setAccounts(accounts);
			setWallet(wallet);
			setApprovers(approvers);
			setQuorum(quorum);
		};
		init();
	}, []);

	if (typeof web3 === "undefined" || typeof accounts === "undefined" || typeof wallet === "undefined" || approvers.length === 0 || typeof quorum === "undefined") {
		return <div>Loading...</div>;
	}

	return (
		<div>
			{" "}
			<p>Multi sig wallet app</p>
			<Header approvers={approvers} quorum={quorum} />
		</div>
	);
}

export default App;
