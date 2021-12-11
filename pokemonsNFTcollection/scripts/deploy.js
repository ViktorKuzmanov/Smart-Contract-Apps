const { CloudflareProvider } = require("@ethersproject/providers");
const { ethers } = require("hardhat");

async function main() {
	// compiled smart contract
	const Pokemons = await ethers.getContractFactory("Pokemons");
	// depoyled smat contract
	const pokemons = await Pokemons.deploy("PokemonsNFTCollection", "POKE");

	await pokemons.deployed();

	console.log("this contract is deployed ", pokemons.address);

	await pokemons.mint("https://ipfs.io/ipfs/Qmf8zMcNVaEiRFFEsncq15m2h5HPUwZBipacW4aBxbdhop");

	console.log("nft is minted");
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
