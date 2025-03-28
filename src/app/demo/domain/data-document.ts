/**
 * Prévue pour enregistrer un document adlmin
 *
 * @author Canisius <canisiushien@gmail.com>
 */
export interface IDataDocument {

    clePrivee?: string;

    clePublic?: string;

    docAdminFile?: File;

    keysFile?: File;
}

export class DataDocument implements IDataDocument {
    constructor(
        public clePrivee?: string,

        public clePublic?: string,
    
        public docAdminFile?: File,

        public keysFile?: File
    ){}
}