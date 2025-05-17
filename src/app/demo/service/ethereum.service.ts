import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import DocumentAdministratifAbi from '../../../assets/artifacts/contracts/DocumentAdministratif.sol/DocumentAdministratif.json';

@Injectable({
  providedIn: 'root'
})
export class EthereumService {
    private provider!: ethers.BrowserProvider;
    private signer!: ethers.Signer;
    private contract!: ethers.Contract;
    private readonly contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3'; //Adresse du contrat déployé
    private readonly gasEstimated = 500000;

    async initContract() {
        if ((window as any).ethereum) {
          this.provider = new ethers.BrowserProvider((window as any).ethereum);
          await this.provider.send("eth_requestAccounts", []);
          this.signer = await this.provider.getSigner();
          console.log('=====call initContract(). signer = ', this.signer);
    
          this.contract = new ethers.Contract(
            this.contractAddress,
            DocumentAdministratifAbi.abi,
            this.signer
          );

          //Écouteur d'événement
          //this.contract.on("DocumentStored", (hashDoc: string, timestamp: bigint) => {
          //console.log("Événement DocumentStored détecté !");
          //console.log("Hash du document :", hashDoc);
          //console.log("Horodatage :", new Date(Number(timestamp) * 1000).toLocaleString());
          // Ici, je peux appeler une méthode ou émettre un EventEmitter pour informer ton composant
      //});
        } else {
          alert("MetaMask non détecté !");
        }
    }

    async storeDocument(_hashEncoded: string, _signedHashEncoded: string, _publicKeyEncoded: string): Promise<any> {
        console.log('APPEL DE ethereum.service.storeDocument()');
        await this.initContract();
        const tx = await this.contract.storeAdministrativeDocument(_hashEncoded, _signedHashEncoded, _publicKeyEncoded
          ,{
            gasLimit: this.gasEstimated  // valeur standard, ajuste si besoin
          }
        );
        console.log('========tx = ', tx);
        const receipt = await tx.wait();

        // Écouter l'événement
        const event = receipt.logs?.[0];
        console.log('Event reçu :', event);
        return receipt;
    }

    async getDocument(_hashEncoded: string): Promise<any> {
        console.log('APPEL DE ethereum.service.getDocument()');
        await this.initContract();
        try {
          const doc = await this.contract.getAdministrativeDocument(_hashEncoded);
          // doc est un tableau ou objet tuple : [hash, signedHash, pubKey, timestamp]
          console.log('Response reçue :', doc);
          return {
            hashEncoded: doc[0],
            signedHashEncoded: doc[1],
            publicKeyEncoded: doc[2],
            timestamp: Number(doc[3])
          };
        } catch (error: any) {
          console.error("Erreur lors de l’appel du contrat :", error);
          throw error;
        }
    }
}
