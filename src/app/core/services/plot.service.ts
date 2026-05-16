import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Plot, PlotStatus } from '../models';
import { environment } from '../../../environments/environment';
import { AppStateService } from './app-state.service';

@Injectable({
  providedIn: 'root'
})
export class PlotService {
  private http = inject(HttpClient);
  private appState = inject(AppStateService);
  private apiUrl = `${environment.apiUrl}/plots`;

  getAllPlots(): Observable<Plot[]> {
    this.appState.setLoading(true);
    return this.http.get<Plot[]>(this.apiUrl).pipe(
      tap(() => this.appState.setLoading(false))
    );
  }

  getMyPlots(): Observable<Plot[]> {
    this.appState.setLoading(true);
    return this.http.get<Plot[]>(`${this.apiUrl}/my-plots`).pipe(
      tap(() => this.appState.setLoading(false))
    );
  }

  getPlotById(id: string): Observable<Plot> {
    this.appState.setLoading(true);
    return this.http.get<Plot>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.appState.setLoading(false))
    );
  }

  createPlot(plotData: any): Observable<Plot> {
    this.appState.setLoading(true);
    return this.http.post<Plot>(this.apiUrl, plotData).pipe(
      tap(() => this.appState.setLoading(false))
    );
  }

  approvePlot(id: string): Observable<Plot> {
    return this.http.patch<Plot>(`${this.apiUrl}/${id}/approve`, {});
  }

  rejectPlot(id: string, reason: string): Observable<Plot> {
    return this.http.patch<Plot>(`${this.apiUrl}/${id}/reject`, { reason });
  }

  uploadToIpfs(id: string): Observable<{ ipfsHash: string }> {
    return this.http.post<{ ipfsHash: string }>(`${this.apiUrl}/${id}/ipfs`, {});
  }
}
