import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
        <button
          mat-icon-button
          routerLink="/user/dashboard"
          class="me-3 bg-white shadow-sm"
        >
          <mat-icon>arrow_back</mat-icon>
        </button>

        <div>
          <h1 class="mb-0 fw-bold display-6">
            Register New Property
          </h1>

          <p class="text-muted mb-0">
            Submit property details for verification and NFT minting.
          </p>
        </div>
      </div>

      <div class="row g-4">

        <!-- LEFT -->
        <div class="col-lg-8">

          <mat-card class="shadow-sm border-0 rounded-4 overflow-hidden">

            <mat-progress-bar
              *ngIf="isLoading"
              mode="indeterminate"
            ></mat-progress-bar>

            <mat-card-content class="p-4 p-md-5">

              <form
                [formGroup]="plotForm"
                (ngSubmit)="onSubmit()"
              >

                <!-- PROPERTY -->
                <div class="d-flex align-items-center mb-4">
                  <div class="step-badge me-3">1</div>

                  <h5 class="mb-0 fw-bold text-primary">
                    Property Information
                  </h5>
                </div>

                <div class="row g-3 mb-3">

                  <div class="col-md-6">
                    <mat-form-field appearance="outline" class="w-100">
                      <mat-label>Plot Name</mat-label>

                      <input
                        matInput
                        formControlName="plotName"
                        placeholder="Sunshine Valley"
                      />

                      <mat-icon matSuffix>home</mat-icon>
                    </mat-form-field>
                  </div>

                  <div class="col-md-6">
                    <mat-form-field appearance="outline" class="w-100">
                      <mat-label>Registration Number</mat-label>

                      <input
                        matInput
                        formControlName="registrationNumber"
                        placeholder="REG-98765"
                      />

                      <mat-icon matSuffix>badge</mat-icon>
                    </mat-form-field>
                  </div>

                </div>

                <div class="row g-3 mb-3">

                  <div class="col-md-6">
                    <mat-form-field appearance="outline" class="w-100">
                      <mat-label>Survey Number</mat-label>

                      <input
                        matInput
                        formControlName="surveyNumber"
                        placeholder="SN-12345"
                      />

                      <mat-icon matSuffix>numbers</mat-icon>
                    </mat-form-field>
                  </div>

                  <div class="col-md-6">
                    <mat-form-field appearance="outline" class="w-100">
                      <mat-label>Area Size</mat-label>

                      <input
                        matInput
                        formControlName="areaSize"
                        placeholder="1200 sq ft"
                      />

                      <mat-icon matSuffix>square_foot</mat-icon>
                    </mat-form-field>
                  </div>

                </div>

                <mat-form-field appearance="outline" class="w-100 mb-3">
                  <mat-label>Description</mat-label>

                  <textarea
                    matInput
                    rows="4"
                    formControlName="description"
                    placeholder="Property description"
                  ></textarea>
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-100 mb-4">
                  <mat-label>Address</mat-label>

                  <textarea
                    matInput
                    rows="2"
                    formControlName="address"
                    placeholder="123 MG Road"
                  ></textarea>

                  <mat-icon matSuffix>location_on</mat-icon>
                </mat-form-field>

                <!-- LOCATION -->
                <div class="d-flex align-items-center mb-4 pt-2">
                  <div class="step-badge me-3">2</div>

                  <h5 class="mb-0 fw-bold text-primary">
                    Location Details
                  </h5>
                </div>

                <div class="row g-3 mb-3">

                  <div class="col-md-4">
                    <mat-form-field appearance="outline" class="w-100">
                      <mat-label>District</mat-label>

                      <input
                        matInput
                        formControlName="district"
                        placeholder="Bangalore"
                      />
                    </mat-form-field>
                  </div>

                  <div class="col-md-4">
                    <mat-form-field appearance="outline" class="w-100">
                      <mat-label>State</mat-label>

                      <input
                        matInput
                        formControlName="state"
                        placeholder="Karnataka"
                      />
                    </mat-form-field>
                  </div>

                  <div class="col-md-4">
                    <mat-form-field appearance="outline" class="w-100">
                      <mat-label>Country</mat-label>

                      <input
                        matInput
                        formControlName="country"
                        placeholder="India"
                      />
                    </mat-form-field>
                  </div>

                </div>

                <div class="row g-3 mb-4">

                  <div class="col-md-6">
                    <mat-form-field appearance="outline" class="w-100">
                      <mat-label>Latitude</mat-label>

                      <input
                        matInput
                        type="number"
                        formControlName="latitude"
                      />

                      <mat-icon matSuffix>my_location</mat-icon>
                    </mat-form-field>
                  </div>

                  <div class="col-md-6">
                    <mat-form-field appearance="outline" class="w-100">
                      <mat-label>Longitude</mat-label>

                      <input
                        matInput
                        type="number"
                        formControlName="longitude"
                      />

                      <mat-icon matSuffix>public</mat-icon>
                    </mat-form-field>
                  </div>

                </div>

                <!-- VALUE -->
                <div class="d-flex align-items-center mb-4 pt-2">
                  <div class="step-badge me-3">3</div>

                  <h5 class="mb-0 fw-bold text-primary">
                    Market Information
                  </h5>
                </div>

                <mat-form-field appearance="outline" class="w-100 mb-4">
                  <mat-label>Market Value</mat-label>

                  <input
                    matInput
                    type="number"
                    formControlName="marketValue"
                    placeholder="5000000"
                  />

                  <mat-icon matPrefix>attach_money</mat-icon>
                </mat-form-field>

                <!-- FILES -->
                <div class="d-flex align-items-center mb-4 pt-2">
                  <div class="step-badge me-3">4</div>

                  <h5 class="mb-0 fw-bold text-primary">
                    Upload Documents
                  </h5>
                </div>

                <!-- PROPERTY IMAGES -->
                <div class="mb-4">

                  <label class="fw-semibold mb-2 d-block">
                    Property Images
                  </label>

                  <input
                    type="file"
                    multiple
                    class="form-control"
                    (change)="onPropertyImagesSelected($event)"
                    accept="image/*"
                  />

                </div>

                <!-- LEGAL DOCS -->
                <div class="mb-4">

                  <label class="fw-semibold mb-2 d-block">
                    Legal Documents
                  </label>

                  <input
                    type="file"
                    multiple
                    class="form-control"
                    (change)="onLegalDocumentsSelected($event)"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />

                </div>

                <div
                  class="alert alert-info border-0 rounded-3 mb-4 d-flex align-items-center"
                >
                  <mat-icon class="me-3">
                    verified_user
                  </mat-icon>

                  <small>
                    All submitted information must match official legal records.
                  </small>
                </div>

                <div class="d-grid">
                  <button
                    mat-raised-button
                    color="primary"
                    type="submit"
                    [disabled]="plotForm.invalid || isLoading"
                    class="py-3 rounded-3"
                  >
                    Submit Property
                  </button>
                </div>

              </form>

            </mat-card-content>

          </mat-card>

        </div>

        <!-- RIGHT -->
        <div class="col-lg-4">

          <mat-card class="bg-primary text-white shadow-sm border-0 rounded-4 mb-4">

            <mat-card-content class="p-4">

              <h6 class="fw-bold mb-3 d-flex align-items-center">
                <mat-icon class="me-2">tips_and_updates</mat-icon>
                Tips
              </h6>

              <ul class="small ps-3 mb-0">
                <li class="mb-2">
                  Ensure registration details are accurate.
                </li>

                <li class="mb-2">
                  Upload clear property images.
                </li>

                <li class="mb-2">
                  Legal documents improve verification speed.
                </li>

                <li>
                  Review process may take 24-72 hours.
                </li>
              </ul>

            </mat-card-content>

          </mat-card>

        </div>

      </div>

    </div>
  `,
  styles: [`
    .step-badge {
      width: 28px;
      height: 28px;
      background: #3f51b5;
      color: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
    }
  `]
})
export class CreatePlotComponent {

  private fb = inject(FormBuilder);
  private plotService = inject(PlotService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoading = false;

  propertyImages: File[] = [];
  legalDocuments: File[] = [];

  plotForm: FormGroup = this.fb.group({
    registrationNumber: ['', Validators.required],
    surveyNumber: ['', Validators.required],
    plotName: ['', Validators.required],
    description: ['', Validators.required],

    address: ['', Validators.required],
    district: ['', Validators.required],
    state: ['', Validators.required],
    country: ['', Validators.required],

    latitude: [null, Validators.required],
    longitude: [null, Validators.required],

    areaSize: ['', Validators.required],
    marketValue: [null, Validators.required]
  });

  onPropertyImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      this.propertyImages = Array.from(input.files);
    }
  }

  onLegalDocumentsSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      this.legalDocuments = Array.from(input.files);
    }
  }

  onSubmit(): void {

    if (this.plotForm.invalid) {
      this.plotForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formData = new FormData();

    Object.entries(this.plotForm.value).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    this.propertyImages.forEach(file => {
      formData.append('propertyImages', file);
    });

    this.legalDocuments.forEach(file => {
      formData.append('legalDocuments', file);
    });

    this.plotService.createPlot(formData).subscribe({
      next: () => {
        this.snackBar.open(
          'Property submitted successfully!',
          'Close',
          { duration: 3000 }
        );

        this.router.navigate(['/user/dashboard']);
      },

      error: (err) => {
        this.snackBar.open(
          err?.error?.message || 'Failed to submit property',
          'Close',
          { duration: 3000 }
        );

        this.isLoading = false;
      },

      complete: () => {
        this.isLoading = false;
      }
    });
  }
}