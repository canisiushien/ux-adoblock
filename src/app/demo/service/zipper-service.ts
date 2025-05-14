import { Injectable } from '@angular/core';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class ZipperService {
  //constructeur
  constructor() {}

  //on génère puis telecharge le fichier zippé
  generateAndDownloadZip(clePub: string, clePriv: string): void {
    const zip = new JSZip();
    const horodatage = new Date().getTime();

    // Ajouter cle-publique.txt
    zip.file('cle-publique-'+ horodatage +'.txt', clePub);

    // Ajouter trusted-bundle.crt (clePriv + clePub)
    const bundleContent = `${clePriv}`+ ' ' +`${clePub}`;
    zip.file('trusted-bundle-'+ horodatage +'.crt', bundleContent);

    // Générer et déclencher le téléchargement
    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'full-confidentiel-'+ horodatage +'.zip');
    });
  }
}
