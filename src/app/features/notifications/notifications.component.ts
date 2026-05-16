import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatChipsModule
  ],
  template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="mb-0 fw-bold">Notification Center</h2>
        <button mat-stroked-button color="primary" (click)="markAllAsRead()">
          Mark all as read
        </button>
      </div>

      <mat-card class="border-0 shadow-sm rounded-3">
        <mat-card-content class="p-0">
          <div *ngIf="notifications.length === 0" class="text-center py-5">
            <mat-icon class="display-1 text-muted">notifications_off</mat-icon>
            <p class="text-muted mt-2">You're all caught up! No new notifications.</p>
          </div>

          <mat-list class="notification-list">
            <ng-container *ngFor="let note of notifications; let last = last">
              <mat-list-item class="py-3 px-4" [class.unread]="!note.isRead">
                <mat-icon matListItemIcon [ngClass]="note.type" class="note-icon">
                  {{getIcon(note.type)}}
                </mat-icon>
                <div matListItemTitle class="fw-bold d-flex justify-content-between align-items-center">
                  <span>{{note.title}}</span>
                  <span class="tiny text-muted fw-normal">{{note.timestamp | date:'short'}}</span>
                </div>
                <div matListItemLine class="text-secondary mt-1 pe-5">{{note.message}}</div>
                <div matListItemMeta>
                  <button mat-icon-button color="primary" *ngIf="!note.isRead" (click)="markAsRead(note)">
                    <mat-icon>done</mat-icon>
                  </button>
                </div>
              </mat-list-item>
              <mat-divider *ngIf="!last"></mat-divider>
            </ng-container>
          </mat-list>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .notification-list { background: transparent; }
    .unread { background: rgba(63, 81, 181, 0.03); }
    .note-icon.info { color: #2196f3; }
    .note-icon.success { color: #4caf50; }
    .note-icon.warning { color: #ff9800; }
    .note-icon.error { color: #f44336; }
    .tiny { font-size: 11px; }
  `]
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [
    { 
      id: '1', title: 'Plot Approved', message: 'Your property "Luxury Villa" has been approved by the admin.', 
      type: 'success', timestamp: new Date().toISOString(), isRead: false 
    },
    { 
      id: '2', title: 'NFT Minting Success', message: 'The NFT for "Modern Studio" has been successfully minted on-chain.', 
      type: 'info', timestamp: new Date(Date.now() - 3600000).toISOString(), isRead: true 
    },
    { 
      id: '3', title: 'Action Required', message: 'Please re-upload your ID document for verification.', 
      type: 'warning', timestamp: new Date(Date.now() - 86400000).toISOString(), isRead: false 
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  getIcon(type: string): string {
    switch(type) {
      case 'success': return 'check_circle';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'info';
    }
  }

  markAsRead(note: Notification) {
    note.isRead = true;
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.isRead = true);
  }
}
