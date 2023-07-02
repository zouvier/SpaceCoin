const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const SpaceCoinFactory = await hre.ethers.getContractFactory("SpaceCoinDeployer");
  const spaceCoin = await SpaceCoinFactory.deploy([deployer.address],deployer.address);

  await spaceCoin.deployed();

  console.log("Deployer Address:", spaceCoin.address);
  console.log("SpaceCoin token Address:",await spaceCoin.spaceCoin());
  console.log("SpaceCoin ICO Address:", await spaceCoin.spaceCoinICO());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
