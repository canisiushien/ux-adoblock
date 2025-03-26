import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IKeysPair } from '../domain/keys-pair';
import { IAddResponse } from '../domain/add-response';
import { IVerifResponse } from '../domain/verif-response';

type EntityResponseType = HttpResponse<IKeysPair>;
type EntityArrayResponseType = HttpResponse<IKeysPair[]>;
type EntityAddDocResponseType = HttpResponse<IAddResponse>;
type EntityVerifDocResponseType = HttpResponse<IVerifResponse>;

@Injectable({
  providedIn: 'root'
})

export class DocumentService {

    constructor(private http:HttpClient) { }

    /**
     * service de genration des clés privée et publique
     * @returns 
     */
    generateKeysPair(): Observable<EntityResponseType> {
        return this.http.get<IKeysPair>(`${environment.generateKeysPair}`, { observe: 'response' });
    }

    /**
     * enregistre un document administratif sur la blockchain
     * @param document 
     * @returns 
     */
    saveDocumentToEthereum(document: any): Observable<EntityAddDocResponseType> {
        return this.http.post<IAddResponse>(environment.storeDocToBlockchain, document, { observe: 'response' });
    }
  
    /**
     * vérifie l'authenticité d'un document administratif depuis la blockchain
     * @param document 
     * @returns 
     */
    authenticateDocumentFromEthereum(document: any): Observable<EntityVerifDocResponseType> {
        return this.http.post<IVerifResponse>(environment.retrieveDocFromBlockchain, document, { observe: 'response' });
    }
  }