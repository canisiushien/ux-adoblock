import { Component, ViewChild } from '@angular/core';
import { IKeysPair, KeysPair } from '../../domain/keys-pair';
import { Message } from 'primeng/api/message';
import { DocumentService } from '../../service/document-service';
import { NgForm } from '@angular/forms';
import { ZipperService } from '../../service/zipper-service';

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
  constructor(private readonly documentService: DocumentService, private readonly zipper: ZipperService){}

   //=========== methodes et fonctions ===================
  //generer une paire de clés
  keysGenerator(): void {
    if (this.keysPair) {
        this.documentService.generateKeysPair().subscribe({
          next: (response) => {
            this.keysPair = response.body;
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

  //pour copier la valeur de la clé en un clic
  copyToClipboard(value: string): void {
    //le texte est copié dans le presse-papiers via le navigator.clipboard.writeText(value)
    navigator.clipboard.writeText(value).then(() => {
      console.log('Clé copiée avec succès !');
    }).catch(err => {
      console.error('Erreur lors de la copie de la clé :', err);
    });
  }

  //genere et telecharge le zip contenant les fichiers necessaires
  downloadKeys(): void {
    this.zipper.generateAndDownloadZip(this.keysPair.publicKey, this.keysPair.privateKey);
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