import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

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
  stats = [
    { label: 'Total Users', value: '1,248', icon: 'people', color: '#3f51b5' },
    { label: 'Pending Plots', value: '42', icon: 'pending_actions', color: '#ff9800' },
    { label: 'Approved Plots', value: '385', icon: 'check_circle', color: '#4caf50' },
    { label: 'Minted NFTs', value: '312', icon: 'token', color: '#e91e63' }
  ];

  // Bar Chart
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: { x: {}, y: { min: 0 } },
    plugins: { legend: { display: true } }
  };
  public barChartData: ChartData<'bar'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { data: [65, 59, 80, 81, 56, 55], label: 'Submitted' },
      { data: [28, 48, 40, 19, 86, 27], label: 'Approved' }
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
    labels: ['Residential', 'Commercial', 'Industrial', 'Land'],
    datasets: [{
      data: [300, 500, 100, 200],
      backgroundColor: ['#3f51b5', '#ff4081', '#4caf50', '#ffeb3b']
    }]
  };

  constructor() {}

  ngOnInit(): void {}
}
