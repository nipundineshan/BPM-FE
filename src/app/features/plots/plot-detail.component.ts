import { Component, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PlotService } from '../../core/services/plot.service';
import { NftService } from '../../core/services/nft.service';
import { Web3Service } from '../../core/services/web3.service';
import { Plot } from '../../core/models';
import { interval, Subscription, switchMap, takeWhile } from 'rxjs';

@Component({
  selector: 'app-plot-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-5xl mx-auto space-y-8" *ngIf="plot() as plot">
      <!-- Breadcrumbs -->
      <nav class="flex text-sm text-slate-500 mb-4">
        <a routerLink="/dashboard" class="hover:text-primary-600">Dashboard</a>
        <span class="mx-2">/</span>
        <span class="text-slate-900 font-medium">{{ plot.title }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Image and Main Info -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
             <img *ngIf="plot.imageUrl" [src]="plot.imageUrl" class="w-full h-96 object-cover">
             <div *ngIf="!plot.imageUrl" class="w-full h-96 bg-slate-100 flex items-center justify-center text-slate-400">
                <svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
             </div>
             <div class="p-8">
                <h1 class="text-3xl font-bold text-slate-900">{{ plot.title }}</h1>
                <p class="text-slate-500 mt-2 flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {{ plot.location }}
                </p>
                <div class="mt-6 border-t border-slate-100 pt-6">
                   <h2 class="text-sm font-semibold text-slate-900 uppercase tracking-wider">Description</h2>
                   <p class="text-slate-600 mt-4 leading-relaxed">{{ plot.description }}</p>
                </div>
             </div>
          </div>
        </div>

        <!-- Action Sidebar -->
        <div class="space-y-6">
          <!-- Price Card -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <span class="text-sm text-slate-500 font-medium">Market Price</span>
            <div class="text-3xl font-bold text-primary-600 mt-1">\${{ plot.price.toLocaleString() }}</div>
          </div>

          <!-- Tokenization Status Card -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <h3 class="font-bold text-slate-900 border-b border-slate-100 pb-4">Tokenization Progress</h3>
            
            <!-- Phase 1: Creation -->
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div>
                <p class="text-sm font-bold text-slate-900">Property Registered</p>
                <p class="text-xs text-slate-500">Database entry created</p>
              </div>
            </div>

            <!-- Phase 2: IPFS -->
            <div class="flex items-start space-x-4">
              <div [ngClass]="plot.status !== 'PENDING' ? 'bg-green-500' : 'bg-slate-200'" 
                   class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors">
                <svg *ngIf="plot.status !== 'PENDING'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                <span *ngIf="plot.status === 'PENDING'" class="text-xs font-bold text-slate-400">2</span>
              </div>
              <div class="flex-1">
                <p class="text-sm font-bold text-slate-900">IPFS Metadata</p>
                <p class="text-xs text-slate-500">Metadata pinned to IPFS</p>
                <button *ngIf="plot.status === 'PENDING'" (click)="onPrepareIPFS()" [disabled]="loadingIPFS()"
                        class="mt-3 w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 disabled:opacity-50 transition-all">
                  {{ loadingIPFS() ? 'Pinning...' : 'Prepare for Minting' }}
                </button>
                <div *ngIf="plot.ipfsHash" class="mt-2 text-[10px] font-mono bg-slate-50 p-2 rounded truncate text-slate-500">
                  Hash: {{ plot.ipfsHash }}
                </div>
              </div>
            </div>

            <!-- Phase 3: Minting -->
            <div class="flex items-start space-x-4">
              <div [ngClass]="plot.status === 'MINTED' ? 'bg-green-500' : 'bg-slate-200'" 
                   class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors">
                <svg *ngIf="plot.status === 'MINTED'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                <span *ngIf="plot.status !== 'MINTED'" class="text-xs font-bold text-slate-400">3</span>
              </div>
              <div class="flex-1">
                <p class="text-sm font-bold text-slate-900">Blockchain Minting</p>
                <p class="text-xs text-slate-500">ERC-721 Token on Sepolia</p>
                <button *ngIf="plot.status === 'IPFS_PINNED'" (click)="onMintNFT()" [disabled]="loadingMint() || !web3Service.walletAddress()"
                        class="mt-3 w-full py-2 bg-primary-600 text-white rounded-lg text-xs font-bold hover:bg-primary-700 disabled:opacity-50 transition-all shadow-sm">
                  {{ loadingMint() ? 'Minting...' : 'Mint NFT' }}
                </button>
                <p *ngIf="plot.status === 'IPFS_PINNED' && !web3Service.walletAddress()" class="mt-2 text-[10px] text-red-500">Please connect wallet to mint.</p>
                
                <div *ngIf="plot.transactionHash" class="mt-2 space-y-1">
                  <div class="text-[10px] font-mono bg-slate-50 p-2 rounded truncate text-slate-500">
                     TX: {{ plot.transactionHash }}
                  </div>
                  <a [href]="'https://sepolia.etherscan.io/tx/' + plot.transactionHash" target="_blank" 
                     class="text-[10px] text-primary-600 hover:underline font-bold block text-center">
                    View on Etherscan
                  </a>
                </div>
              </div>
            </div>

            <!-- Confirmation -->
            <div *ngIf="plot.status === 'MINTED'" class="bg-green-50 p-4 rounded-xl border border-green-100 animate-pulse">
               <div class="flex items-center space-x-3">
                  <span class="text-xl">🎉</span>
                  <div>
                    <p class="text-xs font-bold text-green-800 uppercase tracking-wider">NFT Confirmed</p>
                    <p class="text-sm font-bold text-green-900">Token ID: #{{ plot.tokenId || 'Syncing...' }}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PlotDetailComponent implements OnInit, OnDestroy {
  plot = signal<Plot | null>(null);
  loadingIPFS = signal(false);
  loadingMint = signal(false);
  pollingSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private plotService: PlotService,
    private nftService: NftService,
    public web3Service: Web3Service
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPlot(id);
    }
  }

  ngOnDestroy(): void {
    this.pollingSub?.unsubscribe();
  }

  loadPlot(id: string): void {
    this.plotService.getPlotById(id).subscribe({
      next: (data) => {
        this.plot.set(data);
        if (data.status === 'MINTED' && !data.tokenId) {
          this.startPolling(id);
        }
      }
    });
  }

  onPrepareIPFS(): void {
    const p = this.plot();
    if (!p) return;
    this.loadingIPFS.set(true);
    this.plotService.prepareForMinting(p.id).subscribe({
      next: () => {
        this.loadPlot(p.id);
        this.loadingIPFS.set(false);
      },
      error: () => this.loadingIPFS.set(false)
    });
  }

  onMintNFT(): void {
    const p = this.plot();
    if (!p) return;
    this.loadingMint.set(true);
    this.nftService.mintPlot(p.id).subscribe({
      next: (res) => {
        this.plot.update(prev => prev ? ({ ...prev, transactionHash: res.transactionHash, status: 'MINTED' }) : null);
        this.loadingMint.set(false);
        this.startPolling(p.id);
      },
      error: () => this.loadingMint.set(false)
    });
  }

  private startPolling(id: string): void {
    if (this.pollingSub) return;
    
    this.pollingSub = interval(5000).pipe(
      switchMap(() => this.plotService.getPlotById(id)),
      takeWhile(plot => !plot.tokenId, true)
    ).subscribe(plot => {
      this.plot.set(plot);
      if (plot.tokenId) {
        this.pollingSub?.unsubscribe();
      }
    });
  }
}
