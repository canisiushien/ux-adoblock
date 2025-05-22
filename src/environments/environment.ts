// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const PROTOCOLE: string = 'http'; //http //https
const IP_DNS: string = 'localhost:8081'; //localhost:8080
const BASE_API: string = PROTOCOLE + '://' + IP_DNS + '/api/adoblock';

export const environment = {
  production: false,
  contractAddress: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
  alerteLife: 8000,/*en ms duree d'affichage des messages d'alerte*/

  //génère une paire de clés cryptographiques
  generateKeysPair: BASE_API + '/generate-keys',

  //calcule les données necessaires du fichier qui doivent être stokées sur Eth
  prepareStoreToBlockchain: BASE_API + '/prepare-store-to-blockchain',

  //calcule les données necessaires du fichier qui doivent servir à la rechercher sur Eth
  prepareGetFromBlockchain: BASE_API + '/prepare-get-from-blockchain',


  //vérifie l'authenticité d'un document administratif depuis la blockchain
  verifyDocFromBlockchain: BASE_API + '/verify-from-blockchain'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
