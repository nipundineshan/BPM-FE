import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../core/services/admin.service';
import { User } from '../../core/models';

@Component({
  selector: 'app-user-approval',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-slate-900">Pending User Approvals</h1>
        <button (click)="loadPendingUsers()" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
          Refresh List
        </button>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <tr>
              <th class="px-6 py-4">User Email</th>
              <th class="px-6 py-4">Requested Role</th>
              <th class="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr *ngFor="let user of pendingUsers()" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-slate-900">{{ user.email }}</div>
                <div class="text-xs text-slate-500">ID: {{ user.id }}</div>
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium uppercase">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 flex space-x-3">
                <button (click)="onApprove(user.id)" 
                        class="bg-green-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-green-700 transition-colors">
                  Approve
                </button>
                <button (click)="onReject(user.id)" 
                        class="bg-red-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-red-700 transition-colors">
                  Reject
                </button>
              </td>
            </tr>
            <tr *ngIf="pendingUsers().length === 0">
              <td colspan="3" class="px-6 py-10 text-center text-slate-500">No pending approvals at this time.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class UserApprovalComponent implements OnInit {
  pendingUsers = signal<User[]>([]);

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadPendingUsers();
  }

  loadPendingUsers(): void {
    this.adminService.getPendingUsers().subscribe(data => this.pendingUsers.set(data));
  }

  onApprove(id: string): void {
    if (confirm('Are you sure you want to approve this user?')) {
      this.adminService.approveUser(id).subscribe(() => this.loadPendingUsers());
    }
  }

  onReject(id: string): void {
    if (confirm('Are you sure you want to reject this user?')) {
      this.adminService.rejectUser(id).subscribe(() => this.loadPendingUsers());
    }
  }
}
