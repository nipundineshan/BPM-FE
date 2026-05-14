import { Injectable, signal } from '@angular/core';
import { ethers } from 'ethers';
import { UserService } from './user.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  walletAddress = signal<string | null>(null);
  provider = signal<ethers.BrowserProvider | null>(null);
  signer = signal<ethers.JsonRpcSigner | null>(null);

  constructor(private userService: UserService, private authService: AuthService) {
    this.checkConnection();
  }

  async connectWallet(): Promise<void> {
    if (!window.ethereum) {
      alert('MetaMask is not installed!');
      return;
    }

    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send('eth_requestAccounts', []);
      const walletAddr = accounts[0];
      
      this.walletAddress.set(walletAddr);
      this.provider.set(browserProvider);
      const signerInstance = await browserProvider.getSigner();
      this.signer.set(signerInstance);

      // Sync with backend
      this.userService.updateWallet(walletAddr).subscribe({
        next: (user) => {
          // Update local storage user if needed
          const currentUser = this.authService.currentUser();
          if (currentUser) {
            const updatedUser = { ...currentUser, walletAddress: walletAddr };
            this.authService.currentUser.set(updatedUser);
            localStorage.setItem('auth_user', JSON.stringify(updatedUser));
          }
        },
        error: (err) => console.error('Failed to sync wallet address', err)
      });

    } catch (error) {
      console.error('Error connecting to MetaMask', error);
    }
  }

  private async checkConnection(): Promise<void> {
    if (window.ethereum) {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await browserProvider.listAccounts();
      if (accounts.length > 0) {
        const walletAddr = accounts[0].address;
        this.walletAddress.set(walletAddr);
        this.provider.set(browserProvider);
        const signerInstance = await browserProvider.getSigner();
        this.signer.set(signerInstance);
      }
    }
  }
}

declare global {
  interface Window {
    ethereum: any;
  }
}
