import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { PlotService } from '../../../core/services/plot.service';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    BaseChartDirective
  ],
  template: `
    <div class="dashboard-container p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="display-5 fw-bold text-primary mb-0">System Overview</h1>
        <button mat-flat-button color="primary">
          <mat-icon>download</mat-icon> Generate System Report
        </button>
      </div>

      <!-- Stats Grid -->
      <div class="row g-4 mb-4">
        <div class="col-md-3" *ngFor="let stat of stats">
          <mat-card class="stat-card border-0 shadow-sm rounded-4 overflow-hidden h-100">
            <div class="stat-accent" [style.background-color]="stat.color"></div>
            <mat-card-content class="p-4 d-flex align-items-center">
              <div class="icon-box me-3" [style.background-color]="stat.color + '20'" [style.color]="stat.color">
                <mat-icon>{{stat.icon}}</mat-icon>
              </div>
              <div>
                <div class="text-muted text-uppercase small fw-bold">{{stat.label}}</div>
                <div class="fs-2 fw-bold">{{stat.value}}</div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <div class="row g-4">
        <!-- Main Activity Chart -->
        <div class="col-lg-8">
          <mat-card class="chart-card border-0 shadow-sm rounded-4 h-100">
            <mat-card-header class="p-4 border-bottom">
              <mat-card-title class="fw-bold">Global Platform Activity</mat-card-title>
              <mat-card-subtitle>User Signups vs Property Verifications</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content class="p-4">
              <div class="chart-wrapper">
                <canvas baseChart
                  [data]="lineChartData"
                  [options]="lineChartOptions"
                  [type]="'line'">
                </canvas>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Role Distribution -->
        <div class="col-lg-4">
          <mat-card class="chart-card border-0 shadow-sm rounded-4 h-100">
            <mat-card-header class="p-4 border-bottom">
              <mat-card-title class="fw-bold">User Role Distribution</mat-card-title>
            </mat-card-header>
            <mat-card-content class="p-4 d-flex flex-column align-items-center">
              <div class="chart-wrapper-pie mb-4">
                <canvas baseChart
                  [data]="pieChartData"
                  [options]="pieChartOptions"
                  [type]="'doughnut'">
                </canvas>
              </div>
              <div class="w-100" *ngIf="distributionData">
                <div class="d-flex justify-content-between mb-2 pb-2 border-bottom">
                  <span>Admins</span>
                  <span class="fw-bold">{{distributionData.admins}} Active</span>
                </div>
                <div class="d-flex justify-content-between mb-2 pb-2 border-bottom">
                  <span>Registered Users</span>
                  <span class="fw-bold">{{distributionData.users}} Total</span>
                </div>
                <div class="d-flex justify-content-between">
                  <span>Pending Approval</span>
                  <span class="fw-bold text-warning">{{distributionData.pending}} Requests</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mt-4">
        <h4 class="fw-bold mb-3">Administrative Controls</h4>
        <div class="row g-3">
          <div class="col-md-3">
            <button mat-stroked-button color="primary" class="w-100 py-3 rounded-3 h-100" routerLink="/super-admin/admins">
              <mat-icon class="mb-1 d-block mx-auto fs-1">person_add</mat-icon>
              Manage Admins
            </button>
          </div>
          <div class="col-md-3">
            <button mat-stroked-button color="accent" class="w-100 py-3 rounded-3 h-100" routerLink="/super-admin/audit-logs">
              <mat-icon class="mb-1 d-block mx-auto fs-1">history</mat-icon>
              View System Logs
            </button>
          </div>
          <div class="col-md-3">
            <button mat-stroked-button color="warn" class="w-100 py-3 rounded-3 h-100">
              <mat-icon class="mb-1 d-block mx-auto fs-1">settings</mat-icon>
              Global Settings
            </button>
          </div>
          <div class="col-md-3">
            <button mat-stroked-button color="primary" class="w-100 py-3 rounded-3 h-100">
              <mat-icon class="mb-1 d-block mx-auto fs-1">shield</mat-icon>
              Security Audit
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      background: #f8fafc;
      min-height: calc(100vh - 64px);
    }
    .stat-card {
      position: relative;
      transition: transform 0.3s ease;
    }
    .stat-card:hover {
      transform: translateY(-5px);
    }
    .stat-accent {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
    }
    .icon-box {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-box mat-icon {
      font-size: 30px;
      width: 30px;
      height: 30px;
    }
    .chart-wrapper {
      height: 350px;
    }
    .chart-wrapper-pie {
      height: 250px;
      width: 250px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: any[] = [
    { label: 'Total Users', value: '0', icon: 'people', color: '#6366f1' },
    { label: 'Active Admins', value: '0', icon: 'admin_panel_settings', color: '#10b981' },
    { label: 'Pending Plots', value: '0', icon: 'pending_actions', color: '#f59e0b' },
    { label: 'NFTs Minted', value: '0', icon: 'token', color: '#ec4899' }
  ];

  distributionData: any = null;

  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Signups',
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        data: [],
        label: 'Verifications',
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
      x: { grid: { display: false } }
    }
  };

  public pieChartData: ChartData<'doughnut'> = {
    labels: ['Admins', 'Users', 'Pending'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#10b981', '#6366f1', '#f59e0b'],
      hoverOffset: 4
    }]
  };

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    }
  };

  constructor(private plotService: PlotService) {}

  ngOnInit(): void {
    this.loadGlobalStats();
  }

  loadGlobalStats() {
    this.plotService.getGlobalStats().subscribe({
      next: (data) => {
        if (data.overview) {
          this.stats = [
            { label: 'Total Users', value: data.overview.totalUsers, icon: 'people', color: '#6366f1' },
            { label: 'Active Admins', value: data.overview.activeAdmins, icon: 'admin_panel_settings', color: '#10b981' },
            { label: 'Pending Plots', value: data.overview.pendingPlots, icon: 'pending_actions', color: '#f59e0b' },
            { label: 'NFTs Minted', value: data.overview.mintedNfts, icon: 'token', color: '#ec4899' }
          ];
        }

        if (data.activityChart) {
          this.lineChartData = {
            labels: data.activityChart.labels,
            datasets: [
              { ...this.lineChartData.datasets[0], data: data.activityChart.signups },
              { ...this.lineChartData.datasets[1], data: data.activityChart.verifications }
            ]
          };
        }

        if (data.distribution) {
          this.distributionData = data.distribution;
          this.pieChartData = {
            labels: ['Admins', 'Users', 'Pending'],
            datasets: [{
              ...this.pieChartData.datasets[0],
              data: [data.distribution.admins, data.distribution.users, data.distribution.pending]
            }]
          };
        }
      },
      error: (err: any) => console.error('Error fetching global stats', err)
    });
  }
}
