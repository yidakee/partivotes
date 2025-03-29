import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { WalletProvider } from './contexts/WalletContext';
import { ThemeProvider } from './contexts/ThemeContext';
import PollList from './components/polls/PollList';
import PollDetail from './components/polls/PollDetail';
import PollCreate from './components/polls/PollCreate';
import './styles/standard-theme.css';
import './styles/futuristic-theme.css';

function App() {
  return (
    <ThemeProvider>
      <WalletProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<PollList />} />
            <Route path="/polls" element={<PollList />} />
            <Route path="/polls/create" element={<PollCreate />} />
            <Route path="/poll/:id" element={<PollDetail />} />
          </Routes>
        </Layout>
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App;
