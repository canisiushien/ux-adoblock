import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message, MessageService } from 'primeng/api';
import { DocumentService } from '../../service/document-service';
import { IVerifResponse, VerifResponse } from '../../domain/verif-response';

@Component({
  selector: 'app-retrieve-document',
  templateUrl: './retrieve-document.component.html',
  styleUrls: ['./retrieve-document.component.scss'],
  providers: [MessageService]
})
export class RetrieveDocumentComponent {
  //=========== declarations necessaires ===================
  @ViewChild('dtf') form!: NgForm;
  verifResponse: IVerifResponse = new VerifResponse();
  message: any;
  timeoutHandle: any;
  uploadedFiles: any[] = [];
  selectedFile: File | null = null;
  fichierDocCharge: boolean = false;
  demandeTransaction: boolean = false;

  constructor(private readonly messageService: MessageService, private readonly documentService: DocumentService) {}

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
      //appel de l'api
      this.documentService.authenticateDocumentFromEthereum(formData).subscribe(response =>
        {
          //recuperation de l'objet reponse de l'api
          this.verifResponse = response.body;
          this.demandeTransaction = true;
        }
      )
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
