import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { SpaceCoinDeployer, SpaceCoin, SpaceCoinICO } from "../typechain";

describe("SpaceCoinDeployer", function () {
let deployer: SignerWithAddress;
let alice: SignerWithAddress;
let bob: SignerWithAddress;
let addr1: SignerWithAddress;
let addr2: SignerWithAddress;
let addr3: SignerWithAddress;
let addr4: SignerWithAddress;
let addr5: SignerWithAddress;
let addr6: SignerWithAddress;
let addr7: SignerWithAddress;
let addr8: SignerWithAddress;
let addr9: SignerWithAddress;
let addr10: SignerWithAddress;
let treasury: SignerWithAddress;
let SpaceCoinFactory: ethers.ContractFactory;
let SpaceCoinICOFactory: ethers.ContractFactory;
let SpaceCoinDeployerFactory: ethers.ContractFactory;

before(async function () {
  [deployer, alice, bob, treasury, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8, addr9, addr10] = await ethers.getSigners();
  SpaceCoinFactory = await ethers.getContractFactory("SpaceCoin");
  SpaceCoinICOFactory = await ethers.getContractFactory("SpaceCoinICO");
  SpaceCoinDeployerFactory = await ethers.getContractFactory("SpaceCoinDeployer");
 
});

describe("Deployment", function () {
it("Should deploy SpaceCoinDeployer and create SpaceCoin and SpaceCoinICO contracts", async function () {
  const seedAllowlist = [alice.address, bob.address];
  const Treasury = treasury.address;
  const spaceCoinDeployer: SpaceCoinDeployer = (await SpaceCoinDeployerFactory.deploy(seedAllowlist, Treasury)) as SpaceCoinDeployer;
  await spaceCoinDeployer.deployed();
  const spaceCoinAddress = await spaceCoinDeployer.spaceCoin();
  const spaceCoinICOAddress = await spaceCoinDeployer.spaceCoinICO();

  expect(spaceCoinAddress).to.properAddress;
  expect(spaceCoinICOAddress).to.properAddress;

  const spaceCoin: SpaceCoin = SpaceCoinFactory.attach(spaceCoinAddress) as SpaceCoin;
  const spaceCoinICO: SpaceCoinICO = SpaceCoinICOFactory.attach(spaceCoinICOAddress) as SpaceCoinICO;
  
  
  expect (await spaceCoinICO.owner()).to.equal(deployer.address);
  expect(await spaceCoin.owner()).to.equal(deployer.address);
  expect(await spaceCoinICO.spaceCoin()).to.equal(spaceCoin.address);

  const icoSupply = BigNumber.from("150000").mul(BigNumber.from("10").pow(18));
  expect(await spaceCoin.balanceOf(spaceCoinICO.address)).to.equal(icoSupply);

});

it("Should set the correct treasury address and initial supply", async function () {
  const seedAllowlist = [alice.address, bob.address];
  const Treasury = treasury.address;
  const spaceCoinDeployer: SpaceCoinDeployer = (await SpaceCoinDeployerFactory.deploy(seedAllowlist, Treasury)) as SpaceCoinDeployer;
  await spaceCoinDeployer.deployed();
  const spaceCoinAddress = await spaceCoinDeployer.spaceCoin();
  const spaceCoinICOAddress = await spaceCoinDeployer.spaceCoinICO();
  const spaceCoin: SpaceCoin = SpaceCoinFactory.attach(spaceCoinAddress) as SpaceCoin;
  const spaceCoinICO: SpaceCoinICO = SpaceCoinICOFactory.attach(spaceCoinICOAddress) as SpaceCoinICO;
  expect(await spaceCoin.treasury()).to.equal(treasury.address);
  expect(await spaceCoin.balanceOf(treasury.address)).to.equal(ethers.utils.parseEther("350000"));
});

// Test the mintToICO function
it("Should mint the correct amount to the ICO contract", async function () {
  const seedAllowlist = [alice.address, bob.address];
  const Treasury = treasury.address;
  const spaceCoinDeployer: SpaceCoinDeployer = (await SpaceCoinDeployerFactory.deploy(seedAllowlist, Treasury)) as SpaceCoinDeployer;
  await spaceCoinDeployer.deployed();
  const spaceCoinAddress = await spaceCoinDeployer.spaceCoin();
  const spaceCoinICOAddress = await spaceCoinDeployer.spaceCoinICO();
  const spaceCoin: SpaceCoin = SpaceCoinFactory.attach(spaceCoinAddress) as SpaceCoin;
  const spaceCoinICO: SpaceCoinICO = SpaceCoinICOFactory.attach(spaceCoinICOAddress) as SpaceCoinICO;
  const totalsupply = ethers.utils.parseEther("500000");
  const ICOAmount = ethers.utils.parseEther("150000");
  const treasuryAmount = ethers.utils.parseEther("350000");


  expect(await spaceCoin.balanceOf(spaceCoinICO.address)).to.equal(ICOAmount);
  expect(await spaceCoin.balanceOf(treasury.address)).to.equal(treasuryAmount);
  expect(await spaceCoin.totalSupply()).to.equal(totalsupply);
});

// Test the activateTax function
it("Should activate and deactivate the tax correctly", async function () {
  const seedAllowlist = [alice.address, bob.address];
  const Treasury = treasury.address;
  const spaceCoinDeployer: SpaceCoinDeployer = (await SpaceCoinDeployerFactory.deploy(seedAllowlist, Treasury)) as SpaceCoinDeployer;
  await spaceCoinDeployer.deployed();
  const spaceCoinAddress = await spaceCoinDeployer.spaceCoin();
  const spaceCoinICOAddress = await spaceCoinDeployer.spaceCoinICO();
  const spaceCoin: SpaceCoin = SpaceCoinFactory.attach(spaceCoinAddress) as SpaceCoin;
  const spaceCoinICO: SpaceCoinICO = SpaceCoinICOFactory.attach(spaceCoinICOAddress) as SpaceCoinICO;
  await spaceCoin.activateTax(true);
  expect(await spaceCoin.taxIsActive()).to.equal(true);

  await spaceCoin.activateTax(false);
  expect(await spaceCoin.taxIsActive()).to.equal(false);
});

// Test the getTreasuryAmount function
it("Should return the correct treasury balance", async function () {
  const seedAllowlist = [alice.address, bob.address];
  const Treasury = treasury.address;
  const spaceCoinDeployer: SpaceCoinDeployer = (await SpaceCoinDeployerFactory.deploy(seedAllowlist, Treasury)) as SpaceCoinDeployer;
  await spaceCoinDeployer.deployed();
  const spaceCoinAddress = await spaceCoinDeployer.spaceCoin();
  const spaceCoinICOAddress = await spaceCoinDeployer.spaceCoinICO();
  const spaceCoin: SpaceCoin = SpaceCoinFactory.attach(spaceCoinAddress) as SpaceCoin;
  const spaceCoinICO: SpaceCoinICO = SpaceCoinICOFactory.attach(spaceCoinICOAddress) as SpaceCoinICO;

  const treasuryBalance = await spaceCoin.balanceOf(treasury.address);
  expect(await spaceCoin.getTreasuryAmount()).to.equal(treasuryBalance);
});
it("Should set the correct SpaceCoin address and seed allowlist", async function () {
  const seedAllowlist = [alice.address, bob.address];
  const Treasury = treasury.address;
  const spaceCoinDeployer: SpaceCoinDeployer = (await SpaceCoinDeployerFactory.deploy(seedAllowlist, Treasury)) as SpaceCoinDeployer;
  await spaceCoinDeployer.deployed();
  const spaceCoinAddress = await spaceCoinDeployer.spaceCoin();
  const spaceCoinICOAddress = await spaceCoinDeployer.spaceCoinICO();
  const spaceCoin: SpaceCoin = SpaceCoinFactory.attach(spaceCoinAddress) as SpaceCoin;
  const spaceCoinICO: SpaceCoinICO = SpaceCoinICOFactory.attach(spaceCoinICOAddress) as SpaceCoinICO;

  expect(await spaceCoinICO.spaceCoin()).to.equal(spaceCoin.address);

  const isAliceAllowlisted = await spaceCoinICO.isAllowlisted(alice.address);
  const isBobAllowlisted = await spaceCoinICO.isAllowlisted(bob.address);
  const isTreasuryAllowlisted = await spaceCoinICO.isAllowlisted(treasury.address);

  expect(isAliceAllowlisted).to.equal(true);
  expect(isBobAllowlisted).to.equal(true);
  expect(isTreasuryAllowlisted).to.equal(false);
});
// Test the _transfer function with and without tax
it("Should allow contributions during the seed phase", async function () {
  const seedAllowlist = [alice.address, bob.address];
  const Treasury = treasury.address;
  const spaceCoinDeployer: SpaceCoinDeployer = (await SpaceCoinDeployerFactory.deploy(seedAllowlist, Treasury)) as SpaceCoinDeployer;
  await spaceCoinDeployer.deployed();
  const spaceCoinAddress = await spaceCoinDeployer.spaceCoin();
  const spaceCoinICOAddress = await spaceCoinDeployer.spaceCoinICO();
  const spaceCoin: SpaceCoin = SpaceCoinFactory.attach(spaceCoinAddress) as SpaceCoin;
  const spaceCoinICO: SpaceCoinICO = SpaceCoinICOFactory.attach(spaceCoinICOAddress) as SpaceCoinICO;
  // Alice contributes 1,000 ether during the seed phase
  await spaceCoinICO.connect(alice).contribute({ value: ethers.utils.parseEther("1000") });
  expect(await spaceCoinICO.totalContributed()).to.equal(ethers.utils.parseEther("1000"));
  expect(await spaceCoinICO.contributions(alice.address)).to.equal(ethers.utils.parseEther("1000"));
});

it("Should not allow non-allowlisted users to contribute during the seed phase", async function () {
  const seedAllowlist = [alice.address, bob.address];
  const Treasury = treasury.address;
  const spaceCoinDeployer: SpaceCoinDeployer = (await SpaceCoinDeployerFactory.deploy(seedAllowlist, Treasury)) as SpaceCoinDeployer;
  await spaceCoinDeployer.deployed();
  const spaceCoinAddress = await spaceCoinDeployer.spaceCoin();
  const spaceCoinICOAddress = await spaceCoinDeployer.spaceCoinICO();
  const spaceCoin: SpaceCoin = SpaceCoinFactory.attach(spaceCoinAddress) as SpaceCoin;
  const spaceCoinICO: SpaceCoinICO = SpaceCoinICOFactory.attach(spaceCoinICOAddress) as SpaceCoinICO;

  // Treasury tries to contribute 1,000 ether during the seed phase
  await expect(
    spaceCoinICO.connect(treasury).contribute({ value: ethers.utils.parseEther("1000") })
  ).to.be.revertedWith("SpaceCoinICO: Address not in allowlist");
});

it("Should not allow contributions exceeding the individual limit during the seed phase", async function () {
  const seedAllowlist = [alice.address, bob.address];
  const Treasury = treasury.address;
  const spaceCoinDeployer: SpaceCoinDeployer = (await SpaceCoinDeployerFactory.deploy(seedAllowlist, Treasury)) as SpaceCoinDeployer;
  await spaceCoinDeployer.deployed();
  const spaceCoinAddress = await spaceCoinDeployer.spaceCoin();
  const spaceCoinICOAddress = await spaceCoinDeployer.spaceCoinICO();
  const spaceCoin: SpaceCoin = SpaceCoinFactory.attach(spaceCoinAddress) as SpaceCoin;
  const spaceCoinICO: SpaceCoinICO = SpaceCoinICOFactory.attach(spaceCoinICOAddress) as SpaceCoinICO;
  // Alice tries to contribute 2,000 ether during the seed phase
  await expect(
    spaceCoinICO.connect(alice).contribute({ value: ethers.utils.parseEther("2000") })
  ).to.be.revertedWith("SpaceCoinICO: Individual limit exceeded");
});

it("Should not allow contributions exceeding the phase cap during the seed phase", async function () {
  const seedAllowlist = [alice.address, bob.address, addr1.address, addr2.address, addr3.address, addr4.address, addr5.address, addr6.address, addr7.address, addr8.address, addr9.address,addr10.address];
  const Treasury = treasury.address;
  const spaceCoinDeployer: SpaceCoinDeployer = (await SpaceCoinDeployerFactory.deploy(seedAllowlist, Treasury)) as SpaceCoinDeployer;
  await spaceCoinDeployer.deployed();
  const spaceCoinAddress = await spaceCoinDeployer.spaceCoin();
  const spaceCoinICOAddress = await spaceCoinDeployer.spaceCoinICO();
  const spaceCoin: SpaceCoin = SpaceCoinFactory.attach(spaceCoinAddress) as SpaceCoin;
  const spaceCoinICO: SpaceCoinICO = SpaceCoinICOFactory.attach(spaceCoinICOAddress) as SpaceCoinICO;
  // Alice contributes 14,000 ether and Bob tries to contribute 2,000 ether during the seed phase
  await spaceCoinICO.connect(alice).contribute({ value: ethers.utils.parseEther("1500") });
  await spaceCoinICO.connect(addr1).contribute({ value: ethers.utils.parseEther("1500") });
  await spaceCoinICO.connect(addr2).contribute({ value: ethers.utils.parseEther("1500") });
  await spaceCoinICO.connect(addr3).contribute({ value: ethers.utils.parseEther("1500") });
  await spaceCoinICO.connect(addr4).contribute({ value: ethers.utils.parseEther("1500") });
  await spaceCoinICO.connect(addr5).contribute({ value: ethers.utils.parseEther("1500") });
  await spaceCoinICO.connect(addr6).contribute({ value: ethers.utils.parseEther("1500") });
  await spaceCoinICO.connect(addr7).contribute({ value: ethers.utils.parseEther("1500") });
  await spaceCoinICO.connect(addr8).contribute({ value: ethers.utils.parseEther("1500") });
  await spaceCoinICO.connect(addr9).contribute({ value: ethers.utils.parseEther("1500") });
  
  await expect(
    spaceCoinICO.connect(bob).contribute({ value: ethers.utils.parseEther("1500") })
  ).to.be.revertedWith("SpaceCoinICO: Phase cap exceeded");
});


it("Should allow contributions during the general phase", async function () {
  const seedAllowlist = [alice.address, bob.address];
  const Treasury = treasury.address;
  const spaceCoinDeployer: SpaceCoinDeployer = (await SpaceCoinDeployerFactory.deploy(seedAllowlist, Treasury)) as SpaceCoinDeployer;
  await spaceCoinDeployer.deployed();
  const spaceCoinAddress = await spaceCoinDeployer.spaceCoin();
  const spaceCoinICOAddress = await spaceCoinDeployer.spaceCoinICO();
  const spaceCoin: SpaceCoin = SpaceCoinFactory.attach(spaceCoinAddress) as SpaceCoin;
  const spaceCoinICO: SpaceCoinICO = SpaceCoinICOFactory.attach(spaceCoinICOAddress) as SpaceCoinICO;
  await spaceCoinICO.advancePhase();
  await spaceCoinICO.confirmPhaseChange(); // Move to the general phase

  await spaceCoinICO.connect(alice).contribute({ value: ethers.utils.parseEther("500") });
  await spaceCoinICO.connect(alice).contribute({ value: ethers.utils.parseEther("500") });
  expect(await spaceCoinICO.totalContributed()).to.equal(ethers.utils.parseEther("1000"));
  expect(await spaceCoinICO.contributions(alice.address)).to.equal(ethers.utils.parseEther("1000"));
});

it("Should not allow contributions exceeding the individual limit during the general phase", async function () {
  const seedAllowlist = [alice.address, bob.address];
  const Treasury = treasury.address;
  const spaceCoinDeployer: SpaceCoinDeployer = (await SpaceCoinDeployerFactory.deploy(seedAllowlist, Treasury)) as SpaceCoinDeployer;
  await spaceCoinDeployer.deployed();
  const spaceCoinAddress = await spaceCoinDeployer.spaceCoin();
  const spaceCoinICOAddress = await spaceCoinDeployer.spaceCoinICO();
  const spaceCoin: SpaceCoin = SpaceCoinFactory.attach(spaceCoinAddress) as SpaceCoin;
  const spaceCoinICO: SpaceCoinICO = SpaceCoinICOFactory.attach(spaceCoinICOAddress) as SpaceCoinICO;
  
  await spaceCoinICO.advancePhase();
  await spaceCoinICO.confirmPhaseChange(); // Move to the general phase

  await expect(
    spaceCoinICO.connect(alice).contribute({ value: ethers.utils.parseEther("1500") })
  ).to.be.revertedWith("SpaceCoinICO: Individual limit exceeded");
});

it("Should allow contributions during the open phase", async function () {
  const seedAllowlist = [alice.address, bob.address];
  const Treasury = treasury.address;
  const spaceCoinDeployer: SpaceCoinDeployer = (await SpaceCoinDeployerFactory.deploy(seedAllowlist, Treasury)) as SpaceCoinDeployer;
  await spaceCoinDeployer.deployed();
  const spaceCoinAddress = await spaceCoinDeployer.spaceCoin();
  const spaceCoinICOAddress = await spaceCoinDeployer.spaceCoinICO();
  const spaceCoin: SpaceCoin = SpaceCoinFactory.attach(spaceCoinAddress) as SpaceCoin;
  const spaceCoinICO: SpaceCoinICO = SpaceCoinICOFactory.attach(spaceCoinICOAddress) as SpaceCoinICO;

  await spaceCoinICO.advancePhase();
  await spaceCoinICO.confirmPhaseChange(); // Move to the general phase
  await spaceCoinICO.advancePhase();
  await spaceCoinICO.confirmPhaseChange(); // Move to the open phase

  await spaceCoinICO.connect(alice).contribute({ value: ethers.utils.parseEther("1000") });
  expect(await spaceCoinICO.totalContributed()).to.equal(ethers.utils.parseEther("1000"));
  expect(await spaceCoinICO.contributions(alice.address)).to.equal(ethers.utils.parseEther("1000"));
});

it("Should redeem tokens after the open phase", async function () {
  const seedAllowlist = [alice.address, bob.address];
  const Treasury = treasury.address;
  const spaceCoinDeployer: SpaceCoinDeployer = (await SpaceCoinDeployerFactory.deploy(seedAllowlist, Treasury)) as SpaceCoinDeployer;
  await spaceCoinDeployer.deployed();
  const spaceCoinAddress = await spaceCoinDeployer.spaceCoin();
  const spaceCoinICOAddress = await spaceCoinDeployer.spaceCoinICO();
  const spaceCoin: SpaceCoin = SpaceCoinFactory.attach(spaceCoinAddress) as SpaceCoin;
  const spaceCoinICO: SpaceCoinICO = SpaceCoinICOFactory.attach(spaceCoinICOAddress) as SpaceCoinICO;

  await spaceCoinICO.advancePhase();
  await spaceCoinICO.confirmPhaseChange(); // Move to the general phase
  await spaceCoinICO.advancePhase();
  await spaceCoinICO.confirmPhaseChange(); // Move to the open phase

  // Alice contributes 1,000 ether during the open phase
  await spaceCoinICO.connect(alice).contribute({ value: ethers.utils.parseEther("1000") });

  // Alice redeems tokens
  await spaceCoinICO.connect(alice).redeemTokens();
  const aliceSpaceCoinBalance = await spaceCoin.balanceOf(alice.address);
  expect(aliceSpaceCoinBalance).to.equal(ethers.utils.parseEther("5000")); // 1,000 ether * 5
});

it("Should not allow redeeming tokens before the open phase", async function () {
  const seedAllowlist = [alice.address, bob.address];
  const Treasury = treasury.address;
  const spaceCoinDeployer: SpaceCoinDeployer = (await SpaceCoinDeployerFactory.deploy(seedAllowlist, Treasury)) as SpaceCoinDeployer;
  await spaceCoinDeployer.deployed();
  const spaceCoinAddress = await spaceCoinDeployer.spaceCoin();
  const spaceCoinICOAddress = await spaceCoinDeployer.spaceCoinICO();
  const spaceCoin: SpaceCoin = SpaceCoinFactory.attach(spaceCoinAddress) as SpaceCoin;
  const spaceCoinICO: SpaceCoinICO = SpaceCoinICOFactory.attach(spaceCoinICOAddress) as SpaceCoinICO;

  await expect(spaceCoinICO.connect(alice).redeemTokens()).to.be.revertedWith(
    "SpaceCoinICO: ICO is not in OPEN phase"
  );
});

it("Should advance and confirm ICO phases", async function () {
  const seedAllowlist = [alice.address, bob.address];
  const Treasury = treasury.address;
  const spaceCoinDeployer: SpaceCoinDeployer = (await SpaceCoinDeployerFactory.deploy(seedAllowlist, Treasury)) as SpaceCoinDeployer;
  await spaceCoinDeployer.deployed();
  const spaceCoinAddress = await spaceCoinDeployer.spaceCoin();
  const spaceCoinICOAddress = await spaceCoinDeployer.spaceCoinICO();
  const spaceCoin: SpaceCoin = SpaceCoinFactory.attach(spaceCoinAddress) as SpaceCoin;
  const spaceCoinICO: SpaceCoinICO = SpaceCoinICOFactory.attach(spaceCoinICOAddress) as SpaceCoinICO;
  // Advance to the general phase
  await spaceCoinICO.advancePhase();
  expect(await spaceCoinICO.currentPhase()).to.equal(0); // Still in the seed phase
  await spaceCoinICO.confirmPhaseChange();
  expect(await spaceCoinICO.currentPhase()).to.equal(1); // Now in the general phase

  // Advance to the open phase
  await spaceCoinICO.advancePhase();
  expect(await spaceCoinICO.currentPhase()).to.equal(1); // Still in the general phase
  await spaceCoinICO.confirmPhaseChange();
  expect(await spaceCoinICO.currentPhase()).to.equal(2); // Now in the open phase
});

it("Should pause and unpause the contract", async function () {
  const seedAllowlist = [alice.address, bob.address];
  const Treasury = treasury.address;
  const spaceCoinDeployer: SpaceCoinDeployer = (await SpaceCoinDeployerFactory.deploy(seedAllowlist, Treasury)) as SpaceCoinDeployer;
  await spaceCoinDeployer.deployed();
  const spaceCoinAddress = await spaceCoinDeployer.spaceCoin();
  const spaceCoinICOAddress = await spaceCoinDeployer.spaceCoinICO();
  const spaceCoin: SpaceCoin = SpaceCoinFactory.attach(spaceCoinAddress) as SpaceCoin;
  const spaceCoinICO: SpaceCoinICO = SpaceCoinICOFactory.attach(spaceCoinICOAddress) as SpaceCoinICO;

  await spaceCoinICO.pause(); // Pause the contract

  // Check if the contract is paused
  expect(await spaceCoinICO.paused()).to.be.true;

  // Contributions should be blocked while the contract is paused
  await expect(
    spaceCoinICO.connect(alice).contribute({ value: ethers.utils.parseEther("1000") })
  ).to.be.revertedWith("Pausable: paused");

  await spaceCoinICO.unpause(); // Unpause the contract

  // Check if the contract is unpaused
  expect(await spaceCoinICO.paused()).to.be.false;
});

it("Should not accept direct Ether transfers", async function () {
  const seedAllowlist = [alice.address, bob.address];
  const Treasury = treasury.address;
  const spaceCoinDeployer: SpaceCoinDeployer = (await SpaceCoinDeployerFactory.deploy(seedAllowlist, Treasury)) as SpaceCoinDeployer;
  await spaceCoinDeployer.deployed();
  const spaceCoinAddress = await spaceCoinDeployer.spaceCoin();
  const spaceCoinICOAddress = await spaceCoinDeployer.spaceCoinICO();
  const spaceCoin: SpaceCoin = SpaceCoinFactory.attach(spaceCoinAddress) as SpaceCoin;
  const spaceCoinICO: SpaceCoinICO = SpaceCoinICOFactory.attach(spaceCoinICOAddress) as SpaceCoinICO;
  
  // Attempt to send Ether directly to the contract
  await expect(
    alice.sendTransaction({
      to: spaceCoinICO.address,
      value: ethers.utils.parseEther("1"),
    })
  ).to.be.revertedWith("Send Eth through the contribute function");
});


it("should calculate tax correctly and update balances after transfer", async function () {
  const seedAllowlist = [alice.address, bob.address];
  const Treasury = treasury.address;
  const spaceCoinDeployer: SpaceCoinDeployer = (await SpaceCoinDeployerFactory.deploy(seedAllowlist, Treasury)) as SpaceCoinDeployer;
  await spaceCoinDeployer.deployed();
  const spaceCoinAddress = await spaceCoinDeployer.spaceCoin();
  const spaceCoinICOAddress = await spaceCoinDeployer.spaceCoinICO();
  const spaceCoin: SpaceCoin = SpaceCoinFactory.attach(spaceCoinAddress) as SpaceCoin;
  const spaceCoinICO: SpaceCoinICO = SpaceCoinICOFactory.attach(spaceCoinICOAddress) as SpaceCoinICO;

  await spaceCoinICO.advancePhase();
  expect(await spaceCoinICO.currentPhase()).to.equal(0); // Still in the seed phase
  await spaceCoinICO.confirmPhaseChange();
  expect(await spaceCoinICO.currentPhase()).to.equal(1); // Now in the general phase

  // Advance to the open phase
  await spaceCoinICO.advancePhase();
  expect(await spaceCoinICO.currentPhase()).to.equal(1); // Still in the general phase
  await spaceCoinICO.confirmPhaseChange();
  expect(await spaceCoinICO.currentPhase()).to.equal(2); // Now in the open phase


  await spaceCoinICO.connect(alice).contribute({ value: ethers.utils.parseEther("1000") });

  await spaceCoinICO.connect(alice).redeemTokens();


  // Activate tax
  await spaceCoin.connect(deployer).activateTax(true);
  
  // Mint tokens to Alice
  const mintAmount = ethers.utils.parseEther("5000");

  // Alice transfers tokens to Bob
  const transferAmount = ethers.utils.parseEther("1000");
  await spaceCoin.connect(alice).transfer(bob.address, transferAmount);

  // Check if tax was calculated correctly
  const expectedTaxAmount = transferAmount.mul(2).div(100); // 2% tax
  const expectedTransferAmount = transferAmount.sub(expectedTaxAmount);

  // Check if balances were updated correctly
  const aliceBalance = await spaceCoin.balanceOf(alice.address);
  const bobBalance = await spaceCoin.balanceOf(bob.address);
  const treasuryBalance = await spaceCoin.balanceOf(treasury.address);
  console.log("begin")
  expect(bobBalance).to.equal(expectedTransferAmount);
  console.log("bob:done")
  expect(treasuryBalance).to.equal(expectedTaxAmount.add(ethers.utils.parseEther("350000")));
  console.log("treasury:done")
  expect(aliceBalance).to.equal(mintAmount.sub(transferAmount));
  console.log("alice:done")

 
});
});

});


    // Test the constructor and initial state
    


  // Write your tests below
