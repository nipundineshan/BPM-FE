import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { PlotService } from '../../../core/services/plot.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    BaseChartDirective
  ],
  template: `
    <div class="dashboard-wrapper animate-fade-in">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-end mb-5">
        <div class="animate-slide-in">
          <h1 class="h1 fw-black tracking-tighter mb-1 text-gradient">Admin Intelligence</h1>
          <p class="text-secondary fw-medium opacity-75 mb-0">Platform health, governance workflows, and network metrics.</p>
        </div>
        <div class="d-flex gap-3">
          <button mat-stroked-button color="primary" class="glass-btn-outline">
            <mat-icon class="me-2">cloud_download</mat-icon> SYSTEM EXPORT
          </button>
          <button mat-flat-button color="primary" class="pulse-primary" routerLink="/admin/plot-approvals">
            <mat-icon class="me-2">verified_user</mat-icon> PROTOCOL QUEUE
          </button>
        </div>
      </div>
      
      <!-- Stats Row -->
      <div class="row g-4 mb-5">
        <div class="col-md-3" *ngFor="let stat of stats; let i = index">
          <mat-card class="admin-stat-glass animate-fade-in" [style.animation-delay]="i * 0.1 + 's'">
            <mat-card-content class="p-4">
              <div class="d-flex align-items-center gap-3 mb-3">
                <div class="stat-icon-wrapper-glass" [style.background]="stat.color">
                  <mat-icon class="text-white">{{stat.icon}}</mat-icon>
                </div>
                <div class="text-muted tiny fw-black text-uppercase tracking-widest">{{stat.label}}</div>
              </div>
              <div class="fs-1 fw-black tracking-tighter text-gradient">{{stat.value}}</div>
              <div class="mt-3 d-flex align-items-center gap-2">
                <div class="badge-glass bg-success-glass py-1">
                  <mat-icon class="tiny-icon">trending_up</mat-icon>
                  <span class="ms-1">+4%</span>
                </div>
                <span class="tiny text-muted fw-bold opacity-50">SYNCED</span>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="row g-4">
        <div class="col-lg-8">
          <mat-card class="glass-chart-panel animate-slide-in-up">
            <mat-card-header class="p-4 border-bottom glass-border">
              <mat-card-title class="fw-black fs-6 tracking-tight">Protocol Activity</mat-card-title>
              <mat-card-subtitle class="text-primary tiny uppercase fw-black tracking-widest opacity-75">Global Submission Throughput</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content class="p-4">
              <div class="chart-container-large">
                <canvas baseChart
                  [data]="barChartData"
                  [options]="barChartOptions"
                  [type]="'bar'">
                </canvas>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
        
        <div class="col-md-4">
          <mat-card class="glass-chart-panel animate-slide-in-up h-100" style="animation-delay: 0.2s">
            <mat-card-header class="p-4 border-bottom glass-border">
              <mat-card-title class="fw-black fs-6 tracking-tight">Asset Distribution</mat-card-title>
              <mat-card-subtitle class="text-primary tiny uppercase fw-black tracking-widest opacity-75">Classification by Nodes</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content class="p-4">
              <div class="chart-container-side">
                <canvas baseChart
                  [data]="pieChartData"
                  [options]="pieChartOptions"
                  [type]="'pie'">
                </canvas>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Quick Actions Grid -->
      <div class="mt-5 pt-4">
        <h4 class="h6 fw-black mb-4 uppercase text-primary letter-spacing-2 opacity-75">Governance Console</h4>
        <div class="row g-4">
          <div class="col-md-3">
            <button class="glass-action-tile w-100" routerLink="/admin/user-approvals">
              <div class="action-icon-box bg-primary-glass">
                <mat-icon>person_add_alt</mat-icon>
              </div>
              <div class="text-start">
                <div class="fw-black small tracking-tight">User Validation</div>
                <div class="tiny text-muted fw-bold">14 ENCRYPTION PENDING</div>
              </div>
            </button>
          </div>
          <div class="col-md-3">
            <button class="glass-action-tile w-100" routerLink="/admin/plot-approvals">
              <div class="action-icon-box bg-warning-glass">
                <mat-icon>security</mat-icon>
              </div>
              <div class="text-start">
                <div class="fw-black small tracking-tight">Asset Audit</div>
                <div class="tiny text-muted fw-bold">5 REVIEWS PENDING</div>
              </div>
            </button>
          </div>
          <div class="col-md-3">
            <button class="glass-action-tile w-100" routerLink="/admin/nft-minting">
              <div class="action-icon-box bg-success-glass">
                <mat-icon>token</mat-icon>
              </div>
              <div class="text-start">
                <div class="fw-black small tracking-tight">Minting Protocol</div>
                <div class="tiny text-muted fw-bold">BLOCKCHAIN ENGINE</div>
              </div>
            </button>
          </div>
          <div class="col-md-3">
            <button class="glass-action-tile w-100" routerLink="/admin/users">
              <div class="action-icon-box bg-danger-glass">
                <mat-icon>hub</mat-icon>
              </div>
              <div class="text-start">
                <div class="fw-black small tracking-tight">Directory Hub</div>
                <div class="tiny text-muted fw-bold">NODE EXPLORER</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
    .animate-slide-in { animation: slideIn 0.8s ease-out forwards; }
    .animate-slide-in-up { animation: slideInUp 0.8s ease-out forwards; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    .text-gradient {
      background: var(--gradient-1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* Stat Cards */
    .admin-stat-glass {
      border-radius: 2rem !important;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .admin-stat-glass:hover { 
      transform: translateY(-10px) scale(1.02);
      border-color: var(--primary-color) !important;
    }
    
    .stat-icon-wrapper-glass {
      width: 48px; height: 48px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }
    .stat-icon-wrapper-glass mat-icon { font-size: 24px; width: 24px; height: 24px; }

    /* Chart Panels */
    .glass-chart-panel { 
      border-radius: 2rem !important;
    }
    .chart-container-large { height: 350px; }
    .chart-container-side { height: 300px; padding: 1rem; }
    .glass-border { border-color: var(--glass-border) !important; }

    /* Action Tiles */
    .glass-action-tile {
      display: flex; align-items: center; gap: 1.25rem;
      padding: 1.5rem; border-radius: 1.5rem;
      background: rgba(255,255,255,0.03); 
      border: 1px solid var(--glass-border);
      backdrop-filter: blur(10px);
      color: var(--text-primary);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      
      &:hover {
        background: rgba(255,255,255,0.08);
        border-color: var(--primary-color);
        transform: translateY(-5px) scale(1.02);
        box-shadow: 0 15px 30px rgba(0,0,0,0.2);
      }
    }

    .action-icon-box {
      width: 52px; height: 52px; border-radius: 16px;
      display: flex; align-items: center; justify-content: center;
      
      mat-icon { font-size: 24px; width: 24px; height: 24px; }
    }
    
    .glass-btn-outline {
      border: 1px solid var(--glass-border) !important;
      background: transparent !important;
      border-radius: 12px !important;
      padding: 8px 24px !important;
      font-weight: 800 !important;
      letter-spacing: 0.1em !important;
      font-size: 0.75rem !important;
      
      &:hover {
        background: rgba(255,255,255,0.05) !important;
        border-color: var(--primary-color) !important;
      }
    }

    .tiny-icon { font-size: 14px; width: 14px; height: 14px; }
    .letter-spacing-2 { letter-spacing: 0.2em; }
    .tracking-widest { letter-spacing: 0.15em; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private plotService = inject(PlotService);

  stats: any[] = [
    { label: 'Total Users', value: '0', icon: 'people', color: '#6366f1' },
    { label: 'Pending Queue', value: '0', icon: 'pending_actions', color: '#f59e0b' },
    { label: 'Verified Plots', value: '0', icon: 'verified_user', color: '#10b981' },
    { label: 'NFT Assets', value: '0', icon: 'auto_awesome', color: '#ec4899' }
  ];

  // Bar Chart
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { 
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } }, 
      y: { min: 0, grid: { color: 'rgba(148, 163, 184, 0.1)' }, ticks: { color: '#94a3b8' } } 
    },
    plugins: { legend: { display: false } }
  };
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Submitted', backgroundColor: '#6366f1', borderRadius: 6 },
      { data: [], label: 'Approved', backgroundColor: '#10b981', borderRadius: 6 }
    ]
  };

  // Pie Chart
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20, font: { size: 11, family: 'Inter' }, color: '#94a3b8' } },
    }
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
      borderWidth: 0
    }]
  };

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    this.plotService.getStats().subscribe({
      next: (data) => {
        if (data.overview) {
          this.stats = [
            { label: 'Total Users', value: data.overview.totalUsers.toLocaleString(), icon: 'people', color: '#6366f1' },
            { label: 'Pending Queue', value: data.overview.pendingPlots.toLocaleString(), icon: 'pending_actions', color: '#f59e0b' },
            { label: 'Verified Plots', value: data.overview.approvedPlots.toLocaleString(), icon: 'verified_user', color: '#10b981' },
            { label: 'NFT Assets', value: data.overview.mintedNfts.toLocaleString(), icon: 'auto_awesome', color: '#ec4899' }
          ];
        }
        
        if (data.chartData) {
          this.barChartData = {
            labels: data.chartData.labels,
            datasets: [
              { ...this.barChartData.datasets[0], data: data.chartData.submitted },
              { ...this.barChartData.datasets[1], data: data.chartData.approved }
            ]
          };
        }

        if (data.distribution) {
          this.pieChartData = {
            labels: data.distribution.labels,
            datasets: [{
              ...this.pieChartData.datasets[0],
              data: data.distribution.values
            }]
          };
        }
      },
      error: (err: any) => console.error('Error fetching admin stats', err)
    });
  }
}
