import { Component, ViewChild } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { AddResponse, IAddResponse } from '../../domain/add-response';
import { NgForm } from '@angular/forms';
import { DocumentService } from '../../service/document-service';
import { EthereumService } from '../../service/ethereum.service';
import { DataDocument, IDataDocument } from '../../domain/data-document';
import { DocumentETH, IDocumentETH } from '../../domain/document-eth';
import { formatEther } from "ethers";

@Component({
  selector: 'app-store-document',
  templateUrl: './store-document.component.html',
  styleUrls: ['./store-document.component.scss'],
  providers: [MessageService]
})
export class StoreDocumentComponent {
  //=========== declarations necessaires ===================
  @ViewChild('dtf') form!: NgForm;
  documentEth: IDocumentETH = new DocumentETH();//pour contenir les données calculées lors de la preparation de l'ajout
  addResponse: IAddResponse = new AddResponse();//pour contenir les données reponse de l'operation d'ajout 
  dataDocument: IDataDocument = new DataDocument();//pour contenir les données du formulaire d'ajout de doc admin
  message: any;
  timeoutHandle: any;
  uploadedFiles: any[] = [];
  selectedFile: File | null = null;
  crtSelectedFile: File | null = null;
  fichierCrtCharge: boolean = false;
  fichierDocCharge: boolean = false;

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
      return this.fichierDocCharge; // Si .crt chargé, seul doc est requis
    } else {
      //!!this.dataDocument.clePrivee retourne true si la chaîne n'est pas vide, false sinon.
      //!!this.dataDocument.clePublique fait la même chose.
      return this.fichierDocCharge && !!this.dataDocument.clePrivee && !!this.dataDocument.clePublic;
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

  // Gestion de la sélection du fichier de document administratif
  onFileSelect(event: any): void {
    this.fichierDocCharge = event.files.length > 0;  // Vérifie si le fichier PDF/Word est chargé
    const file: File = event.files[0];

    if (file) {
      // Vérification du type de fichier
      const allowedTypes = ["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        console.error("Type de fichier non autorisé !");
        return;
      }
      this.selectedFile = file;
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
  addDocument() {
    if (this.dataDocument) {
      //initialisation du formData
      const formData: FormData = new FormData();
      this.dataDocument.docAdminFile = this.selectedFile;
      this.dataDocument.keysFile = this.crtSelectedFile;
      formData.append("privateKey", this.dataDocument.clePrivee);
      formData.append("publicKey", this.dataDocument.clePublic);
      formData.append("file", this.dataDocument.docAdminFile);
      formData.append("fileKey", this.dataDocument.keysFile);

      //appel de l'api de preparation du fichier (extraction et calcul des données)
      this.documentService.prepareStoreDocumentToEthereum(formData).subscribe(response => {
        //recuperation des données de reponse de l'api de preparation
        this.documentEth = response.body;
        console.log("======this.documentEth : {}", this.documentEth);

        //appel du contrat intelligent via le service ethereum. Methode de type Promise et non Observable
        this.ethereumService.storeDocument(this.documentEth.hashEncoded, this.documentEth.signedHashEncoded, this.documentEth.publicKeyEncoded)
          .then(result => {
            console.log("Transaction réussie : ", result);
            const receipt = result.receipt;
            const nonce = result.nonce;
            //traitements post-transaction
            //construction de la reponse finale
            this.addResponse.documentName = this.documentEth.fileName;
            this.addResponse.transactionSignataire = receipt.from;
            this.addResponse.addressContrat = receipt.to;
            this.addResponse.numeroBlock = receipt.blockNumber;
            this.addResponse.nonce = Number(nonce);
            this.addResponse.statut = receipt.status === 1 ? "Succès (Transaction minée)" : "Échec"; //1 = Succès, 0 = Echec
            this.addResponse.idTransaction = receipt.hash;
            this.addResponse.totalBlockGasUtilise = Number(receipt.cumulativeGasUsed);
            this.addResponse.totalTransactionGasUtilise = Number(receipt.gasUsed);
            this.addResponse.prixReelTransaction = Number(receipt.gasUsed) * Number(receipt.gasPrice);
            this.addResponse.prixReelTransactionEther = Number(formatEther(BigInt(receipt.gasUsed) * BigInt(receipt.gasPrice))); //convertir prixReelTransaction de Wei en ETH
            switch (true) {//valeurs possibles de typeTx
              case receipt.type === 0:
                this.addResponse.typeTx = "(0) EIP-1559 : Legacy Transaction";
                break;
              case receipt.type === 1:
                this.addResponse.typeTx = "(1) EIP-2930 : Access List Transaction";
                break;
              case receipt.type === 2:
                this.addResponse.typeTx = "(2) EIP-1559 : transaction (standard recommandé)";
                break;
              default:
                this.addResponse.typeTx = "Inconnu";
            }

            console.log("======this.addResponse : {}", this.addResponse);
          }).catch(error => {//fin then()
            console.error("Erreur lors de l’envoi sur Ethereum :", error);
          });

      }, error => {//fin prepareStoreDocumentToEthereum()
        console.error("Erreur de préparation du stockage sur Ethereum :", error);
      });
    }//fin if()
  }//fin addDocument()

  //recuperer api message retour
  showMessage(message: Message) {
    this.message = message;
    this.timeoutHandle = setTimeout(() => {
      this.message = null;
    }, 5000);
  }

  //vider le formulaire au clic du bouton Effacer
  clear(fichierCrtCharge: any, fichierDocCharge: any): void {
    //vide les champs textuels du formulaire
    this.form.resetForm();
    //réinitialise les discriminants
    this.fichierCrtCharge = false;
    this.fichierDocCharge = false;
    //vide les champs uploadFile
    fichierCrtCharge.clear();
    fichierDocCharge.clear();
  }
}
