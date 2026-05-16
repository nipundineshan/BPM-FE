import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PlotService } from '../../core/services/plot.service';
import { Plot } from '../../core/models';
import { AppStateService } from '../../core/services/app-state.service';
import { Web3Service } from '../../core/services/web3.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressBarModule
  ],
  template: `
    <div class="dashboard-container p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="mb-1 fw-bold text-dark">Welcome back, {{appState.currentUser()?.fullName}}!</h2>
          <p class="text-muted">Here's what's happening with your property portfolio.</p>
        </div>
        <button mat-raised-button color="primary" routerLink="/user/register-plot" class="rounded-pill px-4">
          <mat-icon>add</mat-icon> Register New Plot
        </button>
      </div>

      <!-- User Stats -->
      <div class="row g-4 mb-5">
        <div class="col-md-4">
          <mat-card class="stat-card border-0 shadow-sm bg-gradient-primary text-white overflow-hidden">
            <mat-card-content class="p-4">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <div class="text-white-50 small fw-bold text-uppercase">Total Properties</div>
                  <div class="fs-1 fw-bold">{{plots().length}}</div>
                </div>
                <mat-icon class="stat-icon-large">location_city</mat-icon>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
        <div class="col-md-4">
          <mat-card class="stat-card border-0 shadow-sm bg-gradient-success text-white overflow-hidden">
            <mat-card-content class="p-4">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <div class="text-white-50 small fw-bold text-uppercase">Verified (NFTs)</div>
                  <div class="fs-1 fw-bold">{{getMintedCount()}}</div>
                </div>
                <mat-icon class="stat-icon-large">verified</mat-icon>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
        <div class="col-md-4">
          <mat-card class="stat-card border-0 shadow-sm bg-gradient-warning text-white overflow-hidden">
            <mat-card-content class="p-4">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <div class="text-white-50 small fw-bold text-uppercase">Pending Approval</div>
                  <div class="fs-1 fw-bold">{{getPendingCount()}}</div>
                </div>
                <mat-icon class="stat-icon-large">hourglass_empty</mat-icon>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <div class="row g-4">
        <!-- Recent Plots -->
        <div class="col-lg-8">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="mb-0 fw-bold">My Recent Submissions</h4>
            <button mat-button color="primary" routerLink="/user/my-plots">See all</button>
          </div>
          
          <div *ngIf="isLoading" class="py-5 text-center">
            <mat-progress-bar mode="indeterminate"></mat-progress-bar>
          </div>
          
          <div *ngIf="!isLoading && plots().length === 0" class="empty-state text-center py-5 bg-white rounded-4 shadow-sm">
            <mat-icon class="text-muted display-1">maps_home_work</mat-icon>
            <h5 class="mt-3 fw-bold">No properties registered yet</h5>
            <p class="text-muted">Start by registering your first property plot for verification.</p>
            <button mat-flat-button color="primary" routerLink="/user/register-plot" class="rounded-pill">Register First Plot</button>
          </div>

          <div class="row g-4">
            <div class="col-md-6" *ngFor="let plot of plots().slice(0, 4)">
              <mat-card class="plot-item-card h-100 shadow-sm border-0 rounded-4 overflow-hidden" [routerLink]="['/user/plot-details', plot.id]">
                <div class="img-wrapper">
                  <img mat-card-image [src]="plot.imageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'" alt="Plot Image" class="plot-img">
                  <div class="status-overlay">
                    <span class="badge rounded-pill" [ngClass]="getStatusClass(plot.status)">
                      {{plot.status}}
                    </span>
                  </div>
                </div>
                <mat-card-content class="p-3">
                  <h6 class="mb-1 fw-bold text-truncate">{{plot.title}}</h6>
                  <div class="d-flex align-items-center text-muted small">
                    <mat-icon class="small-icon me-1">location_on</mat-icon> 
                    <span class="text-truncate">{{plot.location}}</span>
                  </div>
                  <div class="mt-2 pt-2 border-top d-flex justify-content-between">
                    <span class="fw-bold text-primary">{{plot.price | currency}}</span>
                    <span class="text-muted small">{{plot.areaSize}} sqft</span>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </div>

        <!-- Activity & Wallet -->
        <div class="col-lg-4">
          <h4 class="mb-3 fw-bold">Blockchain & Activity</h4>
          <mat-card class="blockchain-card shadow-sm border-0 mb-4 rounded-4">
             <mat-card-content class="p-4 text-center">
                <div *ngIf="web3Service.walletAddress(); else notConnected">
                  <div class="wallet-icon-box bg-success-subtle text-success mx-auto mb-3">
                    <mat-icon>account_balance_wallet</mat-icon>
                  </div>
                  <div class="fw-bold">Wallet Connected</div>
                  <code class="small text-muted text-truncate d-block mt-1">{{web3Service.walletAddress()}}</code>
                </div>
                <ng-template #notConnected>
                  <div class="wallet-icon-box bg-warning-subtle text-warning mx-auto mb-3">
                    <mat-icon>account_balance_wallet</mat-icon>
                  </div>
                  <div class="fw-bold">Wallet Not Connected</div>
                  <p class="small text-muted mt-1">Connect your MetaMask wallet to interact with blockchain features.</p>
                  <button mat-flat-button color="primary" class="mt-2 rounded-pill w-100" (click)="web3Service.connectWallet()">Connect Wallet</button>
                </ng-template>
             </mat-card-content>
          </mat-card>

          <mat-card class="timeline-card shadow-sm border-0 rounded-4">
            <mat-card-header class="p-3 border-bottom">
              <mat-card-title class="fs-6 fw-bold mb-0">Recent Activity</mat-card-title>
            </mat-card-header>
            <mat-card-content class="p-3">
              <div class="timeline">
                <div class="timeline-item pb-3" *ngFor="let activity of activities">
                  <div class="timeline-icon" [ngClass]="activity.type">
                    <mat-icon>{{activity.icon}}</mat-icon>
                  </div>
                  <div class="timeline-content ms-4">
                    <div class="fw-bold small">{{activity.title}}</div>
                    <div class="text-muted tiny">{{activity.time}}</div>
                    <p class="mb-0 mt-1 small text-muted">{{activity.desc}}</p>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { background: #f8fafc; min-height: calc(100vh - 64px); }
    .bg-gradient-primary { background: linear-gradient(45deg, #1a237e, #3f51b5); }
    .bg-gradient-success { background: linear-gradient(45deg, #10b981, #34d399); }
    .bg-gradient-warning { background: linear-gradient(45deg, #f59e0b, #fbbf24); }
    
    .stat-card { border-radius: 20px; border: none; }
    .stat-icon-large { font-size: 48px; width: 48px; height: 48px; opacity: 0.25; }
    
    .plot-item-card { cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .plot-item-card:hover { transform: translateY(-5px); box-shadow: 0 12px 20px rgba(0,0,0,0.08) !important; }
    
    .img-wrapper { position: relative; height: 160px; }
    .plot-img { width: 100%; height: 100%; object-fit: cover; }
    .status-overlay { position: absolute; top: 12px; right: 12px; }
    
    .small-icon { font-size: 16px; width: 16px; height: 16px; }
    
    .wallet-icon-box { 
      width: 64px; height: 64px; border-radius: 20px; 
      display: flex; align-items: center; justify-content: center; 
    }
    .wallet-icon-box mat-icon { font-size: 32px; width: 32px; height: 32px; }

    .timeline { position: relative; }
    .timeline::before { 
      content: ''; position: absolute; left: 7px; top: 10px; 
      bottom: 0; width: 2px; background: #e2e8f0; 
    }
    .timeline-item { position: relative; }
    .timeline-icon { 
      position: absolute; left: 0; width: 16px; height: 16px; 
      border-radius: 50%; background: white; border: 2px solid #3f51b5; 
      z-index: 1; display: flex; align-items: center; justify-content: center;
    }
    .timeline-icon mat-icon { font-size: 10px; width: 10px; height: 10px; color: #3f51b5; }
    .timeline-icon.success { border-color: #10b981; }
    .timeline-icon.success mat-icon { color: #10b981; }
    .timeline-icon.warning { border-color: #f59e0b; }
    .timeline-icon.warning mat-icon { color: #f59e0b; }
    
    .tiny { font-size: 11px; }
  `]
})
export class DashboardComponent implements OnInit {
  plots = signal<Plot[]>([]);
  isLoading = true;
  
  activities = [
    { title: 'NFT Minted', time: '2 hours ago', desc: 'Your plot "North Hill Villa" has been successfully minted.', icon: 'token', type: 'success' },
    { title: 'Plot Approved', time: 'Yesterday', desc: 'Admin approved your property documentation for "Studio Apt".', icon: 'check_circle', type: 'success' },
    { title: 'Registration Pending', time: '3 days ago', desc: 'Property "Silicon Valley Office" is awaiting admin verification.', icon: 'hourglass_empty', type: 'warning' }
  ];

  constructor(
    private plotService: PlotService,
    public appState: AppStateService,
    public web3Service: Web3Service
  ) {}

  ngOnInit() {
    this.loadPlots();
  }

  loadPlots() {
    this.plotService.getMyPlots().subscribe({
      next: (plots) => {
        this.plots.set(plots);
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  getMintedCount() {
    return this.plots().filter(p => p.status === 'MINTED' || p.isMinted).length;
  }

  getPendingCount() {
    return this.plots().filter(p => p.status === 'PENDING_APPROVAL').length;
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
