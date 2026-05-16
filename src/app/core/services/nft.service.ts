import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Web3Service } from './web3.service';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NftService {
  private apiUrl = `${environment.apiUrl}/nft`;

  constructor(private http: HttpClient, private web3Service: Web3Service) {}

  mintNft(plotId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/mint/${plotId}`, {});
  }
}
