import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PlotService } from '../../core/services/plot.service';

@Component({
  selector: 'app-plot-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-2xl mx-auto">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-slate-900">Add New Property</h1>
        <p class="text-slate-500">Enter the details of the property you want to tokenize.</p>
      </div>

      <form [formGroup]="plotForm" (ngSubmit)="onSubmit()" class="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="col-span-2">
            <label class="block text-sm font-medium text-slate-700 mb-1">Property Title</label>
            <input type="text" formControlName="title" placeholder="e.g. Luxury Villa in Beverly Hills"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
          </div>

          <div class="col-span-2">
            <label class="block text-sm font-medium text-slate-700 mb-1">Location</label>
            <input type="text" formControlName="location" placeholder="Full Address"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Price (USD)</label>
            <input type="number" formControlName="price" placeholder="0.00"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Image URL (Optional)</label>
            <input type="text" formControlName="imageUrl" placeholder="https://..."
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
          </div>

          <div class="col-span-2">
            <label class="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea formControlName="description" rows="4" placeholder="Detailed property description..."
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end space-x-4 pt-4 border-t border-slate-100">
          <button type="button" routerLink="/dashboard" 
            class="px-6 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button type="submit" [disabled]="plotForm.invalid || loading"
            class="px-6 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors">
            {{ loading ? 'Creating...' : 'Create Property' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class PlotCreateComponent {
  plotForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private plotService: PlotService,
    private router: Router
  ) {
    this.plotForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
    });
  }

  onSubmit(): void {
    if (this.plotForm.valid) {
      this.loading = true;
      this.plotService.createPlot(this.plotForm.value).subscribe({
        next: (plot) => {
          this.router.navigate(['/plots', plot.id]);
        },
        error: () => {
          this.loading = false;
          alert('Failed to create property plot.');
        }
      });
    }
  }
}
