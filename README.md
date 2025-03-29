# PartiVotes - Private Voting Platform

## Overview

PartiVotes is an innovative voting platform built on Partisia Blockchain technology, designed to provide secure, transparent, and private voting experiences. The platform features both standard and futuristic user interfaces, with the latter offering an immersive 3D space travel effect that creates a unique user experience.

## Features

- **Dual Themed Interface**:
  - Standard professional theme for everyday use
  - Immersive futuristic theme with 3D space travel starfield effect
  
- **Secure Voting System**:
  - End-to-end encrypted voting using Partisia Blockchain
  - Anonymous vote casting
  - Transparent vote tallying
  
- **Poll Management**:
  - Create and manage polls with customizable options
  - Set voting duration and eligibility criteria
  - Visualize results with interactive charts
  
- **User Experience**:
  - Responsive design across all devices
  - Animated transitions and interactive UI elements
  - Accessibility features for all users
  
- **Wallet Integration**:
  - Connect various blockchain wallets
  - Transaction signing and verification
  - Wallet status indicators

## Technology Stack

### Frontend
- **Framework**: React.js 18.2.0
- **UI Libraries**: 
  - Material UI (MUI) 5.x for component styling
  - Styled-components for custom component styling
- **Routing**: React Router Dom 6.x
- **State Management**: 
  - React Context API
  - Custom hooks
- **Animations**: 
  - Canvas API for starfield effect
  - CSS animations and transitions
- **Data Visualization**: Chart.js with React wrappers

### Backend & Blockchain
- **Blockchain**: Partisia Blockchain (MPC-based hybrid blockchain)
- **Smart Contracts**: ZK Voting contracts
- **Wallet Integration**: Web3.js, Ethers.js
- **Authentication**: JWT-based authentication
- **Data Storage**: IPFS for decentralized data

### Development & Tooling
- **Package Manager**: npm/Node.js
- **Bundler**: Webpack 5.x
- **Transpiler**: Babel 7.x
- **Testing**: Jest, React Testing Library
- **Code Quality**: ESLint, Prettier
- **Build System**: CI/CD with GitHub Actions

### Deployment & Infrastructure
- **Hosting**: Netlify for frontend, dedicated servers for backend
- **Server**: Node.js with Express
- **DevOps**: Docker containers, Systemd services
- **Monitoring**: Prometheus, Grafana

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yidakee/partivotes.git
   cd partivotes
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Update the `.env` file with your configuration values

4. **Start the Development Server**
   ```bash
   npm start
   ```
   Access the application at http://localhost:3000

5. **Production Build**
   ```bash
   npm run build
   ```

6. **Serve Production Build** (requires `serve` package)
   ```bash
   npm install -g serve
   serve -s build
   ```

## System Service Setup

Set up PartiVotes as a system service for continuous operation:

1. **Set Permissions for the Installation Script**
   ```bash
   chmod +x install-service.sh
   ```

2. **Run the Installation Script**
   ```bash
   sudo ./install-service.sh
   ```

3. **Manage the Service**
   ```bash
   # Check status
   systemctl status partivotes
   
   # Start service
   systemctl start partivotes
   
   # Stop service
   systemctl stop partivotes
   
   # Restart service
   systemctl restart partivotes
   ```

## Complete Technology Stack

### Frontend
- **React.js** - UI library
- **Material UI** - Component library
- **React Router** - Navigation management
- **Styled Components** - Component styling
- **Canvas API** - For starfield animations
- **Context API** - State management
- **Web3** - Blockchain interactions
- **Chart.js** - Data visualization

### Backend Integrations
- **Partisia Blockchain** - Core voting infrastructure
- **Web3 Provider** - Wallet connections
- **RESTful API** - Data handling
- **JWT** - Authentication

### Development Tools
- **Webpack** - Module bundling
- **Babel** - JavaScript transpilation
- **ESLint** - Code quality
- **Prettier** - Code formatting
- **Jest** - Testing framework

### Deployment
- **Systemd** - Service management
- **NGINX** - Web server (recommended for production)
- **Docker** - Optional containerization

## Project Structure

```
partivotes/
├── public/                 # Static files
│   ├── music/              # Music tracks
│   ├── images/             # Image assets
│   └── index.html          # HTML entry point
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── background/     # Background effects (starfield)
│   │   ├── easter-egg/     # Easter egg features
│   │   ├── layout/         # Layout components
│   │   ├── music/          # Music player components
│   │   ├── polls/          # Poll-related components
│   │   └── wallet/         # Wallet integration components
│   ├── contexts/           # React contexts
│   │   └── ThemeContext.jsx # Theme management
│   ├── forceStarfield.js   # Starfield animation
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── services/           # API services
│   │   └── walletService.js # Wallet integration
│   ├── styles/             # CSS and theme files
│   │   ├── futuristic-theme.css # Futuristic theme styles
│   │   ├── standard-theme.css # Standard theme styles
│   │   └── theme.js        # MUI theme configuration
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Main application component
│   └── index.js            # JavaScript entry point
├── install-service.sh      # Service installation script
├── package.json            # Project dependencies
└── README.md               # Project documentation
```

## Usage

### Theme Switching
Toggle between standard and futuristic themes using the theme switcher in the header. The futuristic theme activates the space travel effect.

### Creating a Poll
1. Navigate to "Create Poll" from the dashboard
2. Fill in poll details and options
3. Set duration and eligibility settings
4. Submit the poll creation transaction

### Voting
1. Browse available polls from the homepage
2. Select a poll to view details
3. Choose your preferred option
4. Confirm your vote with your connected wallet

## Contributing

We welcome contributions to PartiVotes:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Links

- [Live Demo](https://partivotes.xyz)
- [Partisia Blockchain](https://partisiablockchain.com)
- [Documentation](https://docs.partivotes.xyz)
