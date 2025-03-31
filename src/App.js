import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { WalletProvider } from './contexts/WalletContext';
import { ThemeProvider } from './contexts/ThemeContext';
import PollList from './components/polls/PollList';
import PollDetail from './components/polls/PollDetail';
import PollCreate from './components/polls/PollCreate';
import './styles/standard-theme.css';
import './styles/futuristic-theme.css';
import { POLL_STATUS } from './utils/constants';

function App() {
  // Add debug info to console
  console.log('== App.js ==');
  console.log('POLL_STATUS constants:', POLL_STATUS);
  console.log('Current URL:', window.location.href);
  console.log('Hostname:', window.location.hostname);
  console.log('Path:', window.location.pathname);
  
  return (
    <ThemeProvider>
      <WalletProvider>
        <Layout>
          <Routes>
            {/* Redirect root to active polls */}
            <Route path="/" element={<Navigate to="/polls/active" replace />} />
            
            {/* Poll list routes with specific statuses - using standard lowercase paths */}
            <Route path="/polls" element={<Navigate to="/polls/active" replace />} />
            <Route path="/polls/active" element={<PollList statusFilter={POLL_STATUS.ACTIVE} />} />
            <Route path="/polls/pending" element={<PollList statusFilter={POLL_STATUS.PENDING} />} />
            <Route path="/polls/finished" element={<PollList statusFilter={POLL_STATUS.ENDED} />} />
            <Route path="/polls/ended" element={<PollList statusFilter={POLL_STATUS.ENDED} />} />
            
            {/* Fallback routes for uppercase paths - seen in production */}
            <Route path="/polls/ACTIVE" element={<PollList statusFilter={POLL_STATUS.ACTIVE} />} />
            <Route path="/polls/PENDING" element={<PollList statusFilter={POLL_STATUS.PENDING} />} />
            <Route path="/polls/ENDED" element={<PollList statusFilter={POLL_STATUS.ENDED} />} />
            
            {/* Additional fallbacks for case variations */}
            <Route path="/polls/Active" element={<PollList statusFilter={POLL_STATUS.ACTIVE} />} />
            <Route path="/polls/Pending" element={<PollList statusFilter={POLL_STATUS.PENDING} />} />
            <Route path="/polls/Ended" element={<PollList statusFilter={POLL_STATUS.ENDED} />} />
            <Route path="/polls/Finished" element={<PollList statusFilter={POLL_STATUS.ENDED} />} />
            <Route path="/polls/FINISHED" element={<PollList statusFilter={POLL_STATUS.ENDED} />} />
            
            {/* Keep backward compatibility with URL parameters */}
            <Route path="/polls/status/:status" element={<PollList />} />
            
            {/* Other routes */}
            <Route path="/polls/create" element={<PollCreate />} />
            <Route path="/poll/:id" element={<PollDetail />} />
            
            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/polls/active" replace />} />
          </Routes>
        </Layout>
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App;
