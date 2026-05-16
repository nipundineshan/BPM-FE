import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiResponse } from '../models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NftService {
  private readonly apiUrl = 'http://localhost:3000/api/v1/nfts';

  constructor(private http: HttpClient) {}

  mintPlot(plotId: string): Observable<{ transactionHash: string }> {
    return this.http.post<ApiResponse<{ transactionHash: string }>>(`${this.apiUrl}/mint/${plotId}`, {}).pipe(
      map(res => res.data)
    );
  }
}
