import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AppStateService } from '../../core/services/app-state.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="landing-shell">
      <!-- Premium Navbar -->
      <nav class="landing-nav d-flex align-items-center justify-content-between px-4 px-md-5">
        <div class="brand d-flex align-items-center gap-2">
          <div class="logo-square shadow-sm">
            <mat-icon class="text-white">business_center</mat-icon>
          </div>
          <span class="brand-name">BPM <span class="fw-light">Enterprise</span></span>
        </div>
        
        <div class="nav-actions d-flex gap-3">
          <button mat-button class="fw-bold small d-none d-sm-inline-block text-slate-600">Solutions</button>
          <button mat-button class="fw-bold small d-none d-sm-inline-block text-slate-600">Resources</button>
          <div class="v-divider d-none d-sm-block"></div>
          <ng-container *ngIf="!appState.isAuthenticated(); else backToApp">
            <button mat-button routerLink="/auth/login" class="fw-bold small">Sign In</button>
            <button mat-flat-button color="primary" routerLink="/auth/register" class="rounded-pill px-4 shadow-sm">
              Get Started
            </button>
          </ng-container>
          <ng-template #backToApp>
             <button mat-flat-button color="primary" [routerLink]="getDashboardLink()" class="rounded-pill px-4 shadow-sm">
               Open Dashboard
             </button>
          </ng-template>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="hero-section text-center py-5 px-4">
        <div class="hero-container animate-fade-up">
          <div class="badge-pill mb-4 mx-auto">
            <span class="pulse"></span>
            NEW: BLOCKCHAIN MINTING V2.0
          </div>
          <h1 class="display-3 fw-bold tracking-tight text-slate-900 mb-3">
            Tokenize Your Real Estate <br> 
            <span class="text-gradient">with Enterprise Trust</span>
          </h1>
          <p class="hero-subtitle mx-auto mb-5 text-slate-500">
            Secure, transparent, and efficient property management system powered by Ethereum. 
            Transform physical assets into liquid digital tokens in minutes.
          </p>
          <div class="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <button mat-flat-button color="primary" routerLink="/auth/register" class="hero-btn rounded-pill px-5 py-3 fs-5 shadow-lg">
              Start Tokenizing
            </button>
            <button mat-stroked-button class="hero-btn rounded-pill px-5 py-3 fs-5 border-2">
              Watch Demo
            </button>
          </div>
        </div>

        <!-- Hero Asset Visual -->
        <div class="hero-asset mt-5 pt-5 animate-fade-in-slow">
           <div class="dashboard-preview shadow-2xl rounded-4 border">
              <div class="preview-header p-3 border-bottom bg-slate-50 d-flex gap-2">
                 <span class="dot red"></span><span class="dot amber"></span><span class="dot green"></span>
              </div>
              <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200" alt="Dashboard Preview" class="w-100">
           </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section py-5 bg-white">
        <div class="container py-5">
          <div class="text-center mb-5">
             <h2 class="h1 fw-bold tracking-tight text-slate-900">Engineered for the modern market</h2>
             <p class="text-slate-500">Full-stack tokenization lifecycle management.</p>
          </div>

          <div class="row g-4">
            <div class="col-md-4">
              <mat-card class="feature-card-premium h-100 border-0 shadow-sm p-4">
                <div class="feat-icon bg-indigo-subtle text-indigo mb-4">
                  <mat-icon>security</mat-icon>
                </div>
                <h3 class="h5 fw-bold mb-3">Legal Verification</h3>
                <p class="text-slate-500 small leading-relaxed">
                  Multi-stage admin review ensures only verified property deeds and legitimate documentation enter the registry.
                </p>
              </mat-card>
            </div>
            <div class="col-md-4">
              <mat-card class="feature-card-premium h-100 border-0 shadow-sm p-4">
                <div class="feat-icon bg-pink-subtle text-pink mb-4">
                  <mat-icon>token</mat-icon>
                </div>
                <h3 class="h5 fw-bold mb-3">ERC-721 Minting</h3>
                <p class="text-slate-500 small leading-relaxed">
                  Seamlessly mint unique NFTs representing your properties on Ethereum Sepolia, complete with IPFS metadata storage.
                </p>
              </mat-card>
            </div>
            <div class="col-md-4">
              <mat-card class="feature-card-premium h-100 border-0 shadow-sm p-4">
                <div class="feat-icon bg-amber-subtle text-amber mb-4">
                  <mat-icon>insights</mat-icon>
                </div>
                <h3 class="h5 fw-bold mb-3">Real-time Insights</h3>
                <p class="text-slate-500 small leading-relaxed">
                  Advanced dashboards for users and administrators to monitor market value, verification logs, and platform distribution.
                </p>
              </mat-card>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="landing-footer py-5 border-top">
         <div class="container text-center">
            <div class="brand d-flex align-items-center justify-content-center gap-2 mb-4">
              <div class="logo-square-small">
                <mat-icon class="text-white">business_center</mat-icon>
              </div>
              <span class="brand-name-small">BPM <span class="fw-light">Enterprise</span></span>
            </div>
            <p class="tiny text-slate-400 uppercase tracking-widest fw-bold">Built with Angular 18 • Web3 Enabled • Enterprise Secure</p>
            <div class="d-flex justify-content-center gap-4 mt-4">
               <a href="#" class="text-slate-500 text-decoration-none small hover:text-primary">Documentation</a>
               <a href="#" class="text-slate-500 text-decoration-none small hover:text-primary">Support</a>
               <a href="#" class="text-slate-500 text-decoration-none small hover:text-primary">Privacy Policy</a>
            </div>
         </div>
      </footer>
    </div>
  `,
  styles: [`
    .landing-shell { background-color: var(--bg-app); }
    
    .landing-nav {
      height: 80px;
      position: sticky;
      top: 0;
      background: var(--bg-app);
      opacity: 0.95;
      backdrop-filter: blur(12px);
      z-index: 1000;
      border-bottom: 1px solid var(--border-color);
    }

    .logo-square { width: 36px; height: 36px; background: var(--primary-color); border-radius: 10px; display: flex; align-items: center; justify-content: center; }
    .logo-square-small { width: 24px; height: 24px; background: var(--primary-color); border-radius: 6px; display: flex; align-items: center; justify-content: center; }
    .logo-square-small mat-icon { font-size: 14px; width: 14px; height: 14px; }
    
    .brand-name { font-weight: 800; font-size: 1.5rem; letter-spacing: -0.025em; color: var(--text-primary); }
    .brand-name-small { font-weight: 800; font-size: 1.1rem; letter-spacing: -0.025em; color: var(--text-primary); }

    .v-divider { width: 1px; height: 20px; background: var(--border-color); }

    /* Hero Section */
    .hero-section { overflow: hidden; position: relative; }
    .hero-container { max-width: 900px; margin: 4rem auto 0; }
    
    .text-gradient {
      background: linear-gradient(90deg, #6366f1, #ec4899);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-subtitle { max-width: 600px; font-size: 1.25rem; line-height: 1.6; }
    .hero-btn { font-weight: 700 !important; }

    .badge-pill {
      display: flex; align-items: center; gap: 8px; width: fit-content;
      padding: 6px 16px; background: var(--bg-card); border: 1px solid var(--border-color);
      border-radius: 9999px; font-size: 0.75rem; font-weight: 700; color: var(--primary-color);
    }
    
    .pulse { width: 8px; height: 8px; background: var(--primary-color); border-radius: 50%; animation: pulse-anim 2s infinite; }
    @keyframes pulse-anim { 0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); } 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); } }

    .hero-asset { perspective: 2000px; }
    .dashboard-preview {
      max-width: 1100px; margin: 0 auto;
      transform: rotateX(10deg) translateY(0);
      background: var(--bg-card); overflow: hidden;
      border: 1px solid var(--border-color);
    }
    
    .dot { width: 10px; height: 10px; border-radius: 50%; }
    .dot.red { background: #ff5f57; }
    .dot.amber { background: #febc2e; }
    .dot.green { background: #28c840; }

    /* Features */
    .feature-card-premium {
      border-radius: 1.5rem !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: var(--bg-card);
    }
    .feature-card-premium:hover { transform: translateY(-8px); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1) !important; }
    
    .feat-icon { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
    .bg-indigo-subtle { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
    .bg-pink-subtle { background: rgba(236, 72, 153, 0.1); color: #ec4899; }
    .bg-amber-subtle { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }

    .animate-fade-up { animation: fadeUp 0.8s ease-out; }
    .animate-fade-in-slow { animation: fadeIn 1.5s ease-out; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class LandingComponent {
  public appState = inject(AppStateService);

  getDashboardLink() {
    const role = this.appState.currentUser()?.role;
    if (role === 'SUPER_ADMIN') return '/super-admin/dashboard';
    if (role === 'ADMIN') return '/admin/dashboard';
    return '/user/dashboard';
  }
}
