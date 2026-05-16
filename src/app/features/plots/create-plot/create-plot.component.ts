import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { PlotService } from '../../../core/services/plot.service';

@Component({
  selector: 'app-create-plot',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container py-5">
      <div class="d-flex align-items-center mb-5">
        <button mat-icon-button routerLink="/user/dashboard" class="me-3 bg-white shadow-sm">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div>
          <h1 class="mb-0 fw-bold display-6">Register New Property</h1>
          <p class="text-muted mb-0">Submit your plot details for blockchain verification and NFT minting.</p>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-8">
          <mat-card class="shadow-sm border-0 rounded-4 overflow-hidden">
            <mat-progress-bar *ngIf="isLoading" mode="indeterminate"></mat-progress-bar>
            
            <mat-card-content class="p-4 p-md-5">
              <form [formGroup]="plotForm" (ngSubmit)="onSubmit()">
                <div class="d-flex align-items-center mb-4">
                  <div class="step-badge me-3">1</div>
                  <h5 class="mb-0 fw-bold text-primary">Property Information</h5>
                </div>
                
                <mat-form-field appearance="outline" class="w-100 mb-3">
                  <mat-label>Property Title</mat-label>
                  <input matInput formControlName="title" placeholder="e.g. Luxury Villa in North Hill">
                  <mat-icon matSuffix>title</mat-icon>
                  <mat-error *ngIf="plotForm.get('title')?.hasError('required')">Title is required</mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-100 mb-3">
                  <mat-label>Detailed Description</mat-label>
                  <textarea matInput formControlName="description" rows="4" placeholder="Describe the property features, surroundings, legal status, etc."></textarea>
                  <mat-error *ngIf="plotForm.get('description')?.hasError('required')">Description is required</mat-error>
                </mat-form-field>

                <div class="row g-3 mb-3">
                  <div class="col-md-6">
                    <mat-form-field appearance="outline" class="w-100">
                      <mat-label>Location / City</mat-label>
                      <input matInput formControlName="location" placeholder="City Name">
                      <mat-icon matSuffix>location_city</mat-icon>
                    </mat-form-field>
                  </div>
                  <div class="col-md-6">
                    <mat-form-field appearance="outline" class="w-100">
                      <mat-label>District / Area</mat-label>
                      <input matInput formControlName="district" placeholder="Area Name">
                      <mat-icon matSuffix>map</mat-icon>
                    </mat-form-field>
                  </div>
                </div>

                <div class="row g-3 mb-4">
                  <div class="col-md-6">
                    <mat-form-field appearance="outline" class="w-100">
                      <mat-label>Price ($)</mat-label>
                      <input matInput type="number" formControlName="price">
                      <mat-icon matPrefix class="me-2">attach_money</mat-icon>
                    </mat-form-field>
                  </div>
                  <div class="col-md-6">
                    <mat-form-field appearance="outline" class="w-100">
                      <mat-label>Area Size (sqft)</mat-label>
                      <input matInput type="number" formControlName="areaSize">
                      <mat-icon matSuffix>square_foot</mat-icon>
                    </mat-form-field>
                  </div>
                </div>

                <div class="d-flex align-items-center mb-4 pt-2">
                  <div class="step-badge me-3">2</div>
                  <h5 class="mb-0 fw-bold text-primary">Media & Documents</h5>
                </div>

                <mat-form-field appearance="outline" class="w-100 mb-4">
                  <mat-label>Property Image URL</mat-label>
                  <input matInput formControlName="imageUrl" placeholder="https://...">
                  <mat-icon matSuffix>image</mat-icon>
                </mat-form-field>

                <div class="upload-area p-5 border-2 border-dashed rounded-4 text-center mb-4 bg-light">
                  <div class="icon-circle bg-white shadow-sm mx-auto mb-3">
                    <mat-icon class="text-primary">cloud_upload</mat-icon>
                  </div>
                  <h6 class="fw-bold mb-1">Upload Legal Documents</h6>
                  <p class="small text-muted mb-0">Drag & drop property deeds, tax receipts, or <span class="text-primary fw-bold" style="cursor: pointer;">browse files</span></p>
                  <p class="tiny text-muted mt-2">Accepted formats: PDF, JPG, PNG (Max 10MB per file)</p>
                </div>

                <div class="alert alert-info border-0 rounded-3 mb-4 d-flex align-items-center">
                   <mat-icon class="me-3">verified_user</mat-icon>
                   <small>By submitting, you certify that all information and documents provided are legally authentic. Your plot will undergo a strict multi-stage verification process.</small>
                </div>

                <div class="d-grid gap-2">
                  <button mat-raised-button color="primary" type="submit" [disabled]="plotForm.invalid || isLoading" class="py-3 fs-6 rounded-3 shadow">
                    Submit Property for Verification
                  </button>
                </div>
              </form>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="col-lg-4">
          <mat-card class="bg-primary text-white shadow-sm border-0 rounded-4 mb-4">
            <mat-card-content class="p-4">
              <h6 class="fw-bold mb-3 d-flex align-items-center">
                <mat-icon class="me-2">lightbulb</mat-icon> Quick Tips
              </h6>
              <ul class="small ps-3 mb-0" style="opacity: 0.9;">
                <li class="mb-2">Ensure property title matches legal records exactly.</li>
                <li class="mb-2">High-quality images increase trust and speed up verification.</li>
                <li class="mb-2">Include accurate area size for correct valuation.</li>
                <li>Admins will review your submission within 24-72 hours.</li>
              </ul>
            </mat-card-content>
          </mat-card>

          <mat-card class="border-0 shadow-sm rounded-4 overflow-hidden" *ngIf="plotForm.get('imageUrl')?.value">
            <mat-card-header class="p-3 border-bottom">
              <mat-card-title class="small fw-bold mb-0">Media Preview</mat-card-title>
            </mat-card-header>
            <div class="p-2">
              <img [src]="plotForm.get('imageUrl')?.value" class="img-fluid rounded-3 shadow-sm w-100" style="max-height: 250px; object-fit: cover;">
            </div>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .border-dashed { border-style: dashed !important; border-color: #cbd5e0 !important; }
    .upload-area { transition: all 0.3s ease; }
    .upload-area:hover { background: #edf2f7 !important; border-color: #3f51b5 !important; }
    
    .step-badge {
      width: 28px; height: 28px; background: #3f51b5; color: white;
      border-radius: 8px; display: flex; align-items: center; 
      justify-content: center; font-weight: bold; font-size: 14px;
    }
    
    .icon-circle {
      width: 56px; height: 56px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
    }
    .icon-circle mat-icon { font-size: 28px; width: 28px; height: 28px; }
    
    .tiny { font-size: 11px; }
  `]
})
export class CreatePlotComponent {
  private fb = inject(FormBuilder);
  private plotService = inject(PlotService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  plotForm: FormGroup;
  isLoading = false;

  constructor() {
    this.plotForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      location: ['', [Validators.required]],
      district: ['', [Validators.required]],
      latitude: [0],
      longitude: [0],
      price: [0, [Validators.required, Validators.min(1)]],
      areaSize: [0, [Validators.required, Validators.min(1)]],
      imageUrl: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.plotForm.valid) {
      this.isLoading = true;
      this.plotService.createPlot(this.plotForm.value).subscribe({
        next: () => {
          this.snackBar.open('Plot submitted for approval!', 'Success', { duration: 3000 });
          this.router.navigate(['/user/dashboard']);
        },
        error: (err) => {
          this.snackBar.open('Submission failed: ' + (err.error?.message || 'Error'), 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
    }
  }
}
