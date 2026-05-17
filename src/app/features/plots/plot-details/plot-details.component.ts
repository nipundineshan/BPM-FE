import { Component, OnInit, signal } from '@angular/core';
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
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex align-items-center">
          <button mat-icon-button (click)="goBack()" class="me-2">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <div>
            <h2 class="mb-0 fw-bold">{{ plot()?.title }}</h2>
            <div class="text-muted small">ID: {{ plot()?.id }}</div>
          </div>
        </div>
        <div class="d-flex gap-2">
          <mat-chip-set>
            <mat-chip [ngClass]="'status-' + plot()?.status" selected>
              {{ plot()?.status | uppercase }}
            </mat-chip>
          </mat-chip-set>
        </div>
      </div>

      <div class="row g-4">
        <!-- Left Column: Image and Description -->
        <div class="col-lg-8">
          <mat-card class="shadow-sm border-0 mb-4 overflow-hidden">
            <img
              [src]="plot()?.imageUrl"
              class="property-hero-img"
              alt="Property Image"
            />
            <mat-card-content class="p-4">
              <div class="d-flex align-items-center mb-4">
                <mat-icon class="text-danger me-2">location_on</mat-icon>
                <span class="fs-5 text-muted"
                  >{{ plot()?.location }}, {{ plot()?.district }}</span
                >
              </div>

              <h5 class="fw-bold mb-3">Property Overview</h5>
              <p class="text-secondary lh-lg">{{ plot()?.description }}</p>

              <mat-divider class="my-4"></mat-divider>

              <div class="row g-3">
                <div class="col-md-4">
                  <div class="p-3 bg-light rounded-3 text-center">
                    <div class="text-muted small text-uppercase fw-bold mb-1">
                      Market Price
                    </div>
                    <div class="fs-4 fw-bold text-primary">
                      {{ plot()?.price | currency }}
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="p-3 bg-light rounded-3 text-center">
                    <div class="text-muted small text-uppercase fw-bold mb-1">
                      Total Area
                    </div>
                    <div class="fs-4 fw-bold">
                      {{ plot()?.areaSize }} <small>sqft</small>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="p-3 bg-light rounded-3 text-center">
                    <div class="text-muted small text-uppercase fw-bold mb-1">
                      Coordinates
                    </div>
                    <div class="small fw-bold">
                      {{ plot()?.latitude }}, {{ plot()?.longitude }}
                    </div>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Documents Section -->
          <mat-card class="shadow-sm border-0">
            <mat-card-header>
              <mat-card-title>Legal Documents</mat-card-title>
            </mat-card-header>
            <mat-card-content class="p-4">
              <div class="d-flex flex-wrap gap-3">
                <div
                  class="doc-item p-3 border rounded-3 d-flex align-items-center"
                  *ngFor="let doc of plot()?.documents"
                >
                  <mat-icon class="text-primary me-2">description</mat-icon>
                  <div>
                    <div class="small fw-bold text-truncate" style="max-width: 150px;">{{ doc.split('/').pop() }}</div>
                    <div class="tiny text-muted">Document Attachment</div>
                  </div>
                  <a [href]="doc" target="_blank" mat-icon-button color="primary" class="ms-3">
                    <mat-icon>download</mat-icon>
                  </a>
                </div>
                <div *ngIf="!plot()?.documents?.length" class="text-muted small">
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
            class="shadow-sm border-0 mb-4"
            [class.border-top-primary]="plot()?.status === 'PENDING_APPROVAL'"
          >
            <mat-card-header class="bg-light p-3">
              <mat-card-title class="m-0 fs-6 fw-bold"
                >Verification Status</mat-card-title
              >
            </mat-card-header>
            <mat-card-content class="p-4">
              <!-- Pending State -->
              <div
                *ngIf="plot()?.status === 'PENDING_APPROVAL'"
                class="text-center"
              >
                <mat-icon class="display-4 text-warning mb-3"
                  >hourglass_empty</mat-icon
                >
                <h5>Under Review</h5>
                <p class="small text-muted">
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
                  >
                    Approve & Upload IPFS
                  </button>
                  <button
                    mat-stroked-button
                    color="warn"
                    (click)="rejectPlot()"
                  >
                    Reject Submission
                  </button>
                </div>
              </div>

              <!-- Approved State -->
              <div *ngIf="plot()?.status === 'APPROVED'" class="text-center">
                <mat-icon class="display-4 text-success mb-3"
                  >verified</mat-icon
                >
                <h5>Approved</h5>
                <p class="small text-muted">
                  Verification complete. Ready for NFT minting.
                </p>

                <div class="alert alert-info py-2 small text-start">
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
                  >
                    Connect Wallet to Mint
                  </button>
                  <button
                    *ngIf="web3Service.walletAddress()"
                    mat-raised-button
                    color="accent"
                    (click)="mintNft()"
                    [disabled]="isMintLoading"
                  >
                    <mat-icon>token</mat-icon> Mint NFT Now
                  </button>
                </div>
              </div>

              <!-- Minted State -->
              <div *ngIf="plot()?.status === 'MINTED'" class="text-center">
                <mat-icon class="display-4 text-primary mb-3">token</mat-icon>
                <h5 class="text-primary fw-bold">NFT Minted</h5>
                <mat-divider class="my-3"></mat-divider>
                <div class="text-start">
                  <div class="mb-3">
                    <label class="tiny text-muted text-uppercase fw-bold"
                      >Token ID</label
                    >
                    <div class="fw-bold">#{{ plot()?.tokenId }}</div>
                  </div>
                  <div class="mb-3">
                    <label class="tiny text-muted text-uppercase fw-bold"
                      >Transaction Hash</label
                    >
                    <div class="small text-truncate">
                      <a
                        [href]="
                          'https://sepolia.etherscan.io/tx/' +
                          plot()?.transactionHash
                        "
                        target="_blank"
                        class="text-decoration-none"
                      >
                        {{ plot()?.transactionHash }}
                      </a>
                    </div>
                  </div>
                  <div>
                    <label class="tiny text-muted text-uppercase fw-bold"
                      >Metadata</label
                    >
                    <div class="small">
                      <a
                        [href]="'https://ipfs.io/ipfs/' + plot()?.ipfsHash"
                        target="_blank"
                        class="text-decoration-none"
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
          <mat-card class="shadow-sm border-0">
            <mat-card-content class="p-4">
              <h6 class="fw-bold mb-3">Property Owner</h6>
              <div class="d-flex align-items-center">
                <div
                  class="avatar-md bg-light rounded-circle d-flex align-items-center justify-content-center me-3"
                >
                  <mat-icon class="text-secondary">person</mat-icon>
                </div>
                <div>
                  <div class="fw-bold">
                    {{
                      plot()?.ownerId === authService.currentUser()?.id
                        ? 'You'
                        : 'Registered Owner'
                    }}
                  </div>
                  <div class="small text-muted">{{ plot()?.ownerId }}</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>

    <div *ngIf="isLoading" class="text-center py-5">
      <mat-spinner class="mx-auto"></mat-spinner>
      <p class="mt-3 text-muted">Loading property records...</p>
    </div>
  `,
  styles: [
    `
      .property-hero-img {
        width: 100%;
        height: 400px;
        object-fit: cover;
      }
      .doc-item {
        background: #f8f9fa;
        min-width: 200px;
      }
      .avatar-md {
        width: 48px;
        height: 48px;
      }
      .status-PENDING_APPROVAL {
        background: #fff3e0;
        color: #ef6c00;
      }
      .status-APPROVED {
        background: #e8f5e9;
        color: #2e7d32;
      }
      .status-MINTED {
        background: #e3f2fd;
        color: #1565c0;
      }
      .status-REJECTED {
        background: #ffebee;
        color: #c62828;
      }
      .border-top-primary {
        border-top: 4px solid #3f51b5 !important;
      }
      .tiny {
        font-size: 10px;
      }
    `,
  ],
})
export class PlotDetailsComponent implements OnInit {
  plot = signal<Plot | null>(null);
  isLoading = true;
  isMintLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private plotService: PlotService,
    private nftService: NftService,
    private snackBar: MatSnackBar,
    public web3Service: Web3Service,
    public authService: AuthService,
  ) {}

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
    this.router.navigate(['/plots']);
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
      this.snackBar.open('Plot rejected.', 'Close', { duration: 3000 });
      this.plot.update((p) => (p ? { ...p, status: 'REJECTED' } : null));
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
