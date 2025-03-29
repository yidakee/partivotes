import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Theme
import theme from './styles/theme';

// Context Providers
import { WalletProvider } from './contexts/WalletContext';

// Layout & Components
import Layout from './components/layout/Layout';
import NotFound from './components/error/NotFound';

// Poll Components
import PollList from './components/polls/PollList';
import PollDetail from './components/polls/PollDetail';
import PollCreate from './components/polls/PollCreate';

// Background Animation
import StarfieldBackground from './components/background/StarfieldBackground';

// Music Player
import MusicPlayer from './components/music/MusicPlayer';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <WalletProvider>
          <Router>
            <StarfieldBackground />
            <Layout>
              <Routes>
                {/* Poll Routes */}
                <Route path="/" element={<PollList />} />
                <Route path="/polls" element={<PollList />} />
                <Route path="/polls/create" element={<PollCreate />} />
                <Route path="/polls/:id" element={<PollDetail />} />
                
                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
            
            {/* Add the music player as a separate component outside the layout */}
            <div style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 9999,
              width: '320px'
            }}>
              <MusicPlayer />
            </div>
          </Router>
        </WalletProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
