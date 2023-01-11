const {ethers} = require("hardhat")
require("dotenv").config({path:".env"})
const {CRYPTO_DEVS_NFT_CONTRACT_ADDRESS} = require('../constants')
async function main(){
  const cryptoDevsContract = CRYPTO_DEVS_NFT_CONTRACT_ADDRESS;
  const cryptoDevsTokenContract = await ethers.getContractFactory("cryptoDevToken")
  const deployedCryptoDevsTokenContract =await cryptoDevsTokenContract.deploy(cryptoDevsContract)
  await deployedCryptoDevsTokenContract.deployed()
  console.log("Contract deployed at " + deployedCryptoDevsTokenContract.address)

}

main()
.then(()=>process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
})