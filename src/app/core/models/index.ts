export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
  walletAddress?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Plot {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  imageUrl?: string;
  documentUrl?: string;
  ipfsHash?: string;
  tokenId?: string;
  transactionHash?: string;
  status: 'PENDING' | 'IPFS_PINNED' | 'MINTED';
  ownerId: string;
}
