export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'USER';

export enum UserStatus {
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  BLOCKED = 'BLOCKED'
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  isActive: boolean;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
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
