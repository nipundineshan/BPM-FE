import { Component, OnInit, signal } from '@angular/core';
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
    MatDividerModule
  ],
  template: `
    <div class="container-fluid p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="display-6 fw-bold text-dark mb-1">My Property Portfolio</h1>
          <p class="text-muted mb-0">Manage and track your registered property plots.</p>
        </div>
        <button mat-flat-button color="primary" routerLink="/user/register-plot" class="rounded-pill px-4">
          <mat-icon>add</mat-icon> Register New Plot
        </button>
      </div>

      <!-- Filters Row -->
      <div class="row mb-4 align-items-center g-3">
        <div class="col-md-6">
          <mat-form-field appearance="outline" class="w-100 mb-0">
            <mat-label>Search properties</mat-label>
            <input matInput placeholder="Search by title, location..." (keyup)="onSearch($event)">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
        </div>
        <div class="col-md-6">
          <mat-chip-set aria-label="Status selection">
            <mat-chip-option selected (click)="filterStatus('ALL')">All</mat-chip-option>
            <mat-chip-option (click)="filterStatus('PENDING_APPROVAL')">Pending</mat-chip-option>
            <mat-chip-option (click)="filterStatus('APPROVED')">Approved</mat-chip-option>
            <mat-chip-option (click)="filterStatus('MINTED')">Minted</mat-chip-option>
          </mat-chip-set>
        </div>
      </div>

      <mat-progress-bar *ngIf="isLoading" mode="indeterminate" class="mb-4 rounded"></mat-progress-bar>

      <div class="row g-4">
        <div class="col-xl-3 col-lg-4 col-md-6" *ngFor="let plot of filteredPlots()">
          <mat-card class="plot-card shadow-sm border-0 h-100 overflow-hidden rounded-4" [routerLink]="['/user/plot-details', plot.id]">
            <div class="plot-img-container position-relative">
              <img mat-card-image [src]="plot.imageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'" alt="Plot Image" class="plot-img">
              <div class="status-overlay">
                <span class="badge rounded-pill shadow-sm" [ngClass]="getStatusClass(plot.status)">
                  {{plot.status}}
                </span>
              </div>
            </div>
            
            <mat-card-content class="p-3">
              <h3 class="mb-1 h6 fw-bold text-truncate" [title]="plot.title">{{plot.title}}</h3>
              <p class="text-muted small mb-3 text-truncate"><mat-icon class="small-icon">location_on</mat-icon> {{plot.location}}</p>
              
              <div class="d-flex justify-content-between align-items-end mt-auto">
                <div>
                  <div class="text-muted tiny text-uppercase fw-bold">Price</div>
                  <div class="fw-bold text-primary">{{plot.price | currency}}</div>
                </div>
                <div class="text-end">
                  <div class="text-muted tiny text-uppercase fw-bold">Area</div>
                  <div class="small fw-bold">{{plot.areaSize}} sqft</div>
                </div>
              </div>
            </mat-card-content>
            
            <mat-divider></mat-divider>
            
            <mat-card-actions class="px-3 py-2 d-flex justify-content-between align-items-center">
              <button mat-button color="primary">View Details</button>
              <mat-icon *ngIf="plot.status === 'MINTED'" class="text-success" title="NFT Minted">verified</mat-icon>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>

      <div *ngIf="!isLoading && filteredPlots().length === 0" class="text-center py-5 mt-5">
        <div class="bg-light d-inline-block p-4 rounded-circle mb-3">
          <mat-icon class="display-1 text-muted">search_off</mat-icon>
        </div>
        <h4 class="fw-bold">No properties found</h4>
        <p class="text-muted">Try adjusting your filters or register a new plot.</p>
        <button mat-stroked-button color="primary" class="rounded-pill mt-2" (click)="filterStatus('ALL')">Clear Filters</button>
      </div>
    </div>
  `,
  styles: [`
    .plot-card { cursor: pointer; transition: all 0.3s ease; }
    .plot-card:hover { transform: translateY(-5px); box-shadow: 0 12px 20px rgba(0,0,0,0.1) !important; }
    .plot-img { height: 200px; width: 100%; object-fit: cover; }
    .plot-img-container { height: 200px; }
    .status-overlay { position: absolute; top: 10px; right: 10px; }
    .small-icon { font-size: 16px; width: 16px; height: 16px; vertical-align: middle; }
    .tiny { font-size: 10px; }
  `]
})
export class PlotListComponent implements OnInit {
  plots = signal<Plot[]>([]);
  filteredPlots = signal<Plot[]>([]);
  isLoading = true;
  currentFilter = 'ALL';

  constructor(private plotService: PlotService) {}

  ngOnInit() {
    this.loadPlots();
  }

  loadPlots() {
    this.plotService.getMyPlots().subscribe({
      next: (plots) => {
        this.plots.set(plots);
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredPlots.set(
      this.plots().filter(p => 
        p.title.toLowerCase().includes(value) || 
        p.location.toLowerCase().includes(value)
      )
    );
  }

  filterStatus(status: string) {
    this.currentFilter = status;
    this.applyFilters();
  }

  applyFilters() {
    if (this.currentFilter === 'ALL') {
      this.filteredPlots.set(this.plots());
    } else {
      this.filteredPlots.set(this.plots().filter(p => p.status === this.currentFilter));
    }
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'MINTED': return 'bg-success';
      case 'APPROVED': return 'bg-primary';
      case 'REJECTED': return 'bg-danger';
      case 'PENDING_APPROVAL': return 'bg-warning text-dark';
      default: return 'bg-secondary';
    }
  }
}
