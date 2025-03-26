/**
 * Prévue pour la paire de clés
 *
 * @author Canisius <canisiushien@gmail.com>
 */
export interface IKeysPair {

    typeKey?: string; /** type d'algo cryptographique */

    ellipticCurve?: string; /** courbe elliptique */

    privateKey?: string; /** clé privée */

    publicKey?: string; /** clé publique */
}

export class KeysPair implements IKeysPair{

constructor(    
    public typeKey?: string,

    public ellipticCurve?: string,

    public privateKey?: string,

    public publicKey?: string
){}
}