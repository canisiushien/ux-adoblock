/**
 * Prévue pour le resultat de verification d'authenticite
 *
 * @author Canisius <canisiushien@gmail.com>
 */
export interface IVerifResponse {
    
    authenticated?: boolean; /** le doc est-il valide/authentique ? */

    integrated?: boolean; /** le contenu du doc est-il au moins integre ? */

    horodatage?: number; /** date a laquelle le document a ete ajoute a la blockchain (horodatage) */

    fileName?: string;  /** nom du fichier soumis a authentification (Document numetique) */

    requestDate?: Date; /** date (Instant) de demande d'authentification (Date de demande) */

    typeKey?: string;  /** type d'algo cryptographique */

    ellipticCurve?: string;  /** courbe elliptique */

    publicKeyStored?: string;  /** cle publique associee */

    newHashEncoded?: string; /** hash calculé et soumis à eth pour la recherche dans eth */

    hashEncodedStored?: string; /** hash encodé en base64 et stocké sur eth auparavant */

    signedHashEncodedStored?: string; /** hash signé encodé en base64 et stocké sur eth auparavant */
}

export class VerifResponse implements IVerifResponse {
    constructor(
        public authenticated?: boolean,

        public integrated?: boolean,

        public horodatage?: number,

        public fileName?: string,

        public requestDate?: Date,

        public typeKey?: string,

        public ellipticCurve?: string,

        public publicKeyStored?: string,

        public newHashEncoded?: string,

        public hashEncodedStored?: string,

        public signedHashEncodedStored?: string
    ){}
    
}