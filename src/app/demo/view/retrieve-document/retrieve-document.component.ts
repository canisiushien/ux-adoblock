import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message, MessageService } from 'primeng/api';
import { DocumentService } from '../../service/document-service';
import { IVerifResponse, VerifResponse } from '../../domain/verif-response';
import { EthereumService } from '../../service/ethereum.service';
import { DocumentETH, IDocumentETH } from '../../domain/document-eth';

@Component({
  selector: 'app-retrieve-document',
  templateUrl: './retrieve-document.component.html',
  styleUrls: ['./retrieve-document.component.scss'],
  providers: [MessageService]
})
export class RetrieveDocumentComponent {
  //=========== declarations necessaires ===================
  @ViewChild('dtf') form!: NgForm;
  documentEth: IDocumentETH = new DocumentETH();
  verifResponse: IVerifResponse = new VerifResponse();
  finalResponse: IVerifResponse = new VerifResponse();
  message: any;
  timeoutHandle: any;
  uploadedFiles: any[] = [];
  selectedFile: File | null = null;
  fichierDocCharge: boolean = false;
  demandeTransaction: boolean = false;
  fourtout: any;

  constructor(private readonly messageService: MessageService, 
    private readonly documentService: DocumentService,
    private readonly ethereumService: EthereumService) {}

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

  //authentifier le document sur la blockchain
  retrieveDocument() {
    if(this.selectedFile) {
      //initialisation du formData
      const formData: FormData = new FormData();
      formData.append("file", this.selectedFile);

      //appel de l'api de preparation du fichier (extraction et calcul des données)
      this.documentService.prepareGetDocumentFromEthereum(formData).subscribe(response =>
        {
          //recuperation de l'objet reponse de l'api
          this.documentEth = response.body;
          this.demandeTransaction = true;
        }
      );

      //============ini param a remplacer par documentEth
      let hash = 'tJtydIPM3SjcrFHwvUyQinS+Lvpq5xZ3jgZoDbj5nXU=';
      //appel du contrat intelligent via le service ethereum. Methode de type Promise et non Observable
      //this.ethereumService.getDocument(this.documentEth.hashEncoded).then(data => {
      this.ethereumService.getDocument(hash).then(data => {
        this.fourtout = data;
        console.log('Document trouvé :', data);
      })
      .catch(error => {
        console.error('Erreur ou document non trouvé :', error);
      });

      //on construit la reponse
      this.verifResponse.fileName = this.documentEth.fileName;
      this.verifResponse.newHashEncoded = this.documentEth.hashEncoded;
      this.verifResponse.hashEncodedStored = this.fourtout.hashEncoded;
      this.verifResponse.signedHashEncodedStored = this.fourtout.signedHashEncoded;
      this.verifResponse.publicKeyStored = this.fourtout.publicKeyEncoded;
      this.verifResponse.horodatage = this.fourtout.timestamp;

      //on appelle l'api de verification
      this.documentService.verifyDocumentFromEthereum(this.verifResponse).subscribe(response =>
        {
          //recuperation de l'objet reponse final de l'api
          this.finalResponse = response.body;
        }
      );

    }
  }

  //recuperer api message retour
  showMessage(message: Message) {
    this.message = message;
    this.timeoutHandle = setTimeout(() => {
      this.message = null;
    }, 5000);
  }

  //vider le formulaire au clic du bouton Effacer
  clear(): void {
    this.form.resetForm();
    this.demandeTransaction = false;
  }
}