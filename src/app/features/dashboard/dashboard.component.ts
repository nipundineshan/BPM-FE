import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PlotService } from '../../core/services/plot.service';
import { Plot } from '../../core/models';
import { AppStateService } from '../../core/services/app-state.service';
import { Web3Service } from '../../core/services/web3.service';
import { UserService } from '../../core/services/user.service';

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
    MatProgressBarModule,
    MatTooltipModule
  ],
  template: `
    <div class="dashboard-wrapper">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h1 class="h2 fw-bold tracking-tight mb-1">Portfolio Insights</h1>
          <p class="text-slate-500 mb-0">Overview of your tokenized property assets and blockchain activities.</p>
        </div>
        <button mat-flat-button color="primary" routerLink="/user/register-plot" class="rounded-pill px-4 shadow-sm">
          <mat-icon class="me-1">add_circle</mat-icon> Register Property
        </button>
      </div>

      <!-- Stats Grid -->
      <div class="row g-4 mb-5">
        <div class="col-md-4" *ngFor="let stat of getStats()">
          <mat-card class="stat-card-new border-0 h-100">
            <mat-card-content class="p-4">
              <div class="d-flex align-items-start justify-content-between mb-3">
                <div class="stat-icon-box" [style.background-color]="stat.color + '15'" [style.color]="stat.color">
                  <mat-icon>{{stat.icon}}</mat-icon>
                </div>
                <div class="trend-badge" [ngClass]="stat.trend > 0 ? 'trend-up' : 'trend-neutral'">
                  <mat-icon>{{stat.trend > 0 ? 'north_east' : 'remove'}}</mat-icon>
                  <span>{{stat.trend}}%</span>
                </div>
              </div>
              <div class="stat-value fs-1 fw-bold tracking-tight mb-1">{{stat.value}}</div>
              <div class="text-slate-500 small fw-medium uppercase letter-spacing-1">{{stat.label}}</div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <div class="row g-5">
        <!-- Main Content: Recent Plots -->
        <div class="col-lg-8">
          <div class="section-header d-flex justify-content-between align-items-center mb-4">
            <h3 class="h5 fw-bold mb-0">Recent Submissions</h3>
            <button mat-button color="primary" routerLink="/user/my-plots" class="fw-semibold">
              View Portfolio <mat-icon class="ms-1 tiny-icon">arrow_forward</mat-icon>
            </button>
          </div>
          
          <div *ngIf="isLoading" class="py-5">
            <mat-progress-bar mode="indeterminate" class="rounded-pill"></mat-progress-bar>
          </div>
          
          <div *ngIf="!isLoading && plots().length === 0" class="empty-state-box">
            <div class="empty-icon-wrapper">
              <mat-icon>add_location_alt</mat-icon>
            </div>
            <h4 class="fw-bold h5">No assets found</h4>
            <p class="text-slate-500">You haven't registered any property plots yet.</p>
            <button mat-stroked-button color="primary" routerLink="/user/register-plot" class="rounded-pill px-4">Get Started</button>
          </div>

          <div class="row g-4" *ngIf="!isLoading">
            <div class="col-md-6" *ngFor="let plot of plots().slice(0, 4)">
              <mat-card class="asset-card shadow-sm border-0 h-100 overflow-hidden" [routerLink]="['/user/plot-details', plot.id]">
                <div class="asset-img-container">
                  <img [src]="plot.imageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'" class="asset-img">
                  <div class="asset-status-chip" [ngClass]="'status-' + plot.status">
                    {{plot.status.replace('_', ' ')}}
                  </div>
                </div>
                <mat-card-content class="p-4">
                  <h4 class="h6 fw-bold mb-1 text-truncate">{{plot.title}}</h4>
                  <div class="d-flex align-items-center text-slate-500 small mb-3">
                    <mat-icon class="tiny-icon me-1">location_on</mat-icon> 
                    <span class="text-truncate">{{plot.location}}</span>
                  </div>
                  <div class="d-flex justify-content-between align-items-center pt-3 border-top">
                    <span class="fs-5 fw-bold text-indigo">{{plot.price | currency:'USD':'symbol':'1.0-0'}}</span>
                    <span class="text-slate-400 small">{{plot.areaSize}} sqft</span>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </div>

        <!-- Sidebar: Wallet & Activity -->
        <div class="col-lg-4">
          <!-- Wallet Card -->
          <mat-card class="wallet-card-new border-0 mb-5 overflow-hidden">
             <div class="wallet-accent"></div>
             <mat-card-content class="p-4">
                <div class="d-flex align-items-center justify-content-between mb-4">
                  <h3 class="h6 fw-bold mb-0">Blockchain Status</h3>
                  <div class="status-indicator" [class.active]="web3Service.walletAddress()"></div>
                </div>
                
                <div *ngIf="web3Service.walletAddress(); else notConnected" class="animate-fade-in">
                  <div class="d-flex align-items-center gap-3 mb-4">
                    <div class="wallet-icon-circle">
                      <mat-icon>account_balance_wallet</mat-icon>
                    </div>
                    <div>
                      <div class="text-slate-500 tiny fw-bold uppercase">MetaMask Connected</div>
                      <div class="fw-mono small text-truncate" style="max-width: 180px;">{{web3Service.walletAddress()}}</div>
                    </div>
                  </div>
                  <div class="network-pill">
                    <span class="dot"></span> Ethereum Sepolia
                  </div>
                </div>

                <ng-template #notConnected>
                  <div class="text-center py-3">
                    <p class="small text-slate-500 mb-4">Connect your Web3 wallet to interact with property NFTs.</p>
                    <button mat-flat-button color="primary" class="w-100 rounded-pill" (click)="web3Service.connectWallet()">
                      Connect Wallet
                    </button>
                  </div>
                </ng-template>
             </mat-card-content>
          </mat-card>

          <!-- Activity Timeline -->
          <div class="section-header mb-4">
            <h3 class="h6 fw-bold mb-0">Recent Activity</h3>
          </div>
          
          <mat-card class="timeline-card-new border-0">
            <mat-card-content class="p-0">
              <div class="timeline-v2">
                <div class="timeline-v2-item" *ngFor="let activity of activities">
                  <div class="timeline-v2-icon" [ngClass]="activity.type">
                    <mat-icon>{{activity.icon}}</mat-icon>
                  </div>
                  <div class="timeline-v2-content">
                    <div class="d-flex justify-content-between align-items-start mb-1">
                      <span class="fw-bold small text-primary-600">{{activity.title}}</span>
                      <span class="tiny text-slate-400">{{activity.time}}</span>
                    </div>
                    <p class="mb-0 tiny text-slate-500 lh-sm">{{activity.desc}}</p>
                  </div>
                </div>
                
                <div *ngIf="activities.length === 0" class="p-5 text-center text-slate-400">
                  <mat-icon class="mb-2">history_toggle_off</mat-icon>
                  <div class="small">No recent activity</div>
                </div>
              </div>
            </mat-card-content>
            <mat-card-actions class="p-3 border-top justify-content-center" *ngIf="activities.length > 0">
              <button mat-button class="tiny fw-bold text-slate-500">VIEW FULL HISTORY</button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-wrapper {
      animation: fadeIn 0.6s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .text-indigo { color: var(--primary-color); }

    /* Stat Cards */
    .stat-card-new {
      border-radius: 1.25rem !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .stat-card-new:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important;
    }
    .stat-icon-box {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .stat-icon-box mat-icon { font-size: 24px; width: 24px; height: 24px; }
    
    .trend-badge {
      display: flex;
      align-items: center;
      gap: 2px;
      padding: 2px 8px;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .trend-up { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .trend-neutral { background: rgba(100, 116, 139, 0.1); color: #64748b; }
    .trend-badge mat-icon { font-size: 14px; width: 14px; height: 14px; }

    /* Asset Cards */
    .asset-card {
      border-radius: 1.25rem !important;
      cursor: pointer;
    }
    .asset-img-container {
      position: relative;
      height: 180px;
      overflow: hidden;
    }
    .asset-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    .asset-card:hover .asset-img {
      transform: scale(1.05);
    }
    .asset-status-chip {
      position: absolute;
      top: 1rem;
      right: 1rem;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      backdrop-filter: blur(8px);
      background: rgba(255, 255, 255, 0.9);
      color: #0f172a;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }
    .status-PENDING_APPROVAL { color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); }
    .status-APPROVED { color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); }
    .status-MINTED { color: #6366f1; border: 1px solid rgba(99, 102, 241, 0.3); }

    /* Empty State */
    .empty-state-box {
      background: var(--bg-card);
      border: 2px dashed var(--border-color);
      border-radius: 1.5rem;
      padding: 4rem 2rem;
      text-align: center;
    }
    .empty-icon-wrapper {
      width: 80px;
      height: 80px;
      background: rgba(99, 102, 241, 0.05);
      color: var(--primary-color);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }
    .empty-icon-wrapper mat-icon { font-size: 40px; width: 40px; height: 40px; }

    /* Wallet Card */
    .wallet-card-new {
      border-radius: 1.25rem !important;
      position: relative;
    }
    .wallet-accent {
      position: absolute;
      top: 0; left: 0; right: 0; height: 4px;
      background: linear-gradient(90deg, #6366f1, #ec4899);
    }
    .status-indicator {
      width: 8px; height: 8px; border-radius: 50%;
      background: #94a3b8;
    }
    .status-indicator.active {
      background: #10b981;
      box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
    }
    .wallet-icon-circle {
      width: 44px; height: 44px;
      border-radius: 12px;
      background: var(--primary-color);
      color: white;
      display: flex; align-items: center; justify-content: center;
    }
    .network-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: rgba(0,0,0,0.03);
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .network-pill .dot { width: 6px; height: 6px; background: #6366f1; border-radius: 50%; }

    /* Timeline V2 */
    .timeline-card-new { border-radius: 1.25rem !important; }
    .timeline-v2 { padding: 1.5rem; }
    .timeline-v2-item {
      display: flex;
      gap: 1rem;
      padding-bottom: 1.5rem;
      position: relative;
    }
    .timeline-v2-item:not(:last-child)::after {
      content: '';
      position: absolute;
      left: 17px; top: 34px; bottom: 0;
      width: 1px;
      background: var(--border-color);
    }
    .timeline-v2-icon {
      width: 34px; height: 34px;
      border-radius: 10px;
      background: var(--bg-app);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      z-index: 1;
      border: 1px solid var(--border-color);
    }
    .timeline-v2-icon mat-icon { font-size: 16px; width: 16px; height: 16px; color: var(--text-secondary); }
    .timeline-v2-icon.success { background: rgba(16, 185, 129, 0.1); color: #10b981; border-color: rgba(16, 185, 129, 0.2); }
    .timeline-v2-icon.success mat-icon { color: #10b981; }
    .timeline-v2-icon.warning { background: rgba(245, 158, 11, 0.1); color: #f59e0b; border-color: rgba(245, 158, 11, 0.2); }
    .timeline-v2-icon.warning mat-icon { color: #f59e0b; }
  `]
})
export class DashboardComponent implements OnInit {
  private plotService = inject(PlotService);
  private userService = inject(UserService);
  public appState = inject(AppStateService);
  public web3Service = inject(Web3Service);

  plots = signal<Plot[]>([]);
  isLoading = true;
  activities: any[] = [];

  ngOnInit() {
    this.loadPlots();
    this.loadActivities();
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

  loadActivities() {
    this.userService.getRecentActivities().subscribe({
      next: (activities) => {
        this.activities = activities;
      },
      error: (err) => console.error('Error loading activities', err)
    });
  }

  getStats() {
    return [
      { label: 'Total Properties', value: this.plots().length, icon: 'location_city', color: '#6366f1', trend: 12 },
      { label: 'Verified NFTs', value: this.getMintedCount(), icon: 'verified', color: '#10b981', trend: 8 },
      { label: 'Pending Review', value: this.getPendingCount(), icon: 'hourglass_empty', color: '#f59e0b', trend: 0 }
    ];
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
