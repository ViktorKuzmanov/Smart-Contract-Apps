// this is a file to put the initialization logic for web3

// import the web3 object
import Web3 from "web3";
// import the contract artifact we got from previosly from deploying out smart contract
import Wallet from "./contracts/MultiSigWallet.json";

// a function that instantiates the web3 object
const getWeb3 = () => {
	// we are going to pass the url of the node that runs our development blockchain aka ganache
	// http://127.0.0.1:9545/ in this case
	// with this web3 object we have a connection to our local development blockchain
	return new Web3("http://127.0.0.1:9545");
};

// create a contract instance - an object that is produced by web3
// that allow you to directly interact with the smart contract to read and write data to the sc
const getMultiSigWallet = async (web3) => {
	// exract the networkId from the contract apstracion
	const networkId = await web3.eth.net.geId();
	// extract the info from the conract artifact
	const contractDeployment = Wallet.networks[networkId];
	// we are going to pass the ABI(json object that defines the
	// function signature of the sc so web3 knows how to call these functions)
	// of our smart contract
	// we use && to make sure contractDeployment is not undefined
	return new web3.eth.Contract(Wallet.abi, contractDeployment && contractDeployment.address);
};

export { getWeb3, getMultiSigWallet };
