import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PlotService } from '../../../core/services/plot.service';
import { Plot } from '../../../core/models';
import { Web3Service } from '../../../core/services/web3.service';
import { NftService } from '../../../core/services/nft.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-plot-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="container py-4" *ngIf="plot()">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4 px-3">
        <div class="d-flex align-items-center">
          <button mat-icon-button (click)="goBack()" class="me-2 dark:text-white">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <div>
            <h2 class="mb-0 fw-bold text-slate-900 dark:text-white">{{ plot()?.plotName }}</h2>
            <div class="text-slate-400 small">ID: {{ plot()?.id }}</div>
          </div>
        </div>
        <div class="d-flex gap-2">
          <mat-chip-set>
            <mat-chip [ngClass]="'status-' + plot()?.status" selected class="fw-bold">
              {{ plot()?.status?.replace('_', ' ') | uppercase }}
            </mat-chip>
          </mat-chip-set>
        </div>
      </div>

      <div class="row g-4 px-3">
        <!-- Left Column: Image and Description -->
        <div class="col-lg-8">
          <mat-card class="shadow-sm border-0 mb-4 overflow-hidden dark:bg-slate-900 dark:border dark:border-slate-800">
            <img
              [src]="plot()?.propertyImages?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200'"
              class="property-hero-img"
              alt="Property Image"
            />
            <mat-card-content class="p-4">
              <div class="d-flex align-items-center mb-4">
                <mat-icon class="text-primary-500 me-2">location_on</mat-icon>
                <span class="fs-5 text-slate-500 dark:text-slate-400"
                  >{{ plot()?.address }}, {{ plot()?.district }}</span
                >
              </div>

              <h5 class="fw-bold mb-3 text-slate-900 dark:text-white">Property Overview</h5>
              <p class="text-slate-600 dark:text-slate-400 lh-lg">{{ plot()?.description }}</p>

              <mat-divider class="my-4 dark:border-slate-800"></mat-divider>

              <div class="row g-3">
                <div class="col-md-4">
                  <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-3 text-center">
                    <div class="text-slate-400 small text-uppercase fw-bold mb-1">
                      Market Value
                    </div>
                    <div class="fs-4 fw-bold text-primary-500">
                      {{ plot()?.marketValue | currency }}
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-3 text-center">
                    <div class="text-slate-400 small text-uppercase fw-bold mb-1">
                      Total Area
                    </div>
                    <div class="fs-4 fw-bold text-slate-700 dark:text-slate-300">
                      {{ plot()?.areaSize }}
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-3 text-center">
                    <div class="text-slate-400 small text-uppercase fw-bold mb-1">
                      Coordinates
                    </div>
                    <div class="small fw-bold text-slate-700 dark:text-slate-300">
                      {{ plot()?.latitude }}, {{ plot()?.longitude }}
                    </div>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Documents Section -->
          <mat-card class="shadow-sm border-0 dark:bg-slate-900 dark:border dark:border-slate-800">
            <mat-card-header class="border-bottom dark:border-slate-800">
              <mat-card-title class="fs-6 fw-bold text-slate-900 dark:text-white">Legal Documents</mat-card-title>
            </mat-card-header>
            <mat-card-content class="p-4">
              <div class="d-flex flex-wrap gap-3">
                <div
                  class="doc-item p-3 border rounded-3 d-flex align-items-center dark:border-slate-800 dark:bg-slate-800/30"
                  *ngFor="let doc of plot()?.legalDocuments"
                >
                  <mat-icon class="text-primary-500 me-2">description</mat-icon>
                  <div>
                    <div class="small fw-bold text-truncate text-slate-700 dark:text-slate-300" style="max-width: 150px;">{{ doc.split('/').pop() }}</div>
                    <div class="tiny text-slate-400">Document Attachment</div>
                  </div>
                  <a [href]="doc" target="_blank" mat-icon-button color="primary" class="ms-3">
                    <mat-icon>download</mat-icon>
                  </a>
                </div>
                <div *ngIf="!plot()?.legalDocuments?.length" class="text-slate-400 small">
                   No documents attached to this property.
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Right Column: Workflow and Blockchain -->
        <div class="col-lg-4">
          <!-- Admin/Verification Card -->
          <mat-card
            class="shadow-sm border-0 mb-4 dark:bg-slate-900 dark:border dark:border-slate-800"
            [class.border-top-primary]="plot()?.status === 'PENDING_APPROVAL'"
          >
            <mat-card-header class="bg-slate-50 dark:bg-slate-800/50 p-3 border-bottom dark:border-slate-800">
              <mat-card-title class="m-0 fs-6 fw-bold text-slate-900 dark:text-white"
                >Verification Status</mat-card-title
              >
            </mat-card-header>
            <mat-card-content class="p-4">
              <!-- Pending State -->
              <div
                *ngIf="plot()?.status === 'PENDING_APPROVAL'"
                class="text-center"
              >
                <mat-icon class="display-4 text-warning-500 mb-3"
                  >hourglass_empty</mat-icon
                >
                <h5 class="text-slate-900 dark:text-white">Under Review</h5>
                <p class="small text-slate-500">
                  Your property is currently being verified by our
                  administrators.
                </p>

                <div
                  *ngIf="authService.currentUser()?.role === 'ADMIN'"
                  class="d-grid gap-2 mt-4"
                >
                  <button
                    mat-raised-button
                    color="primary"
                    (click)="uploadToIpfs()"
                    class="rounded-pill"
                  >
                    Approve & Upload IPFS
                  </button>
                  <button
                    mat-stroked-button
                    color="warn"
                    (click)="rejectPlot()"
                    class="rounded-pill"
                  >
                    Reject Submission
                  </button>
                </div>
              </div>

              <!-- Approved State -->
              <div *ngIf="plot()?.status === 'APPROVED'" class="text-center">
                <mat-icon class="display-4 text-success-500 mb-3"
                  >verified</mat-icon
                >
                <h5 class="text-slate-900 dark:text-white">Approved</h5>
                <p class="small text-slate-500">
                  Verification complete. Ready for NFT minting.
                </p>

                <div class="alert alert-info py-2 small text-start border-0 bg-primary-100/30 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300">
                  <strong>IPFS Hash:</strong><br />
                  <span class="text-break">{{ plot()?.ipfsHash }}</span>
                </div>

                <div
                  *ngIf="authService.currentUser()?.role === 'ADMIN'"
                  class="d-grid gap-2 mt-4"
                >
                  <button
                    *ngIf="!web3Service.walletAddress()"
                    mat-raised-button
                    color="accent"
                    (click)="connectWallet()"
                    class="rounded-pill"
                  >
                    Connect Wallet to Mint
                  </button>
                  <button
                    *ngIf="web3Service.walletAddress()"
                    mat-raised-button
                    color="accent"
                    (click)="mintNft()"
                    [disabled]="isMintLoading"
                    class="rounded-pill"
                  >
                    <mat-icon>token</mat-icon> Mint NFT Now
                  </button>
                </div>
              </div>

              <!-- Minted State -->
              <div *ngIf="plot()?.status === 'MINTED'" class="text-center">
                <mat-icon class="display-4 text-primary-500 mb-3">token</mat-icon>
                <h5 class="text-primary-500 fw-bold">NFT Minted</h5>
                <mat-divider class="my-3 dark:border-slate-800"></mat-divider>
                <div class="text-start">
                  <div class="mb-3">
                    <label class="tiny text-slate-400 text-uppercase fw-bold"
                      >Token ID</label
                    >
                    <div class="fw-bold text-slate-700 dark:text-slate-200">#{{ plot()?.tokenId }}</div>
                  </div>
                  <div class="mb-3">
                    <label class="tiny text-slate-400 text-uppercase fw-bold"
                      >Transaction Hash</label
                    >
                    <div class="small text-truncate">
                      <a
                        [href]="
                          'https://sepolia.etherscan.io/tx/' +
                          plot()?.transactionHash
                        "
                        target="_blank"
                        class="text-primary-500 text-decoration-none hover:underline"
                      >
                        {{ plot()?.transactionHash }}
                      </a>
                    </div>
                  </div>
                  <div>
                    <label class="tiny text-slate-400 text-uppercase fw-bold"
                      >Metadata</label
                    >
                    <div class="small">
                      <a
                        [href]="'https://ipfs.io/ipfs/' + plot()?.ipfsHash"
                        target="_blank"
                        class="text-primary-500 text-decoration-none hover:underline"
                      >
                        View IPFS JSON
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Owner Details -->
          <mat-card class="shadow-sm border-0 dark:bg-slate-900 dark:border dark:border-slate-800">
            <mat-card-content class="p-4">
              <h6 class="fw-bold mb-3 text-slate-900 dark:text-white">Property Owner</h6>
              <div class="d-flex align-items-center">
                <div
                  class="avatar-md bg-slate-50 dark:bg-slate-800 rounded-circle d-flex align-items-center justify-content-center me-3"
                >
                  <mat-icon class="text-slate-400">person</mat-icon>
                </div>
                <div>
                  <div class="fw-bold text-slate-700 dark:text-slate-200">
                    {{
                      plot()?.ownerId === authService.currentUser()?.id
                        ? 'You'
                        : 'Registered Owner'
                    }}
                  </div>
                  <div class="small text-slate-400 text-truncate" style="max-width: 150px;">{{ plot()?.ownerId }}</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>

    <div *ngIf="isLoading" class="text-center py-5">
      <mat-spinner class="mx-auto"></mat-spinner>
      <p class="mt-3 text-slate-400">Loading property records...</p>
    </div>
  `,
  styles: [
    `
      .property-hero-img {
        width: 100%;
        height: 400px;
        object-fit: cover;
      }
      .avatar-md {
        width: 48px;
        height: 48px;
      }
      .status-PENDING_APPROVAL {
        background: rgba(245, 158, 11, 0.1);
        color: #f59e0b;
      }
      .status-APPROVED {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
      }
      .status-MINTED {
        background: rgba(99, 102, 241, 0.1);
        color: #6366f1;
      }
      .status-REJECTED {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
      }
      .border-top-primary {
        border-top: 4px solid var(--primary-color) !important;
      }
      .tiny {
        font-size: 10px;
      }
      .text-primary-500 { color: var(--primary-color); }
      .text-success-500 { color: var(--success-color); }
      .text-warning-500 { color: var(--warning-color); }
    `,
  ],
})
export class PlotDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private plotService = inject(PlotService);
  private nftService = inject(NftService);
  private snackBar = inject(MatSnackBar);
  public web3Service = inject(Web3Service);
  public authService = inject(AuthService);

  plot = signal<Plot | null>(null);
  isLoading = true;
  isMintLoading = false;

  ngOnInit() {
    this.loadPlot();
  }

  loadPlot() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isLoading = true;
      this.plotService.getPlotById(id).subscribe({
        next: (plot) => {
          this.plot.set(plot);
          this.isLoading = false;
        },
        error: () => (this.isLoading = false),
      });
    }
  }

  goBack() {
    const role = this.authService.currentUser()?.role?.toLowerCase();
    if (role === 'admin' || role === 'super_admin') {
      this.router.navigate(['/admin/plot-approvals']);
    } else {
      this.router.navigate(['/user/my-plots']);
    }
  }

  uploadToIpfs() {
    const p = this.plot();
    if (!p) return;

    this.snackBar.open('Approving and uploading to IPFS...', 'Close', {
      duration: 2000,
    });
    this.plotService.uploadToIpfs(p.id).subscribe({
      next: (res) => {
        this.plot.set({ ...p, status: 'APPROVED', ipfsHash: res.ipfsHash });
        this.snackBar.open('Plot approved and metadata uploaded!', 'Success', {
          duration: 3000,
        });
      },
      error: () =>
        this.snackBar.open('Action failed', 'Close', { duration: 3000 }),
    });
  }

  rejectPlot() {
    const reason = prompt('Reason for rejection:');
    if (reason) {
      this.plotService.rejectPlot(this.plot()!.id, reason).subscribe({
        next: () => {
          this.snackBar.open('Plot rejected.', 'Close', { duration: 3000 });
          this.plot.update((p) => (p ? { ...p, status: 'REJECTED' } : null));
        },
        error: () => this.snackBar.open('Rejection failed', 'Close', { duration: 3000 })
      });
    }
  }

  async connectWallet() {
    await this.web3Service.connectWallet();
  }

  mintNft() {
    const p = this.plot();
    if (!p) return;

    this.isMintLoading = true;
    this.nftService.mintNft(p.id).subscribe({
      next: (res) => {
        this.plot.set({
          ...p,
          status: 'MINTED',
          isMinted: true,
          tokenId: res.tokenId,
          transactionHash: res.transactionHash,
        });
        this.isMintLoading = false;
        this.snackBar.open('NFT Minted Successfully!', 'Success', {
          duration: 3000,
        });
      },
      error: (err) => {
        this.isMintLoading = false;
        this.snackBar.open('Minting failed', 'Close', { duration: 3000 });
      },
    });
  }
}
