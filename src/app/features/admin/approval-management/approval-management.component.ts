import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PlotService } from '../../../core/services/plot.service';
import { NftService } from '../../../core/services/nft.service';
import { Plot } from '../../../core/models';

@Component({
  selector: 'app-approval-management',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  template: `
    <div class="approval-wrapper animate-fade-in">
      <div class="mb-5 d-flex justify-content-between align-items-center px-3">
        <div>
          <h1 class="h2 fw-bold tracking-tight mb-1 text-primary">Asset Verification</h1>
          <p class="text-slate-500 mb-0">System-wide review queue for property tokenization requests.</p>
        </div>
        <div class="d-flex gap-3">
          <div class="status-indicator-group d-flex gap-4 p-3 bg-white dark:bg-slate-900 rounded-4 border dark:border-slate-800 shadow-sm">
             <div class="data-point">
                <div class="label uppercase">Pending</div>
                <div class="val fw-bold d-flex align-items-center gap-2 text-slate-900 dark:text-white">
                  {{ pendingPlots.length }} <span class="count-badge warning">ACT</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <mat-tab-group class="custom-tabs">
        <!-- PENDING TAB -->
        <mat-tab label="Awaiting Review">
          <div class="tab-content py-4 px-3">
            <div *ngIf="pendingPlots.length === 0" class="empty-state-v2 dark:bg-slate-900 dark:border-slate-800">
               <div class="empty-icon-circle bg-slate-50 dark:bg-slate-800">
                  <mat-icon class="text-slate-300">fact_check</mat-icon>
               </div>
               <h4 class="fw-bold text-slate-900 dark:text-white">Review Queue Clear</h4>
               <p class="text-slate-500">No new property plots are currently awaiting verification.</p>
            </div>

            <div class="row g-4">
              <div class="col-md-6 col-xl-4" *ngFor="let plot of pendingPlots">
                <mat-card class="verification-card-premium border-0 shadow-sm overflow-hidden h-100 dark:bg-slate-900 dark:border dark:border-slate-800">
                  <div class="image-box h-48">
                    <img [src]="plot.propertyImages[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400'">
                  </div>
                  <mat-card-content class="p-4">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                      <h3 class="h6 fw-bold mb-0 text-slate-900 dark:text-white">{{ plot.plotName }}</h3>
                      <span class="badge bg-warning">PENDING</span>
                    </div>
                    
                    <div class="d-flex align-items-center text-slate-400 small mb-4">
                      <mat-icon class="tiny-icon me-1">location_on</mat-icon> {{ plot.address }}
                    </div>

                    <div class="d-flex gap-2 pt-3 border-top dark:border-slate-800">
                      <button mat-flat-button color="primary" class="flex-grow-1 rounded-pill" (click)="approvePlot(plot)">
                        APPROVE
                      </button>
                      <button mat-stroked-button color="warn" class="flex-grow-1 rounded-pill" (click)="rejectPlot(plot)">
                        REJECT
                      </button>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- APPROVED TAB -->
        <mat-tab label="Verified Assets">
          <div class="tab-content py-4 px-3">
            <div class="row g-3">
              <div class="col-12" *ngFor="let plot of approvedPlots">
                <mat-card class="verified-asset-row border-0 shadow-sm dark:bg-slate-900 dark:border dark:border-slate-800">
                  <mat-card-content class="p-3 d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center gap-3">
                      <div class="mini-thumb">
                        <img [src]="plot.propertyImages[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400'">
                      </div>
                      <div>
                        <div class="fw-bold text-slate-900 dark:text-white">{{ plot.plotName }}</div>
                        <div class="tiny text-slate-500">{{ plot.address }}</div>
                      </div>
                    </div>

                    <div class="d-flex align-items-center gap-4">
                      <div class="text-end d-none d-md-block">
                        <div class="tiny text-slate-400 uppercase fw-bold">Current Value</div>
                        <div class="small fw-bold text-indigo">{{ plot.marketValue | currency }}</div>
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
          <div class="tab-content py-4 px-3">
            <div class="row g-3">
              <div class="col-12" *ngFor="let plot of rejectedPlots">
                <mat-card class="rejected-card border-0 border-start border-danger border-4 shadow-sm dark:bg-slate-900">
                  <mat-card-content class="p-4 d-flex justify-content-between align-items-center">
                    <div>
                      <h5 class="fw-bold text-slate-900 dark:text-white mb-1">{{ plot.plotName }}</h5>
                      <div class="text-danger small fw-medium mb-2">
                        <mat-icon class="tiny-icon align-middle">error_outline</mat-icon> {{ plot.rejectionReason }}
                      </div>
                      <div class="tiny text-slate-400">Processed on {{ plot.createdAt | date }}</div>
                    </div>
                    <button mat-stroked-button class="rounded-pill tiny fw-bold text-slate-700 dark:text-slate-300" (click)="viewDetails(plot)">RE-EXAMINE</button>
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
    .verification-card-premium { border-radius: 1.25rem !important; background: var(--bg-card); }
    .image-box { overflow: hidden; background: #000; }
    .image-box img { width: 100%; height: 100%; object-fit: cover; opacity: 0.9; }

    .data-point .label { font-size: 10px; font-weight: 700; color: var(--text-muted); letter-spacing: 0.05em; margin-bottom: 2px; }
    .data-point .val { font-size: 0.9rem; }

    /* Verified Asset Row */
    .verified-asset-row { border-radius: 1rem !important; background: var(--bg-card); }
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

    .rejected-card { border-radius: 0.75rem !important; background: var(--bg-card); }
    .tiny-icon { font-size: 14px; width: 14px; height: 14px; }
    .small-icon { font-size: 18px; width: 18px; height: 18px; }
    .text-indigo { color: var(--primary-color); }
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
        this.snackBar.open(`Plot "${plot.plotName}" approved successfully!`, 'Close', { duration: 3000 });
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
          this.snackBar.open(`Plot "${plot.plotName}" rejected.`, 'Close', { duration: 3000 });
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
    this.snackBar.open(`Initiating NFT Minting for ${plot.plotName}...`, 'Close', { duration: 2000 });
    
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
