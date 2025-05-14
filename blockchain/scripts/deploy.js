//on importe le module hardhat
const hre = require("hardhat");

//on definit la fonction principale de deploiement
async function main() {
  //on recupere le compte EOA qui execute le deploiement du contrat
  const [deployer] = await hre.ethers.getSigners();
  console.log("Déploiement avec le compte :", deployer.address);

  //on recupere le contrat pour la construction de l'abi et autres
  const Contract = await hre.ethers.getContractFactory("DocumentAdministratif");
  //on deploie le contrat
  const contract = await Contract.deploy();
  //on s'assure que le contrat est deployé car le deploiement peut prendre quelques instants de retard
  await contract.deployed();
  console.log("Contrat déployé à l'adresse :", contract.address);
}

//on appelle la fonction principale de deploiement
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});