/**
 * Prévue pour le resultat d'ajout de document dans la blockchain
 *
 * @author Canisius <canisiushien@gmail.com>
 */
export interface IAddResponse {

    documentName?: string, /** le nom du fichier numérique */

    idTransaction?: string; /** le hash (id) de la transaction */

    numeroBlock?: number; /** le numero du block contenant la transaction */

    addressContrat?: string; /** l'adresse du contrat intelligent execute */

    /**
    * la somme totale du gas utilisé par la transaction et par toutes les
    * transactions précédentes incluses dans le même bloc
    */
    totalBlockGasUtilise?: number; 

    totalTransactionGasUtilise?: number; /** la quantite de gas réellement consommée pour exécuter la transaction */

    prixReelTransaction?: number; /** le prix reel de gaz paye pour la transaction */

    statut?: string; /** l'etat d'execution(statut) de la transaction */
}

export class AddResponse implements IAddResponse {
    constructor(
        public documentName?: string,

        public idTransaction?: string,

        public numeroBlock?: number,
    
        public addressContrat?: string,
    
        public totalBlockGasUtilise?: number,
    
        public totalTransactionGasUtilise?: number,
    
        public prixReelTransaction?: number,
    
        public statut?: string
    ){}
}