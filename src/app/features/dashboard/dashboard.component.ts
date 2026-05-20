import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PlotService } from '../../core/services/plot.service';
import { Plot } from '../../core/models';
import { AppStateService } from '../../core/services/app-state.service';
import { Web3Service } from '../../core/services/web3.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressBarModule,
    MatTooltipModule,
  ],
  template: `
    <div class="dashboard-shell animate-fade-in">
      <!-- Top Cyber Bar -->
      <div class="cyber-header mb-5 d-flex justify-content-between align-items-center">
        <div class="header-content">
          <div class="cyber-badge mb-2">SYSTEM: OPERATIONAL</div>
          <h1 class="display-5 fw-black text-white tracking-tighter mb-0">
            PORTFOLIO <span class="text-gradient">CORE</span>
          </h1>
          <div class="d-flex align-items-center gap-2 mt-2 opacity-50">
            <span class="pulse-dot"></span>
            <span class="tiny-label uppercase letter-spacing-2">Live Blockchain Sync Active</span>
          </div>
        </div>
        <button
          mat-flat-button
          color="primary"
          routerLink="/user/register-plot"
          class="cyber-button pulse-primary"
        >
          <mat-icon class="me-2">add_link</mat-icon> 
          <span class="fw-black tracking-tight">TOKENIZE ASSET</span>
        </button>
      </div>

      <!-- Neo-Stats Grid -->
      <div class="row g-4 mb-5">
        <div class="col-md-4" *ngFor="let stat of getStats(); let i = index">
          <div 
            class="neo-card stat-card holographic"
            [style.animation-delay]="i * 0.1 + 's'"
            [style.--accent-color]="stat.color"
          >
            <div class="neo-card-inner">
              <div class="d-flex justify-content-between align-items-start mb-4">
                <div class="neo-icon-box" [style.background]="stat.color" [style.box-shadow]="'0 0 20px ' + stat.color + '88'">
                  <mat-icon class="text-white">{{ stat.icon }}</mat-icon>
                </div>
                <div class="trend-badge" [class.positive]="stat.trend > 0">
                  <mat-icon class="tiny-icon">{{ stat.trend > 0 ? 'north_east' : 'horizontal_rule' }}</mat-icon>
                  <span>{{ stat.trend }}%</span>
                </div>
              </div>
              <div class="neo-stat-value text-glow">{{ stat.value }}</div>
              <div class="neo-stat-label">{{ stat.label }}</div>
              <div class="neo-card-glow" [style.background]="'radial-gradient(circle at center, ' + stat.color + '22 0%, transparent 70%)'"></div>
            </div>
            <div class="holo-scanline"></div>
          </div>
        </div>
      </div>

      <div class="row g-5">
        <!-- Main Frame: Portfolio -->
        <div class="col-lg-8">
          <div class="frame-header d-flex justify-content-between align-items-center mb-4">
            <div class="d-flex align-items-center gap-3">
              <div class="frame-icon"><mat-icon>layers</mat-icon></div>
              <h3 class="h5 fw-black text-white mb-0 uppercase tracking-widest">Digital Portfolio</h3>
            </div>
            <button mat-button class="cyber-link" routerLink="/user/my-plots">
              EXPAND DATA <mat-icon class="ms-1 tiny-icon">arrow_forward</mat-icon>
            </button>
          </div>

          <div *ngIf="isLoading" class="loading-state py-5">
            <mat-progress-bar mode="indeterminate" class="cyber-progress"></mat-progress-bar>
            <div class="text-center mt-3 tiny-label opacity-50">SCANNING LEDGER...</div>
          </div>

          <div *ngIf="!isLoading && plots().length === 0" class="empty-frame">
            <div class="empty-glow-box">
              <mat-icon>wifi_off</mat-icon>
            </div>
            <h4 class="fw-black text-white mb-2">VOID DETECTED</h4>
            <p class="text-muted mb-4 mx-auto max-w-xs">No tokenized assets found in your current node sector.</p>
            <button mat-stroked-button class="cyber-btn-outline" routerLink="/user/register-plot">
              INITIALIZE TOKENIZATION
            </button>
          </div>

          <div class="row g-4" *ngIf="!isLoading">
            <div class="col-md-6" *ngFor="let plot of plots().slice(0, 4); let i = index">
              <div 
                class="asset-frame animate-slide-in-up"
                [style.animation-delay]="(i * 0.1) + 0.3 + 's'"
                [routerLink]="['/user/plot-details', plot.id]"
              >
                <div class="asset-visual">
                  <img [src]="plot.propertyImages[0] || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'" class="asset-img"/>
                  <div class="asset-overlay"></div>
                  <div class="asset-status" [class]="plot.status">
                    {{ plot.status.replace('_', ' ') | uppercase }}
                  </div>
                </div>
                <div class="asset-content">
                  <h4 class="h6 fw-black text-white text-truncate mb-1">{{ plot.plotName }}</h4>
                  <div class="d-flex align-items-center text-muted tiny-label mb-3">
                    <mat-icon class="tiny-icon me-1">location_on</mat-icon>
                    <span class="text-truncate">{{ plot.address }}</span>
                  </div>
                  <div class="d-flex justify-content-between align-items-center border-top border-white border-opacity-10 pt-3">
                    <div class="asset-value">
                      <span class="unit">₹</span>
                      <span class="val">{{ plot.marketValue | number: '1.0-0' }}</span>
                    </div>
                    <div class="asset-metric">{{ plot.areaSize }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar: Network Control -->
        <div class="col-lg-4">
          <div class="side-frame mb-5">
            <div class="side-frame-inner">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <div class="tiny-label uppercase letter-spacing-2 opacity-50">Network Uplink</div>
                <div class="status-indicator" [class.online]="web3Service.walletAddress()"></div>
              </div>

              <div *ngIf="web3Service.walletAddress(); else disconnected" class="uplink-active">
                <div class="d-flex align-items-center gap-3 mb-4">
                  <div class="node-icon"><mat-icon>account_balance_wallet</mat-icon></div>
                  <div class="min-w-0">
                    <div class="tiny-label text-primary uppercase fw-black mb-1">METAMASK NODE</div>
                    <div class="wallet-addr text-truncate">{{ web3Service.walletAddress() }}</div>
                  </div>
                </div>
                <div class="network-chip">
                  <span class="chip-dot"></span>
                  <span>ETHEREUM SEPOLIA</span>
                </div>
              </div>

              <ng-template #disconnected>
                <div class="text-center py-2">
                  <p class="tiny-label text-muted mb-4 lh-base">NO WALLET LINK DETECTED. BLOCKCHAIN SYNC DISABLED.</p>
                  <button mat-flat-button color="primary" class="w-100 cyber-button" (click)="web3Service.connectWallet()">
                    ESTABLISH UPLINK
                  </button>
                </div>
              </ng-template>
            </div>
          </div>

          <div class="frame-header mb-4">
            <h3 class="h6 fw-black text-white mb-0 uppercase tracking-widest">Data Transmissions</h3>
          </div>

          <div class="activity-frame">
            <div class="activity-scroll">
              <div class="activity-node" *ngFor="let activity of activities">
                <div class="node-line"></div>
                <div class="node-dot" [class]="activity.type"></div>
                <div class="node-content">
                  <div class="d-flex justify-content-between mb-1">
                    <span class="node-title">{{ activity.title }}</span>
                    <span class="node-time">{{ activity.time }}</span>
                  </div>
                  <p class="node-desc">{{ activity.desc }}</p>
                </div>
              </div>

              <div *ngIf="activities.length === 0" class="text-center py-5 opacity-20">
                <mat-icon class="mb-2">sensors_off</mat-icon>
                <div class="tiny-label uppercase">No Signals</div>
              </div>
            </div>
            <div class="frame-footer p-3 text-center border-top border-white border-opacity-5">
              <button mat-button class="cyber-link tiny-label">DOWNLOAD LOGS</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-shell { padding: 2rem 0; }

      /* Cyber Header */
      .cyber-badge {
        display: inline-block;
        padding: 4px 10px;
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
        font-size: 0.65rem;
        font-weight: 900;
        letter-spacing: 0.15em;
        border-radius: 4px;
        border-left: 3px solid #10b981;
      }
      
      .pulse-dot {
        width: 8px;
        height: 8px;
        background: #10b981;
        border-radius: 50%;
        box-shadow: 0 0 10px #10b981;
        animation: cyber-pulse 2s infinite;
      }
      @keyframes cyber-pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.5); opacity: 0.5; }
        100% { transform: scale(1); opacity: 1; }
      }

      /* Neo Cards */
      .neo-card {
        background: rgba(15, 23, 42, 0.6);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 24px;
        position: relative;
        overflow: hidden;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      .neo-card:hover {
        transform: translateY(-8px);
        border-color: var(--accent-color);
        background: rgba(15, 23, 42, 0.8);
      }
      .neo-card-inner { padding: 1.5rem; position: relative; z-index: 2; }
      
      .neo-icon-box {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 16px rgba(0,0,0,0.3);
      }
      
      .neo-stat-value {
        font-size: 2.5rem;
        font-weight: 900;
        color: white;
        line-height: 1;
        margin-bottom: 0.5rem;
        letter-spacing: -0.05em;
      }
      .text-glow { text-shadow: 0 0 10px var(--accent-color); }
      
      .holographic {
        position: relative;
        overflow: hidden;
      }
      .holographic::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(255,255,255,0.05) 100%);
        pointer-events: none;
      }
      
      .holo-scanline {
        position: absolute;
        top: 0; left: 0; width: 100%; height: 10px;
        background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent);
        opacity: 0.3;
        animation: scanline 4s linear infinite;
        pointer-events: none;
      }
      @keyframes scanline {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(1000%); }
      }
      .neo-stat-label {
        color: rgba(255, 255, 255, 0.4);
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.15em;
      }

      .trend-badge {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 10px;
        border-radius: 99px;
        background: rgba(255, 255, 255, 0.05);
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.7rem;
        font-weight: 800;
      }
      .trend-badge.positive { color: #10b981; background: rgba(16, 185, 129, 0.1); }

      /* Asset Frames */
      .asset-frame {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 20px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s;
      }
      .asset-frame:hover {
        background: rgba(255, 255, 255, 0.04);
        border-color: var(--primary-color);
        transform: scale(1.02);
      }
      
      .asset-visual { height: 180px; position: relative; }
      .asset-img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
      .asset-frame:hover .asset-img { transform: scale(1.1); }
      .asset-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.8)); }
      
      .asset-status {
        position: absolute;
        top: 1rem; right: 1rem;
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 0.65rem;
        font-weight: 900;
        backdrop-filter: blur(8px);
        background: rgba(255,255,255,0.1);
        border: 1px solid rgba(255,255,255,0.2);
        color: white;
      }
      .asset-status.minted { background: rgba(16, 185, 129, 0.2); border-color: #10b981; }
      .asset-status.pending_approval { background: rgba(245, 158, 11, 0.2); border-color: #f59e0b; }

      .asset-content { padding: 1.25rem; }
      .asset-value .unit { color: var(--primary-color); font-weight: 900; margin-right: 4px; }
      .asset-value .val { font-size: 1.1rem; font-weight: 900; color: white; }
      .asset-metric { font-size: 0.7rem; color: rgba(255,255,255,0.4); font-weight: 700; }

      /* Sidebar & Activity */
      .side-frame {
        background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 24px;
        padding: 1.5rem;
      }
      
      .status-indicator {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(255,255,255,0.1);
      }
      .status-indicator.online { background: #10b981; box-shadow: 0 0 10px #10b981; }

      .node-icon {
        width: 44px;
        height: 44px;
        background: var(--gradient-1);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }
      
      .wallet-addr { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: rgba(255,255,255,0.5); }
      
      .network-chip {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        font-size: 0.7rem;
        font-weight: 800;
        color: rgba(255,255,255,0.7);
      }
      .chip-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--primary-color); }

      /* Activity Timeline */
      .activity-frame {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 24px;
        overflow: hidden;
      }
      .activity-scroll { padding: 1.5rem; max-height: 400px; overflow-y: auto; }
      
      .activity-node { position: relative; padding-left: 2rem; padding-bottom: 2rem; }
      .node-line { position: absolute; left: 4px; top: 12px; bottom: 0; width: 1px; background: rgba(255,255,255,0.05); }
      .activity-node:last-child .node-line { display: none; }
      
      .node-dot {
        position: absolute;
        left: 0; top: 4px;
        width: 9px; height: 9px;
        border-radius: 50%;
        background: rgba(255,255,255,0.2);
        z-index: 2;
      }
      .node-dot.success { background: #10b981; box-shadow: 0 0 8px #10b981; }
      .node-dot.warning { background: #f59e0b; box-shadow: 0 0 8px #f59e0b; }
      
      .node-title { font-size: 0.75rem; font-weight: 900; color: rgba(255,255,255,0.9); }
      .node-time { font-size: 0.65rem; color: rgba(255,255,255,0.3); font-weight: 700; }
      .node-desc { font-size: 0.7rem; color: rgba(255,255,255,0.4); margin: 0; line-height: 1.4; }

      /* Utils */
      .tiny-label { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.05em; }
      .uppercase { text-transform: uppercase; }
      .letter-spacing-2 { letter-spacing: 0.2em; }
      .tracking-widest { letter-spacing: 0.15em; }
      
      .cyber-button {
        padding: 10px 24px !important;
        border-radius: 12px !important;
        font-size: 0.85rem !important;
      }
      .cyber-btn-outline {
        border: 1px solid rgba(255,255,255,0.1) !important;
        color: white !important;
        border-radius: 12px !important;
        font-weight: 900 !important;
        font-size: 0.75rem !important;
        letter-spacing: 0.05em !important;
      }
      .cyber-link {
        color: var(--primary-color) !important;
        font-weight: 900 !important;
        font-size: 0.7rem !important;
        letter-spacing: 0.05em !important;
      }

      .loading-state { text-align: center; }
      .cyber-progress { height: 2px; background: rgba(255,255,255,0.05); border-radius: 2px; }
      
      .empty-frame {
        padding: 4rem 2rem;
        background: rgba(255,255,255,0.01);
        border: 1px dashed rgba(255,255,255,0.1);
        border-radius: 30px;
        text-align: center;
      }
      .empty-glow-box {
        width: 80px; height: 80px;
        margin: 0 auto 1.5rem;
        background: rgba(255,255,255,0.02);
        border-radius: 24px;
        display: flex; align-items: center; justify-content: center;
        color: rgba(255,255,255,0.1);
        mat-icon { font-size: 32px; width: 32px; height: 32px; }
      }

      .animate-fade-in { animation: fadeIn 0.8s ease-out; }
      .animate-slide-in-up { animation: slideInUp 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) forwards; opacity: 0; }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  private plotService = inject(PlotService);
  private userService = inject(UserService);
  public appState = inject(AppStateService);
  public web3Service = inject(Web3Service);

  plots = signal<Plot[]>([]);
  isLoading = true;
  activities: any[] = [];

  ngOnInit() {
    this.loadPlots();
    this.loadActivities();
  }

  loadPlots() {
    this.plotService.getMyPlots().subscribe({
      next: (plots) => {
        this.plots.set(plots || []);
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  loadActivities() {
    this.userService.getRecentActivities().subscribe({
      next: (activities) => {
        this.activities = activities;
      },
      error: (err: any) => console.error('Error loading activities', err),
    });
  }

  getStats() {
    return [
      {
        label: 'Asset Inventory',
        value: this.plots().length,
        icon: 'location_city',
        color: '#6366f1',
        trend: 12,
      },
      {
        label: 'Minted Tokens',
        value: this.getMintedCount(),
        icon: 'verified',
        color: '#10b981',
        trend: 8,
      },
      {
        label: 'In Review',
        value: this.getPendingCount(),
        icon: 'hourglass_empty',
        color: '#f59e0b',
        trend: 0,
      },
    ];
  }

  getMintedCount() {
    return this.plots().filter((p) => p.status === 'minted' || p.isMinted)
      .length;
  }

  getPendingCount() {
    return this.plots().filter((p) => p.status === 'pending_approval').length;
  }

  getStatusColor(status: string) {
    switch (status) {
      case 'minted': return 'success';
      case 'approved': return 'primary';
      case 'rejected': return 'danger';
      case 'pending_approval': return 'warning';
      default: return 'secondary';
    }
  }
}
