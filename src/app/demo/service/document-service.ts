import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IKeysPair } from '../domain/keys-pair';
import { IAddResponse } from '../domain/add-response';
import { IVerifResponse } from '../domain/verif-response';
import { IDocumentETH } from '../domain/document-eth';

type EntityResponseType = HttpResponse<IKeysPair>;
type EntityArrayResponseType = HttpResponse<IKeysPair[]>;
type EntityAddDocResponseType = HttpResponse<IAddResponse>;
type EntityDocumentETHType = HttpResponse<IDocumentETH>;
type EntityVerifDocResponseType = HttpResponse<IVerifResponse>;

@Injectable({
  providedIn: 'root'
})

export class DocumentService {

    constructor(private readonly http:HttpClient) { }

    /**
     * service de genration des clés privée et publique
     * @returns 
     */
    generateKeysPair(): Observable<EntityResponseType> {
        return this.http.get<IKeysPair>(`${environment.generateKeysPair}`, { observe: 'response' });
    }
    

    /**
     * extrait et calcul le necessaire pour l'enregistrement d'un document
     * administratif sur la blockchain
     *
     * @param document 
     * @returns 
     */
    prepareStoreDocumentToEthereum(document: any): Observable<EntityDocumentETHType> {
        return this.http.post<IDocumentETH>(environment.prepareStoreToBlockchain, document, { observe: 'response' });
    }

    /**
     * extrait et calcul le necessaire pour la recherche d'un document administratif
     * depuis la blockchain
     *
     * @param document 
     * @returns 
     */
    prepareGetDocumentFromEthereum(document: any): Observable<EntityDocumentETHType> {
        return this.http.post<IDocumentETH>(environment.prepareStoreToBlockchain, document, { observe: 'response' });
    }

    /**
     * vérifie l'authenticité d'un document administratif digital venant de la blockchain
     * @param document 
     * @returns 
     */
    verifyDocumentFromEthereum(document: any): Observable<EntityVerifDocResponseType> {
        return this.http.post<IVerifResponse>(environment.verifyDocFromBlockchain, document, { observe: 'response' });
    }
  }