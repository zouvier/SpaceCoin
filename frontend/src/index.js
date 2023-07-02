const ethers = require("ethers");

import IcoJSON from '../../artifacts/contracts/Ico.sol/SpaceCoinICO.json';
import SpaceCoinJSON from '../../artifacts/contracts/SpaceCoin.sol/SpaceCoin.json';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const icoAddr = '0x20bA1bF66e093Ea3f87c82Afdc6A0c53fFB551D1';
const icoContract = new ethers.Contract(icoAddr, IcoJSON.abi, provider);

const spaceCoinAddr = '0xe4e3d2e4dD43EB9b1c9041CB00F52012723e5239';
const spaceCoinContract = new ethers.Contract(spaceCoinAddr, SpaceCoinJSON.abi, provider);

async function updateCurrentPhase() {
  const phaseNames = ["SEED", "GENERAL", "OPEN"];
  const currentPhase = await icoContract.currentPhase();
  const phaseName = phaseNames[currentPhase];
  const phaseElement = document.getElementById("ico_current_phase");
  phaseElement.innerHTML = phaseName;
}


async function updateRedeemableTokens() {
  const currentPhase = await icoContract.currentPhase();
  if (currentPhase == 2) { // 2 corresponds to the OPEN phase
    const userContribution = await icoContract.contributions(signer.getAddress());
    const redeemableTokens = (((userContribution * 5) / (10**18))).toString();
    ico_spc_earned.innerHTML = ethers.utils.parseEther(redeemableTokens);
  } else {
    ico_spc_earned.innerHTML = "0";
  }
}


async function connectToMetamask() {
  try {
    console.log("Signed in as", await signer.getAddress());
  } catch (err) {
    console.log("Not signed in");
    await provider.send("eth_requestAccounts", []);
  }
}

ico_spc_buy.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const eth = ethers.utils.parseEther(form.eth.value);
  console.log("Contributing", eth, "ETH");

  try {
    await connectToMetamask();
    const contributeTx = await icoContract.connect(signer).contribute({ value: eth });
    await contributeTx.wait();
    updateRedeemableTokens();
  } catch (err) {
    console.error(err);
    ico_error.innerHTML = err.message;
  }
});

// Call updateRedeemableTokens to display the redeemable tokens initially
updateRedeemableTokens();
updateCurrentPhase();
