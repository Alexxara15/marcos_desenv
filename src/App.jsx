import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Profile from './pages/Profile';
import Milestones from './pages/Milestones';
import MchatTracker from './pages/MchatTracker';
import HealthDiary from './pages/HealthDiary';
import Education from './pages/Education';
import Onboarding from './pages/Onboarding';
import './App.css';

function AppContent() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true); // Default true until checked

  useEffect(() => {
    const seen = localStorage.getItem('saude_infantil_onboarded');
    if (!seen) {
      setHasSeenOnboarding(false);
    }
  }, []);

  const handleCompleteOnboarding = () => {
    localStorage.setItem('saude_infantil_onboarded', 'true');
    setHasSeenOnboarding(true);
  };

  if (!hasSeenOnboarding) {
    return (
      <BrowserRouter>
        <Onboarding onComplete={handleCompleteOnboarding} />
      </BrowserRouter>
    );
  }

  return (
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
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
