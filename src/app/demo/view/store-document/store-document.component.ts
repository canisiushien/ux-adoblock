import { Component, OnInit, ViewChild } from '@angular/core';
import {Message, MessageService} from 'primeng/api';
import { AddResponse, IAddResponse } from '../../domain/add-response';
import { NgForm } from '@angular/forms';
import { DocumentService } from '../../service/document-service';
import { DataDocument, IDataDocument } from '../../domain/data-document';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-store-document',
  templateUrl: './store-document.component.html',
  //styleUrls: ['./store-document.component.scss'],
  providers: [MessageService]
})
export class StoreDocumentComponent implements OnInit {
  //=========== declarations necessaires ===================
  @ViewChild('dtf') form!: NgForm;
  addResponse: IAddResponse = new AddResponse();
  dataDocument: IDataDocument = new DataDocument();
  message: any;
  timeoutHandle: any;
  uploadedFiles: any[] = [];
  selectedFile: File | null = null;


  constructor(private messageService: MessageService, private documentService: DocumentService) {}

  ngOnInit(): void {
  }

  // Gestion de la sélection du fichier
  onFileSelect(event: any): void {
    const file: File = event.files[0];

    if (file) {
      console.log("Nom du fichier :", file.name);
      console.log("Type MIME :", file.type);
      console.log("Taille :", file.size, "octets");

      // Vérification du type de fichier
      const allowedTypes = ["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        console.error("Type de fichier non autorisé !");
        return;
      }
      this.selectedFile = file;
    }
  }

  addDocument() {
    if(this.dataDocument) {
      //initialisation du formData
      const formData: FormData = new FormData();
      this.dataDocument.fichier = this.selectedFile;
      formData.append("privateKey", this.dataDocument.clePrivee);
      formData.append("publicKey", this.dataDocument.clePublic);
      formData.append("file", this.dataDocument.fichier);
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
  clear(): void {
    this.form.resetForm();
  }
}
