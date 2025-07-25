import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { IVerifResponse, VerifResponse } from '../../domain/verif-response';
import { DocumentService } from '../../service/document-service';
import { DocumentETH, IDocumentETH } from '../../domain/document-eth';
import { EthereumService } from '../../service/ethereum.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-retrieve-document-public',
  templateUrl: './retrieve-document-public.component.html',
  styleUrls: ['./retrieve-document-public.component.scss'],
  providers: [MessageService]
})
export class RetrieveDocumentPublicComponent {
  //=========== declarations necessaires ===================
  @ViewChild('dtf') form!: NgForm;
  @ViewChild('dtf2') formResultat!: NgForm;
  documentEth: IDocumentETH = new DocumentETH();//pour contenir les données calculées lors de la preparation de la recherche
  verifResponse: IVerifResponse = new VerifResponse();//pour contenir les données reponse de l'operation de recherche
  timeoutHandle: any;
  uploadedFiles: any[] = [];
  selectedFile: File | null = null;
  fichierDocCharge: boolean = false;
  demandeTransaction: boolean = false;

  constructor(private readonly messageService: MessageService,
    private readonly documentService: DocumentService,
    private readonly ethereumService: EthereumService) { }

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
   * Authentification de document digital dans Ethereum.
   * 
   * 1.collecte les données du formulaire
   * 2.appel Observable de l'api-rest spring boot pour extraire et calculer l'infos à rechercher sur Ethereum
   * 3.appel (dans 2) Promise de la fonction getAdministrativeDocument du contrat afin de retrouver les resultats de 2. sur Ethereum
   * 4.appel (dans 3) Observable de l'api-rest spring boot pour comparer/verifier les hash et clés associées
   * 5.notifier UI du resultat final de vérifications/authentification
   */
  retrieveDocument() {
    const toDay = new Date();
    if (this.selectedFile) {
      //initialisation du formData
      const formData: FormData = new FormData();
      formData.append("file", this.selectedFile);

      //appel de l'api de preparation du fichier (extraction et calcul des données)
      this.documentService.prepareGetDocumentFromEthereum(formData).subscribe(response => {
        //this.formResultat.resetForm();
        this.clearResponseForm();

        //construction de reponse élémentaire
        this.verifResponse.requestDate = toDay?.toLocaleString();
        this.verifResponse.fileName = response.body.fileName;

        //recuperation des données de reponse de l'api de preparation de recherche
        this.documentEth = response.body;
        this.demandeTransaction = true;

        //appel du contrat intelligent via le service ethereum. Methode de type Promise et non Observable
        this.ethereumService.getDocument(this.documentEth.hashEncoded)
          .then(receipt => {
            console.log('Document trouvé :', receipt);
            //traitements post-transaction
            //construction de la reponse finale
            this.verifResponse.newHashEncoded = this.documentEth.hashEncoded;
            this.verifResponse.hashEncodedStored = receipt.hashEncoded;
            this.verifResponse.signedHashEncodedStored = receipt.signedHashEncoded;
            this.verifResponse.publicKeyStored = receipt.publicKeyEncoded;
            this.verifResponse.horodatage = receipt.timestamp + ' | ' + this.convertTimestampToDateLongFr(receipt.timestamp);

            //on appelle l'api de verifications de l'integrité et de l'authenticité
            this.documentService.verifyDocumentFromEthereum(this.verifResponse).subscribe(result => {
              //recuperation des données complementaires de reponse de l'api de verifications
              this.verifResponse.typeKey = result.body.typeKey;
              this.verifResponse.ellipticCurve = result.body.ellipticCurve;
              this.verifResponse.authenticated = result.body.authenticated;
              this.verifResponse.integrated = result.body.integrated;
              console.log("======this.verifResponse : {}", this.verifResponse);


              //alerte notification de succès
              this.messageService.add({
                severity: 'success',
                summary: 'Document retrouvé',
                detail: `Transaction réussie (hash: ${this.verifResponse.hashEncodedStored})`,
                life: environment.alerteLife //en ms
              });
            }, error => {//fin verifyDocumentFromEthereum()
              console.error("Erreur lors des verifications des hash et clé :", error);
            });//fin verifyDocumentFromEthereum()
          }).catch(error => {//fin then()
            console.error('Erreur ou document non trouvé sur Ethereum :', error);

            //alerte notification d'échec
            const revertMessage = this.showMessageException(error);
            this.messageService.add({
              severity: 'error',
              summary: "Échec d'authentification",
              detail: `Cause : ${revertMessage}`,
              life: environment.alerteLife //en ms
            });
          });
      }, error => {//fin prepareGetDocumentFromEthereum()
        console.error("Erreur de préparation de verification sur Ethereum :", error);
      });//fin prepareGetDocumentFromEthereum()
    }//fin if()
  }//fin retrieveDocument()

  //convertir un time = 1749165548 en format date = lundi 09 juin 2025 à 09:59:08 (UTC)
  convertTimestampToDateLongFr(timestamp: number): string {
    const date = new Date(timestamp * 1000);

    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',    // lundi, mardi...
      year: 'numeric',
      month: 'long',      // juin, juillet...
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC',
      hour12: false       // mettre true pour "09:59 AM"
    }).format(date);

    return formattedDate;
  }
  //vider le formulaire au clic du bouton Effacer
  clear(): void {
    this.form.resetForm();
    this.demandeTransaction = false;
  }

  //vider le formulaire  d'affichage de reponse
  clearResponseForm(): void {
    this.formResultat.resetForm();
    this.verifResponse.integrated = null;
    this.verifResponse.authenticated = null;
    this.demandeTransaction = false;
  }

  //capture de message d'erreur venant de la blockchain
  showMessageException(error: any): string {
    let revertMessage = "Problème d'authenticité";

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
