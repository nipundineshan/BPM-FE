import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlotService } from '../../core/services/plot.service';
import { Plot } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-slate-900">Properties Overview</h1>
        <a routerLink="/plots/create" 
           class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-shadow shadow-sm">
          Add New Plot
        </a>
      </div>

      <div *ngIf="loading()" class="flex justify-center py-12">
        <div class="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>

      <div *ngIf="!loading() && plots().length === 0" class="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
        <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-slate-900">No properties found</h3>
        <p class="mt-1 text-sm text-slate-500">Get started by creating a new property plot.</p>
      </div>

      <div *ngGrid class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let plot of plots()" 
             class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
             [routerLink]="['/plots', plot.id]">
          <div class="h-48 bg-slate-200 relative">
            <img *ngIf="plot.imageUrl" [src]="plot.imageUrl" class="w-full h-full object-cover">
            <div *ngIf="!plot.imageUrl" class="w-full h-full flex items-center justify-center text-slate-400">
               <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <div class="absolute top-4 right-4">
              <span [ngClass]="{
                'bg-yellow-100 text-yellow-700': plot.status === 'PENDING',
                'bg-blue-100 text-blue-700': plot.status === 'IPFS_PINNED',
                'bg-green-100 text-green-700': plot.status === 'MINTED'
              }" class="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {{ plot.status.replace('_', ' ') }}
              </span>
            </div>
          </div>
          <div class="p-5">
            <h3 class="text-lg font-bold text-slate-900 truncate">{{ plot.title }}</h3>
            <p class="text-sm text-slate-500 mt-1 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              {{ plot.location }}
            </p>
            <div class="mt-4 flex items-center justify-between">
              <span class="text-primary-600 font-bold text-lg">\${{ plot.price.toLocaleString() }}</span>
              <span *ngIf="plot.tokenId" class="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">ID: #{{ plot.tokenId }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  plots = signal<Plot[]>([]);
  loading = signal(true);

  constructor(private plotService: PlotService) {}

  ngOnInit(): void {
    this.loadPlots();
  }

  loadPlots(): void {
    this.plotService.getPlots().subscribe({
      next: (data) => {
        this.plots.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
