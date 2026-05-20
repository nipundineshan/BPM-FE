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
    <div class="portfolio-wrapper">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-end mb-5 animate-slide-in">
        <div>
          <h1 class="h1 fw-black tracking-tighter mb-1 text-gradient">Asset Registry</h1>
          <p class="text-secondary fw-medium opacity-75 mb-0">Manage and track your tokenized real estate portfolio.</p>
        </div>
        <button mat-flat-button color="primary" routerLink="/user/register-plot" class="pulse-on-hover">
          <mat-icon class="me-2">add_circle</mat-icon> TOKENIZE NEW ASSET
        </button>
      </div>

      <!-- Filters & Search -->
      <div class="glass-filter-bar p-3 animate-fade-in mb-5">
        <div class="d-flex align-items-center gap-4 flex-grow-1 w-100">
          <div class="glass-search-box flex-grow-1">
            <mat-icon class="search-icon text-primary">search</mat-icon>
            <input type="text" placeholder="Scan registry by name or address..." (keyup)="onSearch($event)" class="search-input">
          </div>
          
          <div class="v-divider-glass"></div>
          
          <div class="d-flex align-items-center gap-2 overflow-auto pb-1">
            <button class="filter-pill" [class.active]="currentFilter === 'ALL'" (click)="filterStatus('ALL')">ALL NODES</button>
            <button class="filter-pill" [class.active]="currentFilter === 'pending_approval'" (click)="filterStatus('pending_approval')">PENDING</button>
            <button class="filter-pill" [class.active]="currentFilter === 'approved'" (click)="filterStatus('approved')">VERIFIED</button>
            <button class="filter-pill" [class.active]="currentFilter === 'minted'" (click)="filterStatus('minted')">MINTED</button>
            <button class="filter-pill" [class.active]="currentFilter === 'rejected'" (click)="filterStatus('rejected')">REJECTED</button>
          </div>
        </div>
      </div>

      <div *ngIf="isLoading" class="py-5 text-center">
        <mat-progress-bar mode="indeterminate" class="glass-progress"></mat-progress-bar>
      </div>

      <!-- Asset Grid -->
      <div class="row g-4" *ngIf="!isLoading">
        <div class="col-xl-3 col-lg-4 col-md-6" *ngFor="let plot of filteredPlots(); let i = index">
          <mat-card class="asset-glass-card-premium overflow-hidden animate-fade-in" 
            [style.animation-delay]="i * 0.05 + 's'"
            [routerLink]="['/user/plot-details', plot.id]">
            
            <div class="asset-visual-container">
              <img [src]="plot.propertyImages[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'" class="asset-visual-img">
              <div class="visual-overlay"></div>
              <div class="badge-float badge-glass" [ngClass]="'bg-' + getStatusColor(plot.status) + '-glass'">
                {{plot.status.replace('_', ' ')}}
              </div>
            </div>
            
            <mat-card-content class="p-4 d-flex flex-column">
              <h3 class="h6 fw-black mb-1 text-truncate tracking-tight" [title]="plot.plotName">{{plot.plotName}}</h3>
              <div class="d-flex align-items-center text-muted tiny fw-bold mb-4">
                <mat-icon class="tiny-icon me-1 text-primary">location_on</mat-icon> 
                <span class="text-truncate">{{plot.address}}</span>
              </div>
              
              <div class="asset-metrics-glass mt-auto pt-3 glass-border-top">
                <div class="d-flex justify-content-between mb-2">
                  <span class="tiny text-muted fw-black uppercase letter-spacing-1">Value</span>
                  <span class="small fw-black text-primary-color">₹ {{plot.marketValue | number:'1.0-0'}}</span>
                </div>
                <div class="d-flex justify-content-between">
                  <span class="tiny text-muted fw-black uppercase letter-spacing-1">Dimensions</span>
                  <span class="small fw-bold opacity-75">{{plot.areaSize}}</span>
                </div>
              </div>
            </mat-card-content>
            
            <mat-card-footer class="px-4 py-3 glass-footer-bg d-flex justify-content-between align-items-center border-0">
              <span class="tiny text-muted fw-black opacity-50 letter-spacing-1">NODE: {{plot.id.substring(0,8)}}</span>
              <div class="d-flex gap-2">
                 <mat-icon *ngIf="plot.status === 'minted'" class="text-success pulse-green" matTooltip="Secured on Blockchain" style="font-size: 18px; width: 18px; height: 18px;">verified</mat-icon>
                 <mat-icon class="text-primary opacity-50" style="font-size: 18px; width: 18px; height: 18px;">arrow_forward_ios</mat-icon>
              </div>
            </mat-card-footer>
          </mat-card>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && filteredPlots().length === 0" class="glass-empty-state animate-fade-in">
        <div class="empty-icon-box-glass mx-auto mb-4 animate-float">
          <mat-icon>layers_clear</mat-icon>
        </div>
        <h4 class="fw-black tracking-tight mb-2 text-gradient fs-4">Registry Null</h4>
        <p class="text-muted fw-medium mb-4 mx-auto" style="max-width: 300px;">No digital assets detected matching your current filtering parameters.</p>
        <button mat-button class="glass-btn-outline px-4" (click)="filterStatus('ALL')">RECALIBRATE FILTERS</button>
      </div>
    </div>
  `,
  styles: [`
    .portfolio-wrapper { padding: 1rem 0; }
    
    .text-gradient {
      background: var(--gradient-1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
    .animate-slide-in { animation: slideIn 0.8s ease-out forwards; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }

    /* Glass Filter Bar */
    .glass-filter-bar {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      border: 1px solid var(--glass-border);
      border-radius: 1.5rem;
      display: flex;
      align-items: center;
    }
    
    .glass-search-box { 
      display: flex; align-items: center; gap: 1rem; 
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      padding: 0 1rem;
      height: 44px;
    }
    .search-input { border: none; outline: none; font-size: 0.85rem; width: 100%; color: var(--text-primary); background: transparent; font-weight: 500; }
    .search-input::placeholder { color: var(--text-muted); opacity: 0.5; }
    
    .v-divider-glass { width: 1px; height: 32px; background: var(--glass-border); }

    .filter-pill {
      background: transparent;
      border: 1px solid transparent;
      color: var(--text-secondary);
      padding: 6px 16px;
      border-radius: 10px;
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      transition: all 0.3s;
      white-space: nowrap;
      
      &:hover {
        background: rgba(255,255,255,0.05);
        color: var(--primary-color);
      }
      
      &.active {
        background: var(--gradient-1);
        color: white;
        box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
      }
    }

    /* Asset Cards */
    .asset-glass-card-premium {
      border-radius: 2rem !important;
      cursor: pointer;
      border: 1px solid var(--glass-border) !important;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .asset-glass-card-premium:hover {
      transform: translateY(-12px) scale(1.02);
      border-color: var(--primary-color) !important;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important;
    }
    
    .asset-visual-container { position: relative; height: 200px; overflow: hidden; }
    .asset-visual-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease; }
    .asset-glass-card-premium:hover .asset-visual-img { transform: scale(1.15); }
    
    .visual-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7));
    }

    .badge-float {
      position: absolute; top: 1.25rem; right: 1.25rem; z-index: 2;
    }

    .glass-footer-bg { background: rgba(255, 255, 255, 0.02) !important; border-top: 1px solid var(--glass-border) !important; }
    .glass-border-top { border-top: 1px solid var(--glass-border); }

    .empty-icon-box-glass {
      width: 100px; height: 100px;
      background: rgba(99, 102, 241, 0.05);
      color: var(--primary-color);
      border-radius: 30px;
      display: flex; align-items: center; justify-content: center;
      
      mat-icon { font-size: 48px; width: 48px; height: 48px; opacity: 0.5; }
    }

    .tiny-icon { font-size: 14px; width: 14px; height: 14px; }
    .text-primary-color { color: var(--primary-color); }
    .letter-spacing-1 { letter-spacing: 0.1em; }
    .letter-spacing-2 { letter-spacing: 0.2em; }
    .tiny { font-size: 0.65rem; }
    
    .glass-progress { height: 4px; border-radius: 2px; background: rgba(255,255,255,0.05); }

    .glass-btn-outline {
      border: 1px solid var(--glass-border) !important;
      background: rgba(255,255,255,0.03) !important;
      border-radius: 12px !important;
      font-weight: 800 !important;
      letter-spacing: 0.1em !important;
      font-size: 0.75rem !important;
      padding: 10px 24px !important;
      color: var(--text-primary) !important;
      
      &:hover {
        background: rgba(255,255,255,0.08) !important;
        border-color: var(--primary-color) !important;
      }
    }
    
    .pulse-green {
      animation: pulse-green-glow 2s infinite;
    }
    @keyframes pulse-green-glow {
      0% { text-shadow: 0 0 0 rgba(16, 185, 129, 0); }
      50% { text-shadow: 0 0 10px rgba(16, 185, 129, 0.8); }
      100% { text-shadow: 0 0 0 rgba(16, 185, 129, 0); }
    }
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
        p.plotName.toLowerCase().includes(searchValue) || 
        p.address.toLowerCase().includes(searchValue)
      );
    }
    
    this.filteredPlots.set(results);
  }

  getStatusColor(status: string) {
    switch (status) {
      case 'minted': return 'success';
      case 'approved': return 'primary';
      case 'rejected': return 'danger';
      case 'pending_approval': return 'warning';
      default: return 'secondary';
    }
  }
}
