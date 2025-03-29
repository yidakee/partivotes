# PartiVotes 3000
## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. Clone the repository
```
git clone https://github.com/yidakee/partivotes.git
cd partivotes
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npm start
```

4. Build for production
```
npm run build
```

5. Run the production build (requires serve)
```
npm install -g serve
serve -s build
```

## System Service Setup

The application can be set up to run as a system service:

1. Set proper permissions for the installation script
```
chmod +x install-service.sh
```

2. Run the installation script
```
sudo ./install-service.sh
```

3. Check service status
```
systemctl status partivotes
```

## Technologies Used

- React.js
- Material UI
- React Router

## Project Structure

```
partivotes/
├── public/              # Static files
│   ├── music/           # Music tracks
│   └── images/          # Image assets
├── src/                 # Source code
│   ├── components/      # React components
│   │   ├── layout/      # Layout components
│   │   ├── music/       # Music player components
│   │   └── polls/       # Poll-related components
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── services/        # API services
│   └── utils/           # Utility functions
└── install-service.sh   # Service installation script
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
