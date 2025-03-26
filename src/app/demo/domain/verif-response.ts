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

    /**
     * l'empreinte numerique du doc. Ce hash est encode en base64 (Empreinte
     * numerique du document)
     */
    docHashed?: string;

    requestDate?: Date; /** date (Instant) de demande d'authentification (Date de demande) */

    typeKey?: string;  /** type d'algo cryptographique */

    ellipticCurve?: string;  /** courbe elliptique */

    publicKey?: string;  /** cle publique associee */
}

export class VerifResponse implements IVerifResponse {
    constructor(
        public authenticated?: boolean,

        public integrated?: boolean,

        public horodatage?: number,

        public fileName?: string,

        public docHashed?: string,

        public requestDate?: Date,

        public typeKey?: string,

        public ellipticCurve?: string,

        public publicKey?: string
    ){}
    
}