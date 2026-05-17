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
        <div>
          <h1 class="h2 fw-bold tracking-tight mb-1">Administrative Insights</h1>
          <p class="text-slate-500 mb-0">Monitor platform health, user activity, and verification workflows.</p>
        </div>
        <div class="d-flex gap-2">
          <button mat-stroked-button color="primary" class="rounded-pill">
            <mat-icon class="me-1">download</mat-icon> Export Report
          </button>
          <button mat-flat-button color="primary" class="rounded-pill shadow-sm" routerLink="/admin/plot-approvals">
            <mat-icon class="me-1">task_alt</mat-icon> Review Queue
          </button>
        </div>
      </div>
      
      <!-- Stats Row -->
      <div class="row g-4 mb-5">
        <div class="col-md-3" *ngFor="let stat of stats">
          <mat-card class="stat-card-premium border-0 h-100">
            <mat-card-content class="p-4">
              <div class="d-flex align-items-center gap-3 mb-3">
                <div class="stat-icon-wrapper-new" [style.background-color]="stat.color + '15'" [style.color]="stat.color">
                  <mat-icon>{{stat.icon}}</mat-icon>
                </div>
                <div class="text-muted small fw-bold text-uppercase letter-spacing-1">{{stat.label}}</div>
              </div>
              <div class="fs-2 fw-bold tracking-tight">{{stat.value}}</div>
              <div class="mt-2 text-success small d-flex align-items-center gap-1">
                <mat-icon class="tiny-icon">trending_up</mat-icon> <span>+4% from last week</span>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="row g-4">
        <div class="col-lg-8">
          <mat-card class="chart-card-premium shadow-sm border-0">
            <mat-card-header class="p-4 border-bottom">
              <mat-card-title class="fw-bold fs-6">Verification Activity</mat-card-title>
              <mat-card-subtitle class="text-slate-400 tiny uppercase fw-bold">Daily processing volume</mat-card-subtitle>
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
          <mat-card class="chart-card-premium shadow-sm border-0 h-100">
            <mat-card-header class="p-4 border-bottom">
              <mat-card-title class="fw-bold fs-6">Asset Distribution</mat-card-title>
              <mat-card-subtitle class="text-slate-400 tiny uppercase fw-bold">By property category</mat-card-subtitle>
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
        <h4 class="h6 fw-bold mb-4 uppercase text-slate-500 letter-spacing-1">Management Console</h4>
        <div class="row g-3">
          <div class="col-md-3">
            <button class="action-btn-premium w-100" routerLink="/admin/user-approvals">
              <div class="action-icon bg-indigo-subtle text-indigo">
                <mat-icon>person_add_alt</mat-icon>
              </div>
              <div class="text-start">
                <div class="fw-bold small">User Registrations</div>
                <div class="tiny text-slate-500">14 pending approvals</div>
              </div>
            </button>
          </div>
          <div class="col-md-3">
            <button class="action-btn-premium w-100" routerLink="/admin/plot-approvals">
              <div class="action-icon bg-amber-subtle text-amber">
                <mat-icon>gavel</mat-icon>
              </div>
              <div class="text-start">
                <div class="fw-bold small">Asset Verification</div>
                <div class="tiny text-slate-500">5 plots to review</div>
              </div>
            </button>
          </div>
          <div class="col-md-3">
            <button class="action-btn-premium w-100" routerLink="/admin/nft-minting">
              <div class="action-icon bg-pink-subtle text-pink">
                <mat-icon>auto_awesome</mat-icon>
              </div>
              <div class="text-start">
                <div class="fw-bold small">NFT Minting</div>
                <div class="tiny text-slate-500">Blockchain engine</div>
              </div>
            </button>
          </div>
          <div class="col-md-3">
            <button class="action-btn-premium w-100" routerLink="/admin/users">
              <div class="action-icon bg-slate-subtle text-slate">
                <mat-icon>people_outline</mat-icon>
              </div>
              <div class="text-start">
                <div class="fw-bold small">System Directory</div>
                <div class="tiny text-slate-500">All registered users</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    /* Stat Cards */
    .stat-card-premium {
      border-radius: 1.25rem !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .stat-card-premium:hover { transform: translateY(-4px); box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important; }
    
    .stat-icon-wrapper-new {
      width: 44px; height: 44px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
    }
    .stat-icon-wrapper-new mat-icon { font-size: 24px; width: 24px; height: 24px; }

    /* Chart Cards */
    .chart-card-premium { border-radius: 1.25rem !important; }
    .chart-container-large { height: 350px; }
    .chart-container-side { height: 300px; padding: 1rem; }

    /* Action Buttons */
    .action-btn-premium {
      display: flex; align-items: center; gap: 1rem;
      padding: 1.25rem; border-radius: 1rem;
      background: var(--bg-card); border: 1px solid var(--border-color);
      transition: all 0.2s;
    }
    .action-btn-premium:hover {
      background: var(--bg-app); border-color: var(--primary-color);
      transform: scale(1.02);
    }
    .action-icon {
      width: 48px; height: 48px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
    }
    
    .bg-indigo-subtle { background: rgba(99, 102, 241, 0.1); }
    .text-indigo { color: #6366f1; }
    .bg-amber-subtle { background: rgba(245, 158, 11, 0.1); }
    .text-amber { color: #f59e0b; }
    .bg-pink-subtle { background: rgba(236, 72, 153, 0.1); }
    .text-pink { color: #ec4899; }
    .bg-slate-subtle { background: rgba(100, 116, 139, 0.1); }
    .text-slate { color: #64748b; }
    
    .tiny-icon { font-size: 14px; width: 14px; height: 14px; }
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
    scales: { x: { grid: { display: false } }, y: { min: 0, grid: { color: '#f1f5f9' } } },
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
      legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20, font: { size: 11, family: 'Inter' } } },
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
      error: (err) => console.error('Error fetching admin stats', err)
    });
  }
}
