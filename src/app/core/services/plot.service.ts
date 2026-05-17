import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
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
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => res.data || res),
      tap(() => this.appState.setLoading(false))
    );
  }

  getMyPlots(): Observable<Plot[]> {
    this.appState.setLoading(true);
    return this.http.get<any>(`${this.apiUrl}/my-plots`).pipe(
      map(res => res.data || res),
      tap(() => this.appState.setLoading(false))
    );
  }

  getPlotById(id: string): Observable<Plot> {
    this.appState.setLoading(true);
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data || res),
      tap(() => this.appState.setLoading(false))
    );
  }

  createPlot(plotData: any): Observable<Plot> {
    this.appState.setLoading(true);
    return this.http.post<any>(this.apiUrl, plotData).pipe(
      map(res => res.data || res),
      tap(() => this.appState.setLoading(false))
    );
  }

  approvePlot(id: string): Observable<Plot> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/approve`, {}).pipe(
      map(res => res.data || res)
    );
  }

  rejectPlot(id: string, reason: string): Observable<Plot> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/reject`, { reason }).pipe(
      map(res => res.data || res)
    );
  }

  uploadToIpfs(id: string): Observable<{ ipfsHash: string }> {
    return this.http.post<any>(`${this.apiUrl}/${id}/ipfs`, {}).pipe(
      map(res => res.data || res)
    );
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`).pipe(
      map(res => res.data || res)
    );
  }

  getGlobalStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/global-stats`).pipe(
      map(res => res.data || res)
    );
  }
}
