import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DocumentService } from '../../service/document-service';
import { IVerifResponse, VerifResponse } from '../../domain/verif-response';
import { EthereumService } from '../../service/ethereum.service';
import { DocumentETH, IDocumentETH } from '../../domain/document-eth';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-retrieve-document',
  templateUrl: './retrieve-document.component.html',
  styleUrls: ['./retrieve-document.component.scss'],
  providers: [MessageService]
})
export class RetrieveDocumentComponent {
  //=========== declarations necessaires ===================
  @ViewChild('dtf') form!: NgForm;
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
        //recuperation des données de reponse de l'api de preparation de recherche
        this.documentEth = response.body;
        this.demandeTransaction = true;
        console.log("======this.documentEth : {}", this.documentEth);

        //appel du contrat intelligent via le service ethereum. Methode de type Promise et non Observable
        this.ethereumService.getDocument(this.documentEth.hashEncoded)
          .then(receipt => {
            console.log('Document trouvé :', receipt);
            //traitements post-transaction
            //construction de la reponse finale
            this.verifResponse.fileName = this.documentEth.fileName;
            this.verifResponse.newHashEncoded = this.documentEth.hashEncoded;
            this.verifResponse.hashEncodedStored = receipt.hashEncoded;
            this.verifResponse.signedHashEncodedStored = receipt.signedHashEncoded;
            this.verifResponse.publicKeyStored = receipt.publicKeyEncoded;
            this.verifResponse.horodatage = receipt.timestamp;
            this.verifResponse.requestDate = toDay?.toLocaleString();

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
            const revertMessage = error?.reason ? error?.reason : "Problème d'authenticité";
            //const revertMessage = error?.error?.message || error.message || 'Transaction échouée';
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


  //vider le formulaire au clic du bouton Effacer
  clear(): void {
    this.form.resetForm();
    this.demandeTransaction = false;
  }
}