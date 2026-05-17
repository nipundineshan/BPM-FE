import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Plot, PlotStatus } from '../../../core/models';
import { PlotService } from '../../../core/services/plot.service';
import { NftService } from '../../../core/services/nft.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-approval-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="approval-container">
      <h2 class="mb-4 fw-bold">Plot Approval Management</h2>

      <mat-tab-group animationDuration="0ms">
        <mat-tab label="Pending Approval ({{ pendingPlots.length }})">
          <div class="plot-list py-4">
            <div *ngIf="pendingPlots.length === 0" class="text-center py-5">
              <mat-icon class="large-icon text-muted">fact_check</mat-icon>
              <p class="text-muted mt-2">No pending plots to review.</p>
            </div>

            <mat-card
              *ngFor="let plot of pendingPlots"
              class="mb-3 plot-card shadow-sm border-0"
            >
              <div class="row g-0">
                <div class="col-md-3">
                  <img
                    [src]="plot.imageUrl || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=400'"
                    class="img-fluid rounded-start h-100"
                    style="object-fit: cover;"
                    alt="Plot Image"
                  />
                </div>
                <div class="col-md-9">
                  <mat-card-content class="p-4">
                    <div
                      class="d-flex justify-content-between align-items-start"
                    >
                      <div>
                        <h4 class="mb-1 fw-bold">{{ plot.title }}</h4>
                        <p class="text-muted small">
                          <mat-icon class="align-middle me-1 small-icon"
                            >location_on</mat-icon
                          >{{ plot.location }}, {{ plot.district }}
                        </p>
                      </div>
                      <mat-chip-set>
                        <mat-chip class="bg-warning text-dark"
                          >PENDING</mat-chip
                        >
                      </mat-chip-set>
                    </div>

                    <div class="row mt-3">
                      <div class="col-sm-4">
                        <div class="small text-muted">Price</div>
                        <div class="fw-bold">{{ plot.price | currency }}</div>
                      </div>
                      <div class="col-sm-4">
                        <div class="small text-muted">Area Size</div>
                        <div class="fw-bold">{{ plot.areaSize }} sqft</div>
                      </div>
                      <div class="col-sm-4">
                        <div class="small text-muted">Submitted on</div>
                        <div class="fw-bold">{{ plot.createdAt | date }}</div>
                      </div>
                    </div>

                    <div class="d-flex justify-content-end mt-4">
                      <button
                        mat-stroked-button
                        color="primary"
                        class="me-2"
                        (click)="viewDetails(plot)"
                      >
                        <mat-icon>visibility</mat-icon> View Details
                      </button>
                      <button
                        mat-flat-button
                        color="primary"
                        class="me-2"
                        (click)="approvePlot(plot)"
                      >
                        <mat-icon>check</mat-icon> Approve
                      </button>
                      <button
                        mat-flat-button
                        color="warn"
                        (click)="rejectPlot(plot)"
                      >
                        <mat-icon>close</mat-icon> Reject
                      </button>
                    </div>
                  </mat-card-content>
                </div>
              </div>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="Approved Plots">
          <div class="plot-list py-4">
            <mat-card
              *ngFor="let plot of approvedPlots"
              class="mb-3 plot-card shadow-sm border-0"
            >
              <mat-card-content class="p-4">
                <div class="d-flex justify-content-between align-items-center">
                  <div class="d-flex align-items-center">
                    <img
                      [src]="plot.imageUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400'"
                      class="rounded me-3"
                      style="width: 60px; height: 60px; object-fit: cover;"
                    />
                    <div>
                      <h5 class="mb-0 fw-bold">{{ plot.title }}</h5>
                      <p class="text-muted small mb-0">{{ plot.location }}</p>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-3">
                    <mat-chip-set>
                      <mat-chip color="primary" selected>{{
                        plot.status | uppercase
                      }}</mat-chip>
                    </mat-chip-set>
                    <button
                      *ngIf="plot.status === 'APPROVED'"
                      mat-raised-button
                      color="accent"
                      (click)="mintNft(plot)"
                      [disabled]="isMinting === plot.id"
                    >
                      <mat-icon>token</mat-icon> 
                      {{ isMinting === plot.id ? 'Minting...' : 'Mint NFT' }}
                    </button>
                    <span
                      *ngIf="plot.status === 'MINTED'"
                      class="text-success small fw-bold"
                    >
                      <mat-icon class="align-middle">verified</mat-icon> NFT
                      MINTED
                    </span>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="Rejected Plots">
          <div class="plot-list py-4">
            <mat-card
              *ngFor="let plot of rejectedPlots"
              class="mb-3 border-start border-danger border-4 shadow-sm"
            >
              <mat-card-content class="p-4">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 class="mb-1 fw-bold text-danger">{{ plot.title }}</h5>
                    <p class="mb-2">
                      <strong>Reason:</strong> {{ plot.rejectionReason }}
                    </p>
                    <p class="small text-muted mb-0">
                      Rejected on {{ plot.createdAt | date }}
                    </p>
                  </div>
                  <button mat-button color="primary" (click)="viewDetails(plot)">Review Details</button>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .approval-container {
        padding: 10px;
      }
      .plot-card {
        border-radius: 12px;
        overflow: hidden;
      }
      .large-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
      }
      .small-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
    `,
  ],
})
export class ApprovalManagementComponent implements OnInit {
  private plotService = inject(PlotService);
  private nftService = inject(NftService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  plots: Plot[] = [];
  isMinting: string | null = null;

  constructor() {}

  ngOnInit(): void {
    this.loadPlots();
  }

  loadPlots() {
    this.plotService.getAllPlots().subscribe({
      next: (plots) => this.plots = plots || [],
      error: (err) => console.error('Error loading plots', err)
    });
  }

  get pendingPlots() {
    return this.plots.filter((p) => p.status === 'PENDING_APPROVAL');
  }
  get approvedPlots() {
    return this.plots.filter(
      (p) => p.status === 'APPROVED' || p.status === 'MINTED',
    );
  }
  get rejectedPlots() {
    return this.plots.filter((p) => p.status === 'REJECTED');
  }

  approvePlot(plot: Plot) {
    this.plotService.approvePlot(plot.id).subscribe({
      next: (updated) => {
        plot.status = 'APPROVED';
        this.snackBar.open(`Plot "${plot.title}" approved successfully!`, 'Close', { duration: 3000 });
      },
      error: (err) => this.snackBar.open('Approval failed', 'Close', { duration: 3000 })
    });
  }

  rejectPlot(plot: Plot) {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      this.plotService.rejectPlot(plot.id, reason).subscribe({
        next: () => {
          plot.status = 'REJECTED';
          plot.rejectionReason = reason;
          this.snackBar.open(`Plot "${plot.title}" rejected.`, 'Close', { duration: 3000 });
        },
        error: () => this.snackBar.open('Rejection failed', 'Close', { duration: 3000 })
      });
    }
  }

  viewDetails(plot: Plot) {
    this.router.navigate(['/admin/plot-details', plot.id]);
  }

  mintNft(plot: Plot) {
    this.isMinting = plot.id;
    this.snackBar.open(`Initiating NFT Minting for ${plot.title}...`, 'Close', { duration: 2000 });
    
    this.nftService.mintNft(plot.id).subscribe({
      next: (res) => {
        plot.status = 'MINTED';
        plot.isMinted = true;
        plot.tokenId = res.tokenId;
        plot.transactionHash = res.transactionHash;
        this.isMinting = null;
        this.snackBar.open('NFT Minted Successfully!', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.isMinting = null;
        this.snackBar.open('Minting failed: ' + (err.error?.message || 'Check wallet connection'), 'Close', { duration: 3000 });
      }
    });
  }
}
