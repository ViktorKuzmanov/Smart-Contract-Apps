// this is a file to put the initialization logic for web3

// import the web3 object
import Web3 from "web3";
// import the contract artifact we got from previosly from deploying out smart contract
import Wallet from "./contracts/MultiSigWallet.json";
import detectEthereumProvider from "@metamask/detect-provider";

// a function that instantiates the web3 object
// TODO smeni a vaa funkcija da se integrira metammask treba takov web3 object ni treba
const getWeb3 = () =>
	new Promise(async (resolve, reject) => {
		let provider = await detectEthereumProvider();

		if (provider) {
			await provider.request({ method: "eth_requestAccounts" });

			try {
				const web3 = new Web3(window.ethereum);

				resolve(web3);
			} catch (error) {
				reject(error);
			}
		}
		reject("Install Metamask");
	});
// const getWeb3 = () => {
// 	return new Promise((resolve, reject) => {
// 		// Wait for loading completion to avoid race conditions with web3 injection timing.
// 		window.addEventListener("load", async () => {
// 			// Modern dapp browsers...
// 			if (window.ethereum) {
// 				const web3 = new Web3(window.ethereum);
// 				try {
// 					// Request account access if needed
// 					await window.ethereum.enable();
// 					// Acccounts now exposed
// 					resolve(web3);
// 				} catch (error) {
// 					reject(error);
// 				}
// 			}
// 			// Legacy dapp browsers...
// 			else if (window.web3) {
// 				// Use Mist/MetaMask's provider.
// 				const web3 = window.web3;
// 				console.log("Injected web3 detected.");
// 				resolve(web3);
// 			}
// 			// Fallback to localhost; use dev console port by default...
// 			else {
// 				const provider = new Web3.providers.HttpProvider("http://localhost:9545");
// 				const web3 = new Web3(provider);
// 				console.log("No web3 instance injected, using Local web3.");
// 				resolve(web3);
// 			}
// 		});
// 	});
// };

// create a contract instance - an object that is produced by web3
// that allow you to directly interact with the smart contract to read and write data to the sc
const getMultiSigWallet = async (web3) => {
	// exract the networkId from the contract apstracion
	const networkId = await web3.eth.net.getId();
	// extract the info from the conract artifact
	const contractDeployment = Wallet.networks[networkId];
	// we are going to pass the ABI(json object that defines the
	// function signature of the sc so web3 knows how to call these functions)
	// of our smart contract
	// we use && to make sure contractDeployment is not undefined
	return new web3.eth.Contract(Wallet.abi, contractDeployment && contractDeployment.address);
};

export { getWeb3, getMultiSigWallet };
