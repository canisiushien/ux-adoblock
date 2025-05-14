/**
 * Document ETH preparer par backend pour store ou get
 *
 * @author Canisius <canisiushien@gmail.com>
 */
export interface IDocumentETH {

    /** nom du fichier */
    fileName?: string;

    /** empreinte numerique encode en base64. A transmettre pour saving */
    hashEncoded?: string;

    /** signature numerique encode en base64. A transmettre pour saving */
    signedHashEncoded?: string ;

    /** cle publique encode en base64. A transmettre pour saving */
    publicKeyEncoded?: string;

    /** horodatage de stockage genere automatiquement par Ethereum */
    timestamp?: number;
}

export class DocumentETH implements IDocumentETH{

constructor(    
    public fileName?: string,

    public hashEncoded?: string,

    public signedHashEncoded?: string,

    public publicKeyEncoded?: string,

    public timestamp?: number
){}
}