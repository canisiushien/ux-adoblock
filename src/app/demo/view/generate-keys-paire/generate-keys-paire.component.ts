import { Component, ViewChild } from '@angular/core';
import { IKeysPair, KeysPair } from '../../domain/keys-pair';
import { Message } from 'primeng/api/message';
import { DocumentService } from '../../service/document-service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-generate-keys-paire',
  templateUrl: './generate-keys-paire.component.html',
  styleUrls: ['./generate-keys-paire.component.scss']
})
export class GenerateKeysPaireComponent {
  //=========== declarations necessaires ===================
  @ViewChild('dtf') form!: NgForm;
  keysPair: IKeysPair = new KeysPair();
  message: any;
  timeoutHandle: any;

  //=========== constructeur ===================
  constructor(private documentService: DocumentService){}

   //=========== methodes et fonctions ===================
  //generer une paire de clés
  keysGenerator(): void {
    if (this.keysPair) {
        this.documentService.generateKeysPair().subscribe({
          next: (response) => {
            this.keysPair = response.body;
            console.log("Paire de clés = ",this.keysPair);
            this.showMessage({
              severity: 'success',
              summary: 'Paire de clés cryptographiques générée avec succès',
            });
          },
          error: (reason) => {
              this.message = { severity: 'error', summary: reason.error };
              console.error('======= ' + JSON.stringify(reason));
          }
        });
    }
  }

  downloadKeys(): void {
    
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