import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plot } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PlotService {
  private readonly apiUrl = 'http://localhost:3000/api/plots';

  constructor(private http: HttpClient) {}

  getPlots(): Observable<Plot[]> {
    return this.http.get<Plot[]>(this.apiUrl);
  }

  getPlotById(id: string): Observable<Plot> {
    return this.http.get<Plot>(`${this.apiUrl}/${id}`);
  }

  createPlot(payload: Partial<Plot>): Observable<Plot> {
    return this.http.post<Plot>(this.apiUrl, payload);
  }

  prepareForMinting(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/ipfs`, {});
  }
}
