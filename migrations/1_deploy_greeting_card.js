const GreetingCard = artifacts.require("GreetingCard");

module.exports = async function (deployer, network) {
  // Axelar Gateway et Gas Service addresses pour Sepolia
  const AXELAR_GATEWAY_SEPOLIA = "0xe432150cce91c13a887f7D836923d5597adD8E31";
  const AXELAR_GAS_SERVICE_SEPOLIA = "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6";

  await deployer.deploy(
    GreetingCard,
    AXELAR_GATEWAY_SEPOLIA,
    AXELAR_GAS_SERVICE_SEPOLIA
  );

  // Log l'adresse du contrat déployé
  const deployedContract = await GreetingCard.deployed();
  console.log("GreetingCard déployé à l'adresse:", deployedContract.address);
}; 