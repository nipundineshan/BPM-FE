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
      <nav class="flex text-sm text-slate-500 mb-4 px-4">
        <a routerLink="/user/dashboard" class="hover:text-primary-600">Dashboard</a>
        <span class="mx-2">/</span>
        <span class="text-slate-900 dark:text-white font-medium">{{ plot.plotName }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
        <!-- Image and Main Info -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800">
             <!-- Image Gallery Preview -->
             <div class="relative group">
               <img [src]="plot.propertyImages[currentImageIndex()] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200'" class="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105">
               <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between px-4">
                 <button (click)="prevImage(plot.propertyImages.length)" class="p-2 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/40"><mat-icon>chevron_left</mat-icon></button>
                 <button (click)="nextImage(plot.propertyImages.length)" class="p-2 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/40"><mat-icon>chevron_right</mat-icon></button>
               </div>
               <!-- Dots -->
               <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                 <div *ngFor="let img of plot.propertyImages; let i = index" 
                   [class]="'w-2 h-2 rounded-full transition-all ' + (i === currentImageIndex() ? 'bg-white w-4' : 'bg-white/50')"></div>
               </div>
             </div>

             <div class="p-8">
                <div class="flex justify-between items-start mb-4">
                  <h1 class="text-3xl font-bold text-slate-900 dark:text-white">{{ plot.plotName }}</h1>
                  <span class="px-3 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full text-xs font-bold uppercase tracking-wider">
                    {{ plot.status.replace('_', ' ') }}
                  </span>
                </div>
                
                <p class="text-slate-500 flex items-center mb-6">
                  <mat-icon class="text-slate-400 mr-2">location_on</mat-icon>
                  {{ plot.address }}, {{ plot.district }}, {{ plot.state }}
                </p>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-slate-100 dark:border-slate-800">
                  <div>
                    <span class="block text-xs text-slate-400 uppercase font-bold mb-1">Survey No.</span>
                    <span class="text-sm font-medium dark:text-slate-300">{{ plot.surveyNumber }}</span>
                  </div>
                  <div>
                    <span class="block text-xs text-slate-400 uppercase font-bold mb-1">Reg. No.</span>
                    <span class="text-sm font-medium dark:text-slate-300">{{ plot.registrationNumber }}</span>
                  </div>
                  <div>
                    <span class="block text-xs text-slate-400 uppercase font-bold mb-1">Total Area</span>
                    <span class="text-sm font-medium dark:text-slate-300">{{ plot.areaSize }}</span>
                  </div>
                  <div>
                    <span class="block text-xs text-slate-400 uppercase font-bold mb-1">Country</span>
                    <span class="text-sm font-medium dark:text-slate-300">{{ plot.country }}</span>
                  </div>
                </div>

                <div class="mt-8">
                   <h2 class="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Description</h2>
                   <p class="text-slate-600 dark:text-slate-400 leading-relaxed">{{ plot.description }}</p>
                </div>

                <!-- Documents Section -->
                <div class="mt-10" *ngIf="plot.legalDocuments.length > 0">
                   <h2 class="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Verification Documents</h2>
                   <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                     <a *ngFor="let doc of plot.legalDocuments; let i = index" [href]="doc" target="_blank" 
                        class="flex items-center p-3 border dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                       <mat-icon class="text-primary-500 mr-3">insert_drive_file</mat-icon>
                       <span class="text-sm font-medium text-slate-700 dark:text-slate-300 flex-grow">Legal Document #{{ i + 1 }}</span>
                       <mat-icon class="text-slate-300 group-hover:text-primary-500 transition-colors">open_in_new</mat-icon>
                     </a>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <!-- Action Sidebar -->
        <div class="space-y-6">
          <!-- Price Card -->
          <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <span class="text-sm text-slate-500 font-medium">Market Value</span>
            <div class="text-3xl font-bold text-primary-600 mt-1">₹ {{ plot.marketValue | number:'1.0-0' }}</div>
          </div>

          <!-- Tokenization Status Card -->
          <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <h3 class="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">Tokenization Progress</h3>
            
            <!-- Phase 1: Creation -->
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                <mat-icon class="text-sm">check</mat-icon>
              </div>
              <div>
                <p class="text-sm font-bold text-slate-900 dark:text-white">Property Registered</p>
                <p class="text-xs text-slate-500">Records added to system</p>
              </div>
            </div>

            <!-- Phase 2: IPFS -->
            <div class="flex items-start space-x-4">
              <div [ngClass]="plot.ipfsHash ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'" 
                   class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors">
                <mat-icon *ngIf="plot.ipfsHash" class="text-sm">check</mat-icon>
                <span *ngIf="!plot.ipfsHash" class="text-xs font-bold text-slate-400">2</span>
              </div>
              <div class="flex-1">
                <p class="text-sm font-bold text-slate-900 dark:text-white">IPFS Metadata</p>
                <p class="text-xs text-slate-500">Decentralized storage anchor</p>
                <div *ngIf="plot.ipfsHash" class="mt-2 text-[10px] font-mono bg-slate-50 dark:bg-slate-800 p-2 rounded truncate text-slate-500">
                  Hash: {{ plot.ipfsHash }}
                </div>
              </div>
            </div>

            <!-- Phase 3: Minting -->
            <div class="flex items-start space-x-4">
              <div [ngClass]="plot.isMinted ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'" 
                   class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors">
                <mat-icon *ngIf="plot.isMinted" class="text-sm">check</mat-icon>
                <span *ngIf="!plot.isMinted" class="text-xs font-bold text-slate-400">3</span>
              </div>
              <div class="flex-1">
                <p class="text-sm font-bold text-slate-900 dark:text-white">Blockchain Minting</p>
                <p class="text-xs text-slate-500">ERC-721 NFT Certificate</p>
                
                <div *ngIf="plot.transactionHash" class="mt-2 space-y-1">
                  <div class="text-[10px] font-mono bg-slate-50 dark:bg-slate-800 p-2 rounded truncate text-slate-500">
                     TX: {{ plot.transactionHash }}
                  </div>
                  <a [href]="'https://sepolia.etherscan.io/tx/' + plot.transactionHash" target="_blank" 
                     class="text-[10px] text-primary-600 hover:underline font-bold block">
                    View on Etherscan
                  </a>
                </div>
              </div>
            </div>

            <!-- Confirmation -->
            <div *ngIf="plot.isMinted" class="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-900/30 animate-pulse">
               <div class="flex items-center space-x-3">
                  <span class="text-xl">🎉</span>
                  <div>
                    <p class="text-xs font-bold text-green-800 dark:text-green-400 uppercase tracking-wider">NFT Confirmed</p>
                    <p class="text-sm font-bold text-green-900 dark:text-green-300">Token ID: #{{ plot.tokenId || 'Syncing...' }}</p>
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
  private route = inject(ActivatedRoute);
  private plotService = inject(PlotService);
  private nftService = inject(NftService);
  public web3Service = inject(Web3Service);

  plot = signal<Plot | null>(null);
  currentImageIndex = signal(0);
  pollingSub?: Subscription;

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
        if (data.status === 'minted' && !data.tokenId) {
          this.startPolling(id);
        }
      }
    });
  }

  nextImage(total: number) {
    this.currentImageIndex.update(val => (val + 1) % total);
  }

  prevImage(total: number) {
    this.currentImageIndex.update(val => (val - 1 + total) % total);
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
