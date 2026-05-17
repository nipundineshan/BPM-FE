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
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'minted';

export interface Plot {
  id: string;
  plotName: string;
  description: string;
  surveyNumber: string;
  areaSize: string;
  latitude: number;
  longitude: number;
  address: string;
  district: string;
  state: string;
  country: string;
  marketValue: number;
  registrationNumber: string;
  propertyImages: string[];
  legalDocuments: string[];
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
