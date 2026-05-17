import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PlotService } from '../../../core/services/plot.service';
import { Plot } from '../../../core/models';

@Component({
  selector: 'app-plot-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatProgressBarModule,
    MatDividerModule,
    MatTooltipModule
  ],
  template: `
    <div class="portfolio-wrapper animate-fade-in">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h1 class="h2 fw-bold tracking-tight mb-1">Property Portfolio</h1>
          <p class="text-slate-500 mb-0">Manage and track your tokenized real estate assets.</p>
        </div>
        <button mat-flat-button color="primary" routerLink="/user/register-plot" class="rounded-pill px-4 shadow-sm">
          <mat-icon class="me-1">add_circle</mat-icon> Register New Asset
        </button>
      </div>

      <!-- Filters & Search -->
      <div class="filter-bar p-3 bg-white rounded-4 shadow-sm border mb-5 d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div class="d-flex align-items-center gap-3 flex-grow-1" style="max-width: 600px;">
          <div class="search-box flex-grow-1">
            <mat-icon class="search-icon">search</mat-icon>
            <input type="text" placeholder="Search by title or location..." (keyup)="onSearch($event)" class="search-input">
          </div>
          <div class="v-divider"></div>
          <mat-chip-set class="status-filters">
            <mat-chip-option [selected]="currentFilter === 'ALL'" (click)="filterStatus('ALL')">All</mat-chip-option>
            <mat-chip-option [selected]="currentFilter === 'PENDING_APPROVAL'" (click)="filterStatus('PENDING_APPROVAL')">Pending</mat-chip-option>
            <mat-chip-option [selected]="currentFilter === 'APPROVED'" (click)="filterStatus('APPROVED')">Verified</mat-chip-option>
            <mat-chip-option [selected]="currentFilter === 'MINTED'" (click)="filterStatus('MINTED')">Minted</mat-chip-option>
          </mat-chip-set>
        </div>
        
        <div class="view-options d-flex gap-2">
           <button mat-icon-button class="text-slate-400 active"><mat-icon>grid_view</mat-icon></button>
           <button mat-icon-button class="text-slate-400"><mat-icon>list</mat-icon></button>
        </div>
      </div>

      <mat-progress-bar *ngIf="isLoading" mode="indeterminate" class="mb-4 rounded-pill"></mat-progress-bar>

      <!-- Asset Grid -->
      <div class="row g-4">
        <div class="col-xl-3 col-lg-4 col-md-6" *ngFor="let plot of filteredPlots()">
          <mat-card class="premium-asset-card border-0 shadow-sm h-100 overflow-hidden" [routerLink]="['/user/plot-details', plot.id]">
            <div class="asset-visual">
              <img [src]="plot.imageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'" class="asset-thumb">
              <div class="asset-overlay">
                <span class="badge" [ngClass]="getStatusClass(plot.status)">
                  {{plot.status.replace('_', ' ')}}
                </span>
              </div>
            </div>
            
            <mat-card-content class="p-4 d-flex flex-column">
              <h3 class="h6 fw-bold mb-1 text-truncate tracking-tight" [title]="plot.title">{{plot.title}}</h3>
              <div class="d-flex align-items-center text-slate-400 tiny fw-semibold mb-4">
                <mat-icon class="tiny-icon me-1">location_on</mat-icon> {{plot.location}}
              </div>
              
              <div class="asset-details-grid mt-auto pt-3 border-top">
                <div class="d-flex justify-content-between mb-2">
                  <span class="tiny text-slate-400 fw-bold">MARKET VALUE</span>
                  <span class="small fw-bold text-indigo">{{plot.price | currency:'USD':'symbol':'1.0-0'}}</span>
                </div>
                <div class="d-flex justify-content-between">
                  <span class="tiny text-slate-400 fw-bold">TOTAL AREA</span>
                  <span class="small fw-semibold text-slate-600">{{plot.areaSize}} sqft</span>
                </div>
              </div>
            </mat-card-content>
            
            <mat-card-footer class="px-4 py-3 bg-slate-50 d-flex justify-content-between align-items-center">
              <span class="tiny text-slate-400 fw-bold">REF: #{{plot.id.substring(0,8)}}</span>
              <div class="d-flex gap-2">
                 <mat-icon *ngIf="plot.status === 'MINTED'" class="text-success small-icon" matTooltip="Secured on Blockchain">verified</mat-icon>
                 <mat-icon class="text-slate-300 small-icon">arrow_forward</mat-icon>
              </div>
            </mat-card-footer>
          </mat-card>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && filteredPlots().length === 0" class="empty-portfolio text-center">
        <div class="empty-illustration mb-4">
          <mat-icon class="display-1 text-slate-100">holiday_village</mat-icon>
        </div>
        <h4 class="fw-bold tracking-tight">No properties found</h4>
        <p class="text-slate-500">We couldn't find any assets matching your current filters.</p>
        <button mat-stroked-button color="primary" class="rounded-pill mt-2 px-4" (click)="filterStatus('ALL')">Reset All Filters</button>
      </div>
    </div>
  `,
  styles: [`
    .portfolio-wrapper { padding: 10px; }
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .text-indigo { color: var(--primary-color); }
    .v-divider { width: 1px; height: 32px; background: var(--border-color); }

    /* Filter Bar */
    .search-box { display: flex; align-items: center; gap: 0.75rem; padding: 0 0.5rem; }
    .search-icon { color: var(--text-muted); font-size: 20px; width: 20px; height: 20px; }
    .search-input { border: none; outline: none; font-size: 0.875rem; width: 100%; color: var(--text-primary); background: transparent; }
    
    /* Asset Cards */
    .premium-asset-card {
      border-radius: 1.25rem !important;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .premium-asset-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1) !important;
    }
    
    .asset-visual { position: relative; height: 180px; overflow: hidden; }
    .asset-thumb { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
    .premium-asset-card:hover .asset-thumb { transform: scale(1.1); }
    
    .asset-overlay {
      position: absolute; top: 1rem; right: 1rem;
    }
    .asset-overlay .badge {
      backdrop-filter: blur(8px); background: rgba(255, 255, 255, 0.9);
      color: #0f172a; padding: 6px 12px; border-radius: 9999px; font-size: 0.65rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border: 1px solid rgba(0,0,0,0.05);
    }

    .bg-slate-50 { background-color: #f8fafc; }
    
    /* Empty State */
    .empty-portfolio { padding: 8rem 2rem; }
    .tiny-icon { font-size: 14px; width: 14px; height: 14px; }
    .small-icon { font-size: 18px; width: 18px; height: 18px; }
  `]
})
export class PlotListComponent implements OnInit {
  private plotService = inject(PlotService);
  
  plots = signal<Plot[]>([]);
  filteredPlots = signal<Plot[]>([]);
  isLoading = true;
  currentFilter = 'ALL';

  ngOnInit() {
    this.loadPlots();
  }

  loadPlots() {
    this.plotService.getMyPlots().subscribe({
      next: (plots) => {
        this.plots.set(plots || []);
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.applyFilters(value);
  }

  filterStatus(status: string) {
    this.currentFilter = status;
    this.applyFilters();
  }

  applyFilters(searchValue: string = '') {
    let results = this.plots();
    
    if (this.currentFilter !== 'ALL') {
      results = results.filter(p => p.status === this.currentFilter);
    }
    
    if (searchValue) {
      results = results.filter(p => 
        p.title.toLowerCase().includes(searchValue) || 
        p.location.toLowerCase().includes(searchValue)
      );
    }
    
    this.filteredPlots.set(results);
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'MINTED': return 'text-indigo';
      case 'APPROVED': return 'text-success';
      case 'PENDING_APPROVAL': return 'text-warning';
      case 'REJECTED': return 'text-danger';
      default: return 'text-secondary';
    }
  }
}
