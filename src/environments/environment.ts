// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const PROTOCOLE : string = 'http'; //http //https
const IP_DNS: string = 'localhost:8080'; //localhost:8080
const BASE_API: string = PROTOCOLE + '://' + IP_DNS + '/api/adoblock';

export const environment = {
  production: false,

  //génère une paire de clés cryptographiques
  generateKeysPair: BASE_API + '/generate-keys',

  //enregistre un document administratif sur la blockchain
  storeDocToBlockchain: BASE_API + '/add-to-blockchain',

  //vérifie l'authenticité d'un document administratif depuis la blockchain
  retrieveDocFromBlockchain: BASE_API + '/verify-from-blockchain'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
