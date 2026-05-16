import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Plot } from '../models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlotService {
  private readonly apiUrl = 'http://localhost:3000/api/v1/plots';

  constructor(private http: HttpClient) {}

  getPlots(): Observable<Plot[]> {
    return this.http.get<ApiResponse<Plot[]>>(this.apiUrl).pipe(
      map(res => res.data)
    );
  }

  getPlotById(id: string): Observable<Plot> {
    return this.http.get<ApiResponse<Plot>>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }

  createPlot(payload: Partial<Plot>): Observable<Plot> {
    return this.http.post<ApiResponse<Plot>>(this.apiUrl, payload).pipe(
      map(res => res.data)
    );
  }

  prepareForMinting(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/ipfs`, {});
  }
}
