import { Injectable, signal } from '@angular/core';
import { BrowserProvider, ethers } from 'ethers';

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  walletAddress = signal<string | null>(null);
  private provider: BrowserProvider | null = null;

  constructor() {
    this.checkConnection();
  }

  async connectWallet(): Promise<string | null> {
    if ((window as any).ethereum) {
      try {
        this.provider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await this.provider.send("eth_requestAccounts", []);
        this.walletAddress.set(accounts[0]);
        return accounts[0];
      } catch (error) {
        console.error("User denied account access", error);
        return null;
      }
    } else {
      alert("MetaMask is not installed!");
      return null;
    }
  }

  async checkConnection() {
    if ((window as any).ethereum) {
      this.provider = new ethers.BrowserProvider((window as any).ethereum);
      const accounts = await this.provider.send("eth_accounts", []);
      if (accounts.length > 0) {
        this.walletAddress.set(accounts[0]);
      }
    }
  }

  async getSigner() {
    if (!this.provider) {
      await this.connectWallet();
    }
    return this.provider?.getSigner();
  }
}
