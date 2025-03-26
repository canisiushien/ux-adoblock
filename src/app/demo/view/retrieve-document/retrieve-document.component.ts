import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IAddResponse, AddResponse } from '../../domain/add-response';
import { Message, MessageService } from 'primeng/api';
import { DocumentService } from '../../service/document-service';

@Component({
  selector: 'app-retrieve-document',
  templateUrl: './retrieve-document.component.html',
  styleUrls: ['./retrieve-document.component.scss'],
  providers: [MessageService]
})
export class RetrieveDocumentComponent {
  //=========== declarations necessaires ===================
  @ViewChild('dtf') form!: NgForm;
  addResponse: IAddResponse = new AddResponse();
  message: any;
  timeoutHandle: any;
  uploadedFiles: any[] = [];

  constructor(private messageService: MessageService, private documentService: DocumentService) {}

  onUpload(event) {
    for (const file of event.files) {
        this.uploadedFiles.push(file);
    }
    this.messageService.add({severity: 'info', summary: 'Success', detail: 'Document chargé avec succès.'});
}

retrieveDocument() {
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
