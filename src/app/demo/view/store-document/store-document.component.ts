import { Component, ViewChild } from '@angular/core';
import {Message, MessageService} from 'primeng/api';
import { AddResponse, IAddResponse } from '../../domain/add-response';
import { NgForm } from '@angular/forms';
import { DocumentService } from '../../service/document-service';
import { DataDocument, IDataDocument } from '../../domain/data-document';

@Component({
  selector: 'app-store-document',
  templateUrl: './store-document.component.html',
  styleUrls: ['./store-document.component.scss'],
  providers: [MessageService]
})
export class StoreDocumentComponent {
  //=========== declarations necessaires ===================
  @ViewChild('dtf') form!: NgForm;
  addResponse: IAddResponse = new AddResponse();
  dataDocument: IDataDocument = new DataDocument();
  message: any;
  timeoutHandle: any;
  uploadedFiles: any[] = [];
  selectedFile: File | null = null;
  crtSelectedFile: File | null = null;
  fichierCrtCharge: boolean = false;
  fichierDocCharge: boolean = false;

  //constructeur pour injection des services necessaires
  constructor(private readonly messageService: MessageService, private readonly documentService: DocumentService) {}

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

  //ajout de document dans Ethereum via le backend
  addDocument() {
    if(this.dataDocument) {
      //initialisation du formData
      const formData: FormData = new FormData();
      this.dataDocument.docAdminFile = this.selectedFile;
      this.dataDocument.keysFile = this.crtSelectedFile;
      formData.append("privateKey", this.dataDocument.clePrivee);
      formData.append("publicKey", this.dataDocument.clePublic);
      formData.append("file", this.dataDocument.docAdminFile);
      formData.append("fileKey", this.dataDocument.keysFile);
      //appel de l'api
      this.documentService.saveDocumentToEthereum(formData).subscribe(response =>
        {
          //recuperation de l'objet reponse de l'api
          this.addResponse = response.body;
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
