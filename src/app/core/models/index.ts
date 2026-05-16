export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'USER';

export type UserStatus =
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'BLOCKED';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  status: UserStatus;
  phoneNumber?: string;
  walletAddress?: string;
  governmentId?: string;
  address?: string;
  profileImage?: string;
  isActive: boolean;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  data: { access_token: string; refresh_token?: string; user: User };
}

export type PlotStatus =
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'MINTED';

export interface Plot {
  id: string;
  title: string;
  description: string;
  location: string;
  district: string;
  latitude: number;
  longitude: number;
  price: number;
  areaSize: number;
  imageUrl: string;
  documents?: string[];
  status: PlotStatus;
  rejectionReason?: string;
  ipfsHash?: string;
  tokenId?: string;
  transactionHash?: string;
  metadataUri?: string;
  ipfsCid?: string;
  isMinted: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
}
