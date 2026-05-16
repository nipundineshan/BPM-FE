# Blockchain-Based Plot Finder & NFT Property Management System

## Project Overview
A modern, production-ready Angular application for managing real estate plots and minting them as NFTs on the Ethereum Sepolia Testnet. This system integrates traditional property listing with blockchain-based ownership verification.

## Tech Stack
- **Frontend Framework**: Angular 18 (Standalone Components)
- **Programming Language**: TypeScript
- **Styling**: Bootstrap 5, SCSS, Bootstrap Icons
- **Blockchain Integration**: ethers.js (v6), MetaMask
- **Authentication**: JWT (JSON Web Token)
- **State Management**: Angular Signals
- **Networking**: Angular HttpClient with Interceptors
- **Form Handling**: Reactive Forms

## Key Features

### 1. Authentication & Security
- **JWT Authentication**: Secure login and registration.
- **Auto-Authorization**: HTTP Interceptor automatically attaches `Authorization: Bearer <token>` to API requests.
- **Route Protection**: `AuthGuard` ensures only authenticated users can access the system.
- **Session Management**: Persistent user sessions using `localStorage` and Signals.

### 2. Dashboard
- Real-time statistics (Total Plots, Minted NFTs).
- Wallet connection status and address display.
- Overview of recent property listings and blockchain activities.

### 3. Property (Plot) Management
- **Create Plot**: Comprehensive form to list new real estate properties including location, price, and area size.
- **Plot Grid**: Responsive list view with search and status filtering (Minted vs. Pending).
- **Detail View**: Rich property profiles with image previews and management actions.

### 4. Blockchain & NFT Workflow
- **MetaMask Integration**: Native wallet connection and account management.
- **IPFS Integration**: Generate and upload decentralized metadata (JSON) for property records.
- **NFT Minting**: Direct smart contract interaction to mint property deeds as NFTs on Sepolia Testnet.
- **Verification**: Display Token IDs and clickable transaction hashes linked to Etherscan.

### 5. Profile Management
- View user-specific profile details.
- Update and manage the linked Ethereum wallet address.
- Private gallery of owned properties and their respective NFT statuses.

## Application Architecture

### Core Layer (`/core`)
- **Services**: `AuthService`, `PlotService`, `NftService`, `UserService`, `Web3Service`.
- **Interceptors**: `AuthInterceptor` for centralized API security.
- **Guards**: `AuthGuard` for navigation security.
- **Models**: Unified TypeScript interfaces for Plots, Users, and API responses.

### Features Layer (`/features`)
- **Auth**: Login and registration logic.
- **Dashboard**: Centralized reporting and state monitoring.
- **Plots**: Property CRUD and listing workflows.
- **Profile**: User-centric data and wallet management.

### Shared Layer (`/shared`)
- **LayoutComponent**: Global application shell with responsive sidebar and authenticated navigation bar.

## API Integration
- **Base URL**: Configurable via `src/environments/environment.ts`
  - **Dev**: `http://localhost:3000/api`
  - **Production**: `https://api.bpm-system.com/api` (configurable)
- **Endpoints**:
  - `POST /api/auth/register` | `POST /api/auth/login`
  - `GET /api/users/profile` | `PATCH /api/users/wallet`
  - `GET /api/plots` | `POST /api/plots` | `POST /api/plots/{id}/ipfs`
  - `POST /api/nft/mint/{plotId}`

---
How to use:
   * Development: Run ng serve or ng build (uses environment.ts).
   * Production: Run ng build --configuration production (uses environment.prod.ts).
