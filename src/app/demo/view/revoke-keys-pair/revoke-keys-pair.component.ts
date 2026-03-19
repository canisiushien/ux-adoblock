import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AddResponse, IAddResponse } from '../../domain/add-response';
import { DataDocument, IDataDocument } from '../../domain/data-document';
import { DocumentService } from '../../service/document-service';
import { EthereumService } from '../../service/ethereum.service';
import { DocumentETH, IDocumentETH } from '../../domain/document-eth';
import { formatEther } from 'ethers';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-revoke-keys-pair',
  templateUrl: './revoke-keys-pair.component.html',
  styleUrls: ['./revoke-keys-pair.component.scss'],
  providers: [MessageService]
})
export class RevokeKeysPairComponent {
  //=========== declarations necessaires ===================
  @ViewChild('dtf') form!: NgForm;
  @ViewChild('dtf2') formResultat!: NgForm;
  prepaEth: IDocumentETH = new DocumentETH();//pour contenir les données calculées lors de la preparation de la revocation
  revokeResponse: IAddResponse = new AddResponse();//pour contenir les données reponse de l'operation d'ajout 
  dataRevoke: IDataDocument = new DataDocument();//pour contenir les données du formulaire d'ajout de doc admin
  timeoutHandle: any;
  uploadedFiles: any[] = [];
  selectedFile: File | null = null;
  crtSelectedFile: File | null = null;
  fichierCrtCharge: boolean = false;

  //constructeur pour injection des services necessaires
  constructor(private readonly messageService: MessageService,
    private readonly documentService: DocumentService,
    private readonly ethereumService: EthereumService) { }

  ngOnInit(): void {
    this.ethereumService.initContract(); // Initialise provider, contrat, écouteurs
  }

  // Vérifie si le formulaire est valide
  formValide(): boolean {
    if (this.fichierCrtCharge) {
      return true; // Si .crt chargé, seul doc est requis
    } else {
      //!!this.dataDocument.clePrivee retourne true si la chaîne n'est pas vide, false sinon.
      //!!this.dataDocument.clePublique fait la même chose.
      return !!this.dataRevoke.clePrivee && !!this.dataRevoke.clePublic;
    }
  }

  // Vérifie si le fichier .crt de clés est chargé
  onCrtFileSelect(event: any): void {
    this.fichierCrtCharge = event.files.length > 0;
    const file: File = event.files[0];

    if (file) {
      // Vérification du type de fichier   application/x-x509-ca-cert
      const allowedTypes = ["application/x-x509-ca-cert"];
      if (!allowedTypes.includes(file.type)) {
        console.error("Type de fichier non autorisé !");
        return;
      }
      this.crtSelectedFile = file;
    }
  }

  /**
   * Ajout de document digital dans Ethereum.
   * 
   * 1.collecte les données du formulaire
   * 2.appel Observable de l'api-rest spring boot pour extraire et calculer les infos à stocker sur Ethereum
   * 3.appel (dans 2) Promise de la fonction storeAdministrativeDocument du contrat afin de stocker les resultats de 2.
   * 4.notifier UI du resultat final d'ajout
   */
  revokeKeys() {
    const start = performance.now();

    if (this.dataRevoke) {
      //initialisation du formData
      const formData: FormData = new FormData();
      this.dataRevoke.keysFile = this.crtSelectedFile;
      formData.append("privateKey", this.dataRevoke.clePrivee);
      formData.append("publicKey", this.dataRevoke.clePublic);
      formData.append("fileKey", this.dataRevoke.keysFile);

      //appel de l'api de preparation du fichier (extraction et calcul des données)
      this.documentService.prepareRevokeKeyToEthereum(formData).subscribe(response => {
        this.formResultat.resetForm();

        //recuperation des données de reponse de l'api de preparation et construction de reponse elementaire
        this.prepaEth = response.body;
        this.revokeResponse.publicKeyEncoded = this.prepaEth.publicKeyEncoded;
        console.log("===============", this.prepaEth);

        //appel du contrat intelligent via le service ethereum. Methode de type Promise et non Observable
        this.ethereumService.revokePairKeys(this.prepaEth.publicKeyEncoded)
          .then(result => {
            console.log("Transaction réussie : ", result);
            const receipt = result.receipt;
            const nonce = result.nonce;
            //traitements post-transaction
            //construction de la reponse finale
            this.revokeResponse.transactionSignataire = receipt.from;
            this.revokeResponse.addressContrat = receipt.to;
            this.revokeResponse.numeroBlock = receipt.blockNumber;
            this.revokeResponse.nonce = Number(nonce);
            this.revokeResponse.statut = receipt.status === 1 ? "Succès (Transaction minée)" : "Échec"; //1 = Succès, 0 = Echec
            this.revokeResponse.idTransaction = receipt.hash;
            this.revokeResponse.totalBlockGasUtilise = Number(receipt.cumulativeGasUsed);
            this.revokeResponse.totalTransactionGasUtilise = Number(receipt.gasUsed);
            this.revokeResponse.prixReelTransaction = Number(receipt.gasUsed) * Number(receipt.gasPrice);
            this.revokeResponse.prixReelTransactionGWei = Number(this.revokeResponse.prixReelTransaction / Math.pow(10, 9));
            this.revokeResponse.prixReelTransactionEther = Number(formatEther(BigInt(receipt.gasUsed) * BigInt(receipt.gasPrice))); //convertir prixReelTransaction de Wei en ETH
            switch (true) {//valeurs possibles de typeTx
              case receipt.type === 0:
                this.revokeResponse.typeTx = "(0) EIP-1559 : Legacy Transaction";
                break;
              case receipt.type === 1:
                this.revokeResponse.typeTx = "(1) EIP-2930 : Access List Transaction";
                break;
              case receipt.type === 2:
                this.revokeResponse.typeTx = "(2) EIP-1559 : transaction (standard recommandé)";
                break;
              default:
                this.revokeResponse.typeTx = "Inconnu";
            }

            console.log("======this.revokeResponse : {}", this.revokeResponse);

            //alerte notification de succès
            this.messageService.add({
              severity: 'success',
              summary: 'Clés revoquées',
              detail: `Transaction réussie (hash: ${this.revokeResponse.idTransaction})`,
              life: environment.alerteLife //en ms
            });


            //mesure de temps de reponse
            const end = performance.now();
            const duration = end - start;
            console.log(`Temps traitement revokeResponse() après signature : ${duration.toFixed(2)} ms`);
          }).catch(error => {//fin then()
            console.error("Erreur lors de l’envoi sur Ethereum :", error);
            //alerte notification d'échec
            const revertMessage = this.showMessageException(error);
            //const revertMessage = error?.reason ? error?.reason : 'Transaction échouée';//used
            this.messageService.add({
              severity: 'error',
              summary: 'Échec de la transaction',
              detail: `Cause : ${revertMessage}`,
              life: environment.alerteLife //en ms
            });
          });

      }, error => {//fin prepareRevokeKeyToEthereum()
        console.error("Erreur de préparation du revocation :", error);
        const revertMessage = "Clés asymétriques invalides."; //recuperer l'exception venant du backend ??????
        this.messageService.add({
          severity: 'error',
          summary: 'Échec de la transaction',
          detail: `Cause : ${revertMessage}`,
          life: environment.alerteLife //en ms
        });
      });
    }//fin if()

    //mesure de temps de reponse
    const end = performance.now();
    const duration = end - start;
    console.log(`Temps traitement revokeKeys() avant signature : ${duration.toFixed(2)} ms`);
  }//fin revokeKeys()

  //vider le formulaire au clic du bouton Effacer
  clear(fichierCrtCharge: any): void {
    //vide les champs textuels du formulaire
    this.form.resetForm();
    //réinitialise les discriminants
    this.fichierCrtCharge = false;
    //vide les champs uploadFile
    fichierCrtCharge.clear();
  }

  //capture de message d'erreur venant de la blockchain
  showMessageException(error: any): string {
    let revertMessage = "Transaction échouée";

    // Vérification selon la structure typique de ethers.js
    if (error?.reason) {
      revertMessage = error.reason;
    } else if (error?.error?.message) {
      // parfois encapsulé
      const match = error.error.message.match(/reverted:\s*["'](.+?)["']/);
      if (match) {
        revertMessage = match[1];
      }
    } else if (error?.message) {
      // fallback
      const match = error.message.match(/reverted:\s*["'](.+?)["']/);
      if (match) {
        revertMessage = match[1];
      }
    }

    return revertMessage;
  }
}
