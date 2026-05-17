import { Component, OnInit, signal, inject } from '@angular/core';
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
import { environment } from '../../../../environments/environment';

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
      <div class="d-flex align-items-center mb-4 px-3">
        <button mat-icon-button routerLink="/user/dashboard" class="me-2 dark:text-white">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h2 class="mb-0 fw-bold text-slate-900 dark:text-white">NFT Asset Certificate</h2>
      </div>

      <div class="row g-4 px-3">
        <!-- NFT Visual Representation -->
        <div class="col-lg-5">
          <mat-card class="nft-card border-0 shadow-lg overflow-hidden dark:bg-slate-900 dark:border dark:border-slate-800">
            <div class="nft-image-container position-relative">
              <img [src]="plot()?.propertyImages?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200'" class="nft-image" alt="NFT Property">
              <div class="nft-badge">
                <mat-icon>verified</mat-icon> VERIFIED ASSET
              </div>
            </div>
            <mat-card-content class="p-4 text-center">
              <div class="nft-token-id mb-1 text-primary-500">Token ID #{{plot()?.tokenId}}</div>
              <h3 class="fw-bold mb-0 text-slate-900 dark:text-white">{{plot()?.plotName}}</h3>
              <p class="text-slate-500 small mt-2">Minted on Ethereum Sepolia Testnet</p>
              
              <div class="qr-placeholder mt-4 p-3 border rounded-3 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 d-inline-block">
                <mat-icon class="display-1 text-slate-300">qr_code_2</mat-icon>
                <div class="tiny text-slate-400">Scan to verify on-chain</div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- On-Chain Metadata -->
        <div class="col-lg-7">
          <mat-card class="border-0 shadow-sm rounded-3 mb-4 dark:bg-slate-900 dark:border dark:border-slate-800">
            <mat-card-header class="p-4 border-bottom dark:border-slate-800">
              <mat-card-title class="m-0 fs-5 fw-bold text-slate-900 dark:text-white">Blockchain Provenance</mat-card-title>
            </mat-card-header>
            <mat-card-content class="p-4">
              <mat-list>
                <mat-list-item>
                  <mat-icon matListItemIcon class="text-primary-500">token</mat-icon>
                  <div matListItemTitle class="small text-slate-400">Contract Address</div>
                  <div matListItemLine class="fw-bold text-truncate text-slate-700 dark:text-slate-300">{{contractAddress}}</div>
                </mat-list-item>
                <mat-divider inset class="dark:border-slate-800"></mat-divider>
                
                <mat-list-item>
                  <mat-icon matListItemIcon class="text-success-500">account_balance_wallet</mat-icon>
                  <div matListItemTitle class="small text-slate-400">Owner Wallet</div>
                  <div matListItemLine class="fw-bold text-truncate text-slate-700 dark:text-slate-300">{{plot()?.ownerId}}</div>
                </mat-list-item>
                <mat-divider inset class="dark:border-slate-800"></mat-divider>

                <mat-list-item>
                  <mat-icon matListItemIcon class="text-info-500">history</mat-icon>
                  <div matListItemTitle class="small text-slate-400">Transaction Hash</div>
                  <div matListItemLine class="fw-bold">
                    <a [href]="'https://sepolia.etherscan.io/tx/' + plot()?.transactionHash" target="_blank" class="text-primary-500 text-decoration-none hover:underline">
                      {{plot()?.transactionHash}} <mat-icon class="tiny-icon align-middle">open_in_new</mat-icon>
                    </a>
                  </div>
                </mat-list-item>
                <mat-divider inset class="dark:border-slate-800"></mat-divider>

                <mat-list-item>
                  <mat-icon matListItemIcon class="text-warning-500">storage</mat-icon>
                  <div matListItemTitle class="small text-slate-400">IPFS Metadata (JSON)</div>
                  <div matListItemLine class="fw-bold">
                    <a [href]="'https://ipfs.io/ipfs/' + plot()?.ipfsHash" target="_blank" class="text-primary-500 text-decoration-none hover:underline">
                      {{plot()?.ipfsHash}} <mat-icon class="tiny-icon align-middle">open_in_new</mat-icon>
                    </a>
                  </div>
                </mat-list-item>
              </mat-list>
            </mat-card-content>
          </mat-card>

          <mat-card class="border-0 shadow-sm rounded-3 dark:bg-slate-900 dark:border dark:border-slate-800">
             <mat-card-header class="p-4 border-bottom dark:border-slate-800">
              <mat-card-title class="m-0 fs-5 fw-bold text-slate-900 dark:text-white">Asset Attributes</mat-card-title>
            </mat-card-header>
            <mat-card-content class="p-4">
               <div class="row g-3">
                  <div class="col-md-4" *ngFor="let attr of attributes">
                    <div class="attribute-box p-3 rounded-3 text-center border dark:border-slate-800 dark:bg-slate-800/50">
                      <div class="text-slate-400 tiny text-uppercase fw-bold">{{attr.trait_type}}</div>
                      <div class="fw-bold text-primary-500">{{attr.value}}</div>
                    </div>
                  </div>
               </div>
               
               <div class="mt-4">
                  <button mat-flat-button color="primary" class="w-100 py-2 rounded-pill shadow-sm">
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
    .tiny-icon { font-size: 14px; width: 14px; height: 14px; }
    .tiny { font-size: 10px; }
    .text-primary-500 { color: var(--primary-color); }
    .text-success-500 { color: var(--success-color); }
    .text-warning-500 { color: var(--warning-color); }
    .text-info-500 { color: #0ea5e9; }
  `]
})
export class NftDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private plotService = inject(PlotService);

  plot = signal<Plot | null>(null);
  attributes: any[] = [];
  contractAddress = environment.apiUrl.includes('localhost') ? '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' : '0x0000000000000000000000000000000000000000';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.plotService.getPlotById(id).subscribe(p => {
        this.plot.set(p);
        this.deriveAttributes(p);
      });
    }
  }

  deriveAttributes(p: Plot) {
    this.attributes = [
      { trait_type: 'Address', value: p.address },
      { trait_type: 'Area Size', value: p.areaSize },
      { trait_type: 'District', value: p.district },
      { trait_type: 'Market Value', value: '$' + p.marketValue.toLocaleString() },
      { trait_type: 'Minted', value: p.isMinted ? 'Yes' : 'No' },
      { trait_type: 'Network', value: 'Sepolia' }
    ];
  }
}
