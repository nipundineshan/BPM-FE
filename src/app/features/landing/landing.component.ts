import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  template: `
    <div class="landing-wrapper">
      <!-- Hero Section -->
      <section class="hero-section text-white d-flex align-items-center">
        <div class="container text-center py-5">
          <h1 class="display-2 fw-bold mb-3 slide-up">BPM Enterprise</h1>
          <p class="lead fs-3 mb-5 slide-up-delay-1">
            The next generation of Blockchain-based Property Management & NFT
            Registry
          </p>
          <div class="d-flex justify-content-center gap-3 slide-up-delay-2">
            <button
              mat-flat-button
              color="primary"
              routerLink="/auth/register"
              class="hero-btn rounded-pill px-5 py-3 fs-5"
            >
              Get Started
            </button>
            <button
              mat-stroked-button
              color="accent"
              routerLink="/auth/login"
              class="hero-btn rounded-pill px-5 py-3 fs-5 text-white border-white"
            >
              Login to Console
            </button>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section py-5 bg-white">
        <div class="container py-5">
          <div class="row text-center mb-5">
            <div class="col-lg-8 mx-auto">
              <h2 class="display-4 fw-bold mb-3">Enterprise-Grade Security</h2>
              <p class="text-muted fs-5">
                A comprehensive solution for property registration,
                verification, and blockchain ownership.
              </p>
            </div>
          </div>
          <div class="row g-4">
            <div class="col-md-4">
              <div
                class="feature-card p-5 rounded-4 shadow-sm h-100 text-center"
              >
                <div class="feature-icon mb-4 bg-primary-subtle text-primary">
                  <mat-icon>security</mat-icon>
                </div>
                <h3>Role-Based Auth</h3>
                <p class="text-muted">
                  Strict hierarchical access control for Super Admins, Admins,
                  and verified Users.
                </p>
              </div>
            </div>
            <div class="col-md-4">
              <div
                class="feature-card p-5 rounded-4 shadow-sm h-100 text-center"
              >
                <div class="feature-icon mb-4 bg-success-subtle text-success">
                  <mat-icon>account_balance_wallet</mat-icon>
                </div>
                <h3>NFT Property Deeds</h3>
                <p class="text-muted">
                  Mint property records as NFTs on the Ethereum Sepolia network
                  for immutable proof of ownership.
                </p>
              </div>
            </div>
            <div class="col-md-4">
              <div
                class="feature-card p-5 rounded-4 shadow-sm h-100 text-center"
              >
                <div class="feature-icon mb-4 bg-info-subtle text-info">
                  <mat-icon>verified</mat-icon>
                </div>
                <h3>Verified Workflow</h3>
                <p class="text-muted">
                  Mult-stage approval process ensuring only legitimate users and
                  properties enter the system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer py-4 bg-dark text-white text-center">
        <div class="container">
          <p class="mb-0">
            © 2026 BPM Enterprise Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
      .hero-section {
        min-height: 85vh;
        background:
          linear-gradient(rgba(26, 35, 126, 0.9), rgba(63, 81, 181, 0.8)),
          url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
      }
      .hero-btn {
        transition: all 0.3s ease;
      }
      .hero-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      }
      .feature-card {
        transition: all 0.3s ease;
        border: 1px solid #f0f0f0;
      }
      .feature-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) !important;
      }
      .feature-icon {
        width: 80px;
        height: 80px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
      }
      .feature-icon mat-icon {
        font-size: 40px;
        width: 40px;
        height: 40px;
      }
      .slide-up {
        animation: slideUp 0.8s ease forwards;
      }
      .slide-up-delay-1 {
        animation: slideUp 0.8s ease 0.2s forwards;
        opacity: 0;
      }
      .slide-up-delay-2 {
        animation: slideUp 0.8s ease 0.4s forwards;
        opacity: 0;
      }
      @keyframes slideUp {
        from {
          transform: translateY(30px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `,
  ],
})
export class LandingComponent {}
