import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Profile from './pages/Profile';
import Milestones from './pages/Milestones';
import MchatTracker from './pages/MchatTracker';
import HealthDiary from './pages/HealthDiary';
import Education from './pages/Education';
import './App.css';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Profile />} />
            <Route path="perfil" element={<Profile />} />
            <Route path="marcos" element={<Milestones />} />
            <Route path="mchat" element={<MchatTracker />} />
            <Route path="diario" element={<HealthDiary />} />
            <Route path="educacao" element={<Education />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
