import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NftService {
  private readonly apiUrl = 'http://localhost:3000/api/nft';

  constructor(private http: HttpClient) {}

  mintPlot(plotId: string): Observable<{ transactionHash: string }> {
    return this.http.post<{ transactionHash: string }>(`${this.apiUrl}/mint/${plotId}`, {});
  }
}
