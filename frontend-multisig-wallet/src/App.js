import React, { useState, useEffect } from "react";
import { getWeb3, getMultiSigWallet } from "./utils.js";

function App() {
	// when App component mounts we still haven't imported web3
	// and that's why its undefined
	const [web3, setWeb3] = useState(undefined);
	const [acccounts, setAccounts] = useState(undefined);
	const [wallet, setWallet] = useState(undefined);

	useEffect(() => {
		const init = () => {
			const web3 = getWeb3();
			const accounts = web3.eth.getAccounts();
			const wallet = getMultiSigWallet();
			setWeb3(web3);
			setAccounts(acccounts);
			setWallet(wallet);
		};
		init();
	}, []);

	if (typeof web3 === "undefined" || typeof accounts === "undefined" || typeof wallet === "undefined") {
		return <div>Loading...</div>;
	}

	return <div>Multi sig wallet app</div>;
}

export default App;
