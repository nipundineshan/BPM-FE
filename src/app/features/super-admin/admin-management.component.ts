import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { User } from '../../core/models';

@Component({
  selector: 'app-admin-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-slate-900">Admin Management</h1>
        <button (click)="showForm.set(true)" 
                class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700">
          Add New Admin
        </button>
      </div>

      <!-- Add Admin Form -->
      <div *ngIf="showForm()" class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Create Administrator</h2>
          <button (click)="showForm.set(false)" class="text-slate-400 hover:text-slate-600">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <form [formGroup]="adminForm" (ngSubmit)="onAddAdmin()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input type="text" formControlName="name" class="w-full px-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" formControlName="email" class="w-full px-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" formControlName="password" class="w-full px-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <input type="text" formControlName="phoneNumber" class="w-full px-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500">
          </div>
          <div class="md:col-span-2 flex justify-end">
            <button type="submit" [disabled]="adminForm.invalid || loading()" 
                    class="bg-primary-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
              {{ loading() ? 'Saving...' : 'Create Admin' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Admin List -->
      <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <tr>
              <th class="px-6 py-4">Name/Email</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr *ngFor="let admin of admins()" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-slate-900">{{ admin.email }}</div>
                <div class="text-xs text-slate-500">{{ admin.id }}</div>
              </td>
              <td class="px-6 py-4">
                <span [ngClass]="admin.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                      class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ admin.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <button (click)="onToggleStatus(admin)" 
                        [ngClass]="admin.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'"
                        class="text-sm font-medium transition-colors">
                  {{ admin.isActive ? 'Deactivate' : 'Activate' }}
                </button>
              </td>
            </tr>
            <tr *ngIf="admins().length === 0">
              <td colspan="3" class="px-6 py-10 text-center text-slate-500">No admin accounts found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AdminManagementComponent implements OnInit {
  admins = signal<User[]>([]);
  showForm = signal(false);
  loading = signal(false);
  adminForm: FormGroup;

  constructor(private adminService: AdminService, private fb: FormBuilder) {
    this.adminForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.adminService.getAdmins().subscribe(data => this.admins.set(data));
  }

  onAddAdmin(): void {
    if (this.adminForm.valid) {
      this.loading.set(true);
      this.adminService.createAdmin(this.adminForm.value).subscribe({
        next: () => {
          this.loadAdmins();
          this.adminForm.reset();
          this.showForm.set(false);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    }
  }

  onToggleStatus(admin: User): void {
    this.adminService.toggleAdminStatus(admin.id, !admin.isActive).subscribe(() => {
      this.loadAdmins();
    });
  }
}
