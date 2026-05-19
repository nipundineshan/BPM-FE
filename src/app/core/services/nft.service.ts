import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Web3Service } from './web3.service';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NftService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/nfts`;

  mintNft(plotId: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/mint/${plotId}`, {})
      .pipe(map((res) => res.data || res));
  }
}
