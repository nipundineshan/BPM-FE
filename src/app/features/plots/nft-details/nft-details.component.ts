import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { Plot } from '../../../core/models';
import { PlotService } from '../../../core/services/plot.service';

@Component({
  selector: 'app-nft-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatChipsModule
  ],
  template: `
    <div class="container py-4" *ngIf="plot()">
      <div class="d-flex align-items-center mb-4">
        <button mat-icon-button routerLink="/admin/nfts" class="me-2">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h2 class="mb-0 fw-bold">NFT Asset Certificate</h2>
      </div>

      <div class="row g-4">
        <!-- NFT Visual Representation -->
        <div class="col-lg-5">
          <mat-card class="nft-card border-0 shadow-lg overflow-hidden">
            <div class="nft-image-container position-relative">
              <img [src]="plot()?.imageUrl" class="nft-image" alt="NFT Property">
              <div class="nft-badge">
                <mat-icon>verified</mat-icon> VERIFIED ASSET
              </div>
            </div>
            <mat-card-content class="p-4 text-center">
              <div class="nft-token-id mb-1">Token ID #{{plot()?.tokenId}}</div>
              <h3 class="fw-bold mb-0 text-primary">{{plot()?.title}}</h3>
              <p class="text-muted small mt-2">Minted on Ethereum Sepolia Testnet</p>
              
              <div class="qr-placeholder mt-4 p-3 border rounded-3 bg-light d-inline-block">
                <mat-icon class="display-1 text-muted">qr_code_2</mat-icon>
                <div class="tiny text-muted">Scan to verify on-chain</div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- On-Chain Metadata -->
        <div class="col-lg-7">
          <mat-card class="border-0 shadow-sm rounded-3 mb-4">
            <mat-card-header class="p-4 border-bottom">
              <mat-card-title class="m-0 fs-5 fw-bold">Blockchain Provenance</mat-card-title>
            </mat-card-header>
            <mat-card-content class="p-4">
              <mat-list>
                <mat-list-item>
                  <mat-icon matListItemIcon class="text-primary">token</mat-icon>
                  <div matListItemTitle class="small text-muted">Contract Address</div>
                  <div matListItemLine class="fw-bold text-truncate">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</div>
                </mat-list-item>
                <mat-divider inset></mat-divider>
                
                <mat-list-item>
                  <mat-icon matListItemIcon class="text-success">account_balance_wallet</mat-icon>
                  <div matListItemTitle class="small text-muted">Owner Wallet</div>
                  <div matListItemLine class="fw-bold text-truncate">{{plot()?.ownerId}}</div>
                </mat-list-item>
                <mat-divider inset></mat-divider>

                <mat-list-item>
                  <mat-icon matListItemIcon class="text-info">history</mat-icon>
                  <div matListItemTitle class="small text-muted">Transaction Hash</div>
                  <div matListItemLine class="fw-bold">
                    <a [href]="'https://sepolia.etherscan.io/tx/' + plot()?.transactionHash" target="_blank" class="text-decoration-none">
                      {{plot()?.transactionHash}} <mat-icon class="tiny-icon align-middle">open_in_new</mat-icon>
                    </a>
                  </div>
                </mat-list-item>
                <mat-divider inset></mat-divider>

                <mat-list-item>
                  <mat-icon matListItemIcon class="text-warning">storage</mat-icon>
                  <div matListItemTitle class="small text-muted">IPFS Metadata (JSON)</div>
                  <div matListItemLine class="fw-bold">
                    <a [href]="'https://ipfs.io/ipfs/' + plot()?.ipfsHash" target="_blank" class="text-decoration-none">
                      {{plot()?.ipfsHash}} <mat-icon class="tiny-icon align-middle">open_in_new</mat-icon>
                    </a>
                  </div>
                </mat-list-item>
              </mat-list>
            </mat-card-content>
          </mat-card>

          <mat-card class="border-0 shadow-sm rounded-3">
             <mat-card-header class="p-4 border-bottom">
              <mat-card-title class="m-0 fs-5 fw-bold">Asset Attributes</mat-card-title>
            </mat-card-header>
            <mat-card-content class="p-4">
               <div class="row g-3">
                  <div class="col-md-4" *ngFor="let attr of attributes">
                    <div class="attribute-box p-3 rounded-3 text-center border">
                      <div class="text-muted tiny text-uppercase fw-bold">{{attr.trait_type}}</div>
                      <div class="fw-bold text-primary">{{attr.value}}</div>
                    </div>
                  </div>
               </div>
               
               <div class="mt-4">
                  <button mat-flat-button color="primary" class="w-100 py-2">
                    <mat-icon>download</mat-icon> Download Ownership Certificate (PDF)
                  </button>
               </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .nft-card { border-radius: 20px; }
    .nft-image-container { height: 350px; overflow: hidden; background: #000; }
    .nft-image { width: 100%; height: 100%; object-fit: cover; opacity: 0.9; }
    .nft-badge {
      position: absolute; top: 20px; left: 20px;
      background: rgba(26, 35, 126, 0.9); color: white;
      padding: 5px 15px; border-radius: 30px; font-size: 10px; font-weight: 700;
      display: flex; align-items: center; gap: 5px;
    }
    .nft-badge mat-icon { font-size: 14px; width: 14px; height: 14px; }
    .nft-token-id { font-size: 0.8rem; color: #764ba2; font-weight: 700; letter-spacing: 1px; }
    .tiny-icon { font-size: 14px; width: 14px; height: 14px; }
    .attribute-box { background: rgba(63, 81, 181, 0.03); }
    .tiny { font-size: 10px; }
  `]
})
export class NftDetailsComponent implements OnInit {
  plot = signal<Plot | null>(null);
  
  attributes = [
    { trait_type: 'Property Type', value: 'Residential' },
    { trait_type: 'Area Size', value: '3,500 sqft' },
    { trait_type: 'District', value: 'Hillside' },
    { trait_type: 'Price', value: '$1.5M' },
    { trait_type: 'Verified', value: 'Yes' },
    { trait_type: 'Network', value: 'Sepolia' }
  ];

  constructor(
    private route: ActivatedRoute,
    private plotService: PlotService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.plotService.getPlotById(id).subscribe(p => {
        this.plot.set(p);
      });
    }
  }
}
