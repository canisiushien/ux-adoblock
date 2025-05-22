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

    transactionSignataire?: string; /* le compte EOA signataire de la transaction */

    /**
    * la somme totale du gas utilisé par la transaction et par toutes les
    * transactions précédentes incluses dans le même bloc
    */
    totalBlockGasUtilise?: number;

    totalTransactionGasUtilise?: number; /** la quantite de gas réellement consommée pour exécuter la transaction */

    prixReelTransaction?: number; /** le prix reel de gaz paye pour la transaction */

    prixReelTransactionEther?: number;

    statut?: string; /** l'etat d'execution(statut) de la transaction */

    nonce?: number;

    typeTx?: string; //EIP-1559 transaction (Ethereum transaction de type 2), introduite pour mieux gérer les frais de gas.
}

export class AddResponse implements IAddResponse {
    constructor(
        public documentName?: string,

        public idTransaction?: string,

        public numeroBlock?: number,

        public addressContrat?: string,

        public transactionSignataire?: string,

        public totalBlockGasUtilise?: number,

        public totalTransactionGasUtilise?: number,

        public prixReelTransaction?: number,

        public prixReelTransactionEther?: number,

        public statut?: string,

        public nonce?: number,

        public typeTx?: string
    ) { }

    /**
     * cumulativeGasUsed == ​gasUsed == 322200n
     * ​gasPrice == maxFeePerGas == maxPriorityFeePerGas == 1676642089n
     * maxFeePerBlobGas: null
     * 
     * 
     * Type == 0 : Legacy Transaction (ancien format)	Avant EIP-1559. C'est le format traditionnel, avec un champ gasPrice fixe. Aucune gestion dynamique du prix du gaz.
     * Type ==1 : Access List Transaction (EIP-2930)	Introduit avec EIP-2930. Permet de spécifier une access list (liste d'accès aux adresses/storage), pour plus d'efficacité. Peu utilisé.
     * Type == 2 : EIP-1559 Transaction (type courant)	Le type moderne post-London fork. Utilise maxFeePerGas et maxPriorityFeePerGas pour améliorer la prévisibilité et réduire les frais.
    */
}