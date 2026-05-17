import { Component, OnInit } from '@angular/core';
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
    <div class="dashboard-content">
      <h2 class="mb-4 fw-bold">Admin Insights</h2>
      
      <!-- Stats Row -->
      <div class="row g-4 mb-4">
        <div class="col-md-3" *ngFor="let stat of stats">
          <mat-card class="stat-card shadow-sm border-0">
            <mat-card-content class="p-4 d-flex align-items-center">
              <div class="stat-icon-wrapper me-3" [ngStyle]="{'background-color': stat.color}">
                <mat-icon>{{stat.icon}}</mat-icon>
              </div>
              <div>
                <div class="text-muted small fw-bold text-uppercase">{{stat.label}}</div>
                <div class="fs-2 fw-bold">{{stat.value}}</div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="row g-4">
        <div class="col-md-8">
          <mat-card class="chart-card shadow-sm border-0">
            <mat-card-header>
              <mat-card-title>Plot Verification Activity</mat-card-title>
            </mat-card-header>
            <mat-card-content class="p-4">
              <div style="display: block;">
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
          <mat-card class="chart-card shadow-sm border-0">
            <mat-card-header>
              <mat-card-title>Property Distribution</mat-card-title>
            </mat-card-header>
            <mat-card-content class="p-4">
              <div style="display: block;">
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

      <!-- Quick Actions -->
      <div class="mt-5">
        <h4 class="mb-3">Quick Actions</h4>
        <div class="d-flex gap-3">
          <button mat-flat-button color="primary" routerLink="/admin/approvals">
            <mat-icon>verified_user</mat-icon> Review Pending Plots
          </button>
          <button mat-flat-button color="accent" routerLink="/admin/users">
            <mat-icon>people</mat-icon> Manage Users
          </button>
          <button mat-stroked-button color="warn">
            <mat-icon>description</mat-icon> Export Monthly Report
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      border-radius: 12px;
      transition: transform 0.2s;
    }
    .stat-card:hover {
      transform: translateY(-5px);
    }
    .stat-icon-wrapper {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .stat-icon-wrapper mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    .chart-card {
      border-radius: 12px;
    }
    mat-card-title {
      font-size: 1.1rem;
      font-weight: 600;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats: any[] = [
    { label: 'Total Users', value: '0', icon: 'people', color: '#3f51b5' },
    { label: 'Pending Plots', value: '0', icon: 'pending_actions', color: '#ff9800' },
    { label: 'Approved Plots', value: '0', icon: 'check_circle', color: '#4caf50' },
    { label: 'Minted NFTs', value: '0', icon: 'token', color: '#e91e63' }
  ];

  // Bar Chart
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: { x: {}, y: { min: 0 } },
    plugins: { legend: { display: true } }
  };
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Submitted' },
      { data: [], label: 'Approved' }
    ]
  };

  // Pie Chart
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    }
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#3f51b5', '#ff4081', '#4caf50', '#ffeb3b']
    }]
  };

  constructor(private plotService: PlotService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    this.plotService.getStats().subscribe({
      next: (data) => {
        if (data.overview) {
          this.stats = [
            { label: 'Total Users', value: data.overview.totalUsers, icon: 'people', color: '#3f51b5' },
            { label: 'Pending Plots', value: data.overview.pendingPlots, icon: 'pending_actions', color: '#ff9800' },
            { label: 'Approved Plots', value: data.overview.approvedPlots, icon: 'check_circle', color: '#4caf50' },
            { label: 'Minted NFTs', value: data.overview.mintedNfts, icon: 'token', color: '#e91e63' }
          ];
        }
        
        if (data.chartData) {
          this.barChartData = {
            labels: data.chartData.labels,
            datasets: [
              { data: data.chartData.submitted, label: 'Submitted' },
              { data: data.chartData.approved, label: 'Approved' }
            ]
          };
        }

        if (data.distribution) {
          this.pieChartData = {
            labels: data.distribution.labels,
            datasets: [{
              data: data.distribution.values,
              backgroundColor: ['#3f51b5', '#ff4081', '#4caf50', '#ffeb3b']
            }]
          };
        }
      },
      error: (err) => console.error('Error fetching admin stats', err)
    });
  }
}
