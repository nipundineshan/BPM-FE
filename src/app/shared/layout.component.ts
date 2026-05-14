import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { Web3Service } from '../core/services/web3.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  template: `
    <div class="min-h-screen bg-slate-50 flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div class="p-6 border-b border-slate-100">
          <h1 class="text-xl font-bold text-primary-600">RWA Estate</h1>
        </div>
        <nav class="flex-1 p-4 space-y-2">
          <a routerLink="/dashboard" routerLinkActive="bg-primary-50 text-primary-600" [routerLinkActiveOptions]="{exact: true}"
            class="flex items-center space-x-3 p-3 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span>Dashboard</span>
          </a>
          <a routerLink="/plots/create" routerLinkActive="bg-primary-50 text-primary-600"
            class="flex items-center space-x-3 p-3 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            <span>Add Property</span>
          </a>
        </nav>
        <div class="p-4 border-t border-slate-100">
          <button (click)="onLogout()" class="flex items-center space-x-3 p-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <!-- Header -->
        <header class="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8">
          <div class="flex items-center space-x-4">
             <span class="text-sm text-slate-500">Welcome, <strong>{{ authService.currentUser()?.email }}</strong></span>
             <span class="px-2 py-1 rounded text-xs font-medium" 
                   [ngClass]="authService.currentUser()?.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'">
               {{ authService.currentUser()?.role }}
             </span>
          </div>
          
          <div class="flex items-center space-x-4">
            <div *ngIf="web3Service.walletAddress() as address; else connectBtn" 
                 class="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
               <div class="w-2 h-2 rounded-full bg-green-500"></div>
               <span class="text-xs font-mono text-slate-600">{{ address.substring(0,6) }}...{{ address.substring(address.length-4) }}</span>
            </div>
            <ng-template #connectBtn>
              <button (click)="web3Service.connectWallet()" 
                class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                Connect Wallet
              </button>
            </ng-template>
          </div>
        </header>

        <!-- Page Content -->
        <div class="flex-1 overflow-auto p-8">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `
})
export class LayoutComponent {
  constructor(
    public authService: AuthService,
    public web3Service: Web3Service
  ) {}

  onLogout(): void {
    this.authService.logout();
  }
}
