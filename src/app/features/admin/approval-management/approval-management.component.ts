import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatTooltipModule
  ],
  template: `
    <div class="approval-wrapper animate-fade-in">
      <div class="d-flex justify-content-between align-items-end mb-5">
        <div>
          <h1 class="h2 fw-bold tracking-tight mb-1">Property Verification</h1>
          <p class="text-slate-500 mb-0">Review and validate property documentation for blockchain tokenization.</p>
        </div>
      </div>

      <mat-tab-group class="custom-tabs" animationDuration="200ms">
        <!-- PENDING TAB -->
        <mat-tab>
          <ng-template mat-tab-label>
            <div class="d-flex align-items-center gap-2">
              <span>Pending Review</span>
              <span class="count-badge warning" *ngIf="pendingPlots.length">{{ pendingPlots.length }}</span>
            </div>
          </ng-template>

          <div class="tab-content py-4">
            <div *ngIf="pendingPlots.length === 0" class="empty-state-v2">
              <div class="empty-icon-circle bg-slate-50">
                <mat-icon class="text-slate-300">fact_check</mat-icon>
              </div>
              <h4 class="fw-bold h5">Clear Queue</h4>
              <p class="text-slate-400">All property submissions have been processed.</p>
            </div>

            <div class="row g-4">
              <div class="col-12" *ngFor="let plot of pendingPlots">
                <mat-card class="verification-card-premium border-0 overflow-hidden shadow-sm">
                  <div class="row g-0">
                    <div class="col-md-3">
                      <div class="image-box h-100">
                        <img [src]="plot.imageUrl || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=400'" alt="Property">
                      </div>
                    </div>
                    <div class="col-md-9">
                      <mat-card-content class="p-4 h-100 d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h3 class="h5 fw-bold mb-1">{{ plot.title }}</h3>
                            <div class="d-flex align-items-center text-slate-500 small">
                              <mat-icon class="tiny-icon me-1">location_on</mat-icon>
                              {{ plot.location }}, {{ plot.district }}
                            </div>
                          </div>
                          <span class="badge bg-warning">Awaiting Verification</span>
                        </div>

                        <div class="property-grid-small row g-3 mb-auto">
                          <div class="col-auto">
                            <div class="data-point">
                              <div class="label">PRICE</div>
                              <div class="val fw-bold">{{ plot.price | currency }}</div>
                            </div>
                          </div>
                          <div class="col-auto px-4">
                             <div class="data-point">
                              <div class="label">AREA</div>
                              <div class="val fw-bold">{{ plot.areaSize }} sqft</div>
                            </div>
                          </div>
                          <div class="col-auto">
                             <div class="data-point">
                              <div class="label">SUBMITTED</div>
                              <div class="val">{{ plot.createdAt | date:'mediumDate' }}</div>
                            </div>
                          </div>
                        </div>

                        <div class="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                          <button mat-button color="primary" class="fw-bold" (click)="viewDetails(plot)">
                            VIEW DOCUMENTS
                          </button>
                          <button mat-stroked-button color="warn" (click)="rejectPlot(plot)">
                            REJECT
                          </button>
                          <button mat-flat-button color="primary" class="px-4 shadow-sm" (click)="approvePlot(plot)">
                            APPROVE ASSET
                          </button>
                        </div>
                      </mat-card-content>
                    </div>
                  </div>
                </mat-card>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- APPROVED TAB -->
        <mat-tab label="Verified Assets">
          <div class="tab-content py-4">
            <div class="row g-3">
              <div class="col-12" *ngFor="let plot of approvedPlots">
                <mat-card class="verified-asset-row border-0 shadow-sm">
                  <mat-card-content class="p-3 d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center gap-3">
                      <div class="mini-thumb">
                        <img [src]="plot.imageUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400'">
                      </div>
                      <div>
                        <div class="fw-bold text-dark">{{ plot.title }}</div>
                        <div class="tiny text-slate-500">{{ plot.location }}</div>
                      </div>
                    </div>

                    <div class="d-flex align-items-center gap-4">
                      <div class="text-end d-none d-md-block">
                        <div class="tiny text-slate-400 uppercase fw-bold">Current Value</div>
                        <div class="small fw-bold text-indigo">{{ plot.price | currency }}</div>
                      </div>
                      
                      <div class="v-divider-small"></div>

                      <div class="status-box">
                         <span class="badge" [ngClass]="plot.status === 'MINTED' ? 'bg-success' : 'bg-primary'">
                            {{ plot.status.replace('_', ' ') }}
                         </span>
                      </div>

                      <div class="action-box" style="min-width: 140px; text-align: right;">
                        <button *ngIf="plot.status === 'APPROVED'" mat-flat-button color="accent" class="rounded-pill tiny fw-bold"
                          (click)="mintNft(plot)" [disabled]="isMinting === plot.id">
                          <mat-icon class="tiny-icon">token</mat-icon> MINT NFT
                        </button>
                        <span *ngIf="plot.status === 'MINTED'" class="text-success tiny fw-bold uppercase d-flex align-items-center gap-1">
                          <mat-icon class="small-icon">verified</mat-icon> SECURED ON-CHAIN
                        </span>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- REJECTED TAB -->
        <mat-tab label="Rejected Cases">
          <div class="tab-content py-4">
            <div class="row g-3">
              <div class="col-12" *ngFor="let plot of rejectedPlots">
                <mat-card class="rejected-card border-0 border-start border-danger border-4 shadow-sm">
                  <mat-card-content class="p-4 d-flex justify-content-between align-items-center">
                    <div>
                      <h5 class="fw-bold text-slate-900 mb-1">{{ plot.title }}</h5>
                      <div class="text-danger small fw-medium mb-2">
                        <mat-icon class="tiny-icon align-middle">error_outline</mat-icon> {{ plot.rejectionReason }}
                      </div>
                      <div class="tiny text-slate-400">Processed on {{ plot.createdAt | date }}</div>
                    </div>
                    <button mat-stroked-button class="rounded-pill tiny fw-bold" (click)="viewDetails(plot)">RE-EXAMINE</button>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .approval-wrapper { padding: 10px; }
    
    /* Tabs */
    .custom-tabs ::ng-deep .mat-mdc-tab-label-container { border-bottom: 1px solid var(--border-color); }
    .custom-tabs ::ng-deep .mat-mdc-tab .mdc-tab__text-label { font-family: 'Inter'; font-weight: 600; font-size: 0.875rem; color: var(--text-secondary); }
    .custom-tabs ::ng-deep .mat-mdc-tab.mdc-tab--active .mdc-tab__text-label { color: var(--primary-color); }

    .count-badge {
      font-size: 10px; padding: 2px 6px; border-radius: 6px; font-weight: 800;
    }
    .count-badge.warning { background: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2); }

    /* Verification Cards */
    .verification-card-premium { border-radius: 1.25rem !important; }
    .image-box { overflow: hidden; background: #000; }
    .image-box img { width: 100%; height: 100%; object-fit: cover; opacity: 0.9; }

    .data-point .label { font-size: 10px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.05em; margin-bottom: 2px; }
    .data-point .val { font-size: 0.9rem; color: var(--text-primary); }

    /* Verified Asset Row */
    .verified-asset-row { border-radius: 1rem !important; }
    .mini-thumb { width: 44px; height: 44px; border-radius: 10px; overflow: hidden; }
    .mini-thumb img { width: 100%; height: 100%; object-fit: cover; }

    .v-divider-small { width: 1px; height: 30px; background: var(--border-color); }

    /* Empty State */
    .empty-state-v2 {
      text-align: center; padding: 5rem 2rem; background: var(--bg-card); border-radius: 1.5rem;
    }
    .empty-icon-circle {
      width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;
    }
    .empty-icon-circle mat-icon { font-size: 40px; width: 40px; height: 40px; }

    .rejected-card { border-radius: 0.75rem !important; }
    .tiny-icon { font-size: 14px; width: 14px; height: 14px; }
    .small-icon { font-size: 18px; width: 18px; height: 18px; }
  `]
})
export class ApprovalManagementComponent implements OnInit {
  private plotService = inject(PlotService);
  private nftService = inject(NftService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  plots: Plot[] = [];
  isMinting: string | null = null;

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
      next: () => {
        plot.status = 'APPROVED';
        this.snackBar.open(`Plot "${plot.title}" approved successfully!`, 'Close', { duration: 3000 });
      },
      error: () => this.snackBar.open('Approval failed', 'Close', { duration: 3000 })
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
      error: (err: any) => {
        this.isMinting = null;
        this.snackBar.open('Minting failed: ' + (err.error?.message || 'Check wallet connection'), 'Close', { duration: 3000 });
      }
    });
  }
}
