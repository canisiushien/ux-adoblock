// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

//import "hardhat/console.sol";
/**
 * @author canisiushien@gmail.com
 *
 * @title CONTRAT INTELLIGENT "DocumentAdministratif".
 * @dev Stocke et recherche un document administratif (hash) dans Ethereum.
 * @dev Ce contrat est une intéraction entre deux parties : le document administratif et l'utilisateur.
 * @dev date-implCompilDeployAndTest: 10 mars 2025.
 * @dev date-updateCompilDeployAndTest: 15 mars 2026.
 */
contract DocumentAdministratif {
    //definition de la structure d'un document a stocker
    struct Document {
        string hashEncoded; //hash du document
        string signedHashEncoded; //signature numerique du document
        string publicKeyEncoded; //cle publique du signataire
        uint256 timestamp; //date et heure(horodatage) de stockage du document dans la blockchain
    }

    //mappage(appele "documents") de la structure du document avec une chaine (le hash)
    mapping(string => Document) private documents;
    //mappage(appele "revokedPublicKeys") avec une chaine (le publicKeyEncoded) pour avoir la liste des pair keys revoked
    mapping(string => bool) public revokedPublicKeys;

    //creation d'un evenement d'indexage (tel hash+horodatage correspond a tel ensemble de donnees w = signedHashEncoded+publicKeyEncoded)
    event DocumentStored(string indexed hashEncoded, uint256 timestamp);
    //creation d'un evenement d'indexage (tel publicKeyEncoded+horodatage)
    event KeyRevoked(string indexed publicKeyEncoded, uint256 timestamp);

    //fonction de stockage de document dans la blockchain
    function storeAdministrativeDocument(
        string memory _hashEncoded,
        string memory _signedHashEncoded,
        string memory _publicKeyEncoded
    ) public {
        //controle de validite de cles et de doublons de hash dans le stockage
        require(
            !revokedPublicKeys[_publicKeyEncoded],
            "Cles invalides! impossible d'enregistrer le document dans la blockchain."
        );
        require(
            bytes(documents[_hashEncoded].hashEncoded).length == 0,
            "Ce document existe deja dans la blockchain."
        );

        //stocke le document dans une map
        documents[_hashEncoded] = Document({
            hashEncoded: _hashEncoded,
            signedHashEncoded: _signedHashEncoded,
            publicKeyEncoded: _publicKeyEncoded,
            timestamp: block.timestamp
        });

        //    console.log("_hashEncoded = ", _hashEncoded);
        //    console.log("_signedHashEncoded = ", _signedHashEncoded);
        //    console.log("_publicKeyEncoded = ", _publicKeyEncoded);
        //    console.log("timestamp = ", block.timestamp);

        //emettre l'evenement a l'attention des utilisateurs
        emit DocumentStored(_hashEncoded, block.timestamp);
    }

    //fonction de recherche/recuperation de document(hash) dans la blockchain
    function getAdministrativeDocument(
        string memory _hashEncoded
    )
        public
        view
        returns (string memory, string memory, string memory, uint256, bool)
    {
        //console.log("Recherche de _hashEncoded = ", _hashEncoded);
        //on leve une exception si un hash similaire n'avait pas ete stocké dans la blockchain
        require(
            bytes(documents[_hashEncoded].hashEncoded).length != 0,
            "Ce document n'existe pas dans la blockchain."
        );

        Document memory doc = documents[_hashEncoded];
        bool isKeyRevoked = revokedPublicKeys[doc.publicKeyEncoded];
        return (
            doc.hashEncoded,
            doc.signedHashEncoded,
            doc.publicKeyEncoded,
            doc.timestamp,
            isKeyRevoked
        );
    }

    //fonction de revocation de cles
    function revokeKey(string memory _publicKeyEncoded) public {
        revokedPublicKeys[_publicKeyEncoded] = true;
        //emettre l'evenement a l'attention des utilisateurs
        emit KeyRevoked(_publicKeyEncoded, block.timestamp);
    }
}
