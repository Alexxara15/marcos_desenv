import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Layout from './components/Layout';
import Profile from './pages/Profile';
import Milestones from './pages/Milestones';
import MchatTracker from './pages/MchatTracker';
import HealthDiary from './pages/HealthDiary';
import Education from './pages/Education';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import NurseDashboard from './pages/NurseDashboard';
import NurseConsultation from './pages/NurseConsultation';
import './App.css';

import GrowthCalculator from './components/nurse/GrowthCalculator';
import PhysicalExamChecklist from './components/nurse/PhysicalExamChecklist';
import MilestonesGuide from './components/nurse/MilestonesGuide';
import MchatCalculator from './components/nurse/MchatCalculator';
import SummaryGenerator from './components/nurse/SummaryGenerator';
import NurseToolPage from './pages/NurseToolPage';
import { NurseProvider } from './components/nurse/NurseContext';

function AppContent() {
  const { userRole } = useAppContext();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true);

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

  if (!userRole) {
    return (
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  }

  if (userRole === 'parent' && !hasSeenOnboarding) {
    return (
      <BrowserRouter>
        <Onboarding onComplete={handleCompleteOnboarding} />
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      {userRole === 'nurse' ? (
        <NurseProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/painel" replace />} />
              <Route path="painel" element={<NurseDashboard />} />
            </Route>
            
            <Route path="/calculadora-z" element={<NurseToolPage title="Calculadora Z" subtitle="Vigilância do Crescimento"><GrowthCalculator /></NurseToolPage>} />
            <Route path="/exame-fisico" element={<NurseToolPage title="Exame Físico" subtitle="Checklist Cefalocaudal"><PhysicalExamChecklist /></NurseToolPage>} />
            <Route path="/marcos-ms" element={<NurseToolPage title="Marcos do Desenvolvimento" subtitle="Diretrizes do MS"><MilestonesGuide /></NurseToolPage>} />
            <Route path="/mchat" element={<NurseToolPage title="M-CHAT-R/F" subtitle="Rastreio de Autismo"><MchatCalculator /></NurseToolPage>} />
            <Route path="/resumo" element={<NurseToolPage title="Gerar Resumo" subtitle="Copiar para Prontuário"><SummaryGenerator /></NurseToolPage>} />
            
            <Route path="*" element={<Navigate to="/painel" replace />} />
          </Routes>
        </NurseProvider>
      ) : (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Profile />} />
            <Route path="perfil" element={<Profile />} />
            <Route path="marcos" element={<Milestones />} />
            <Route path="mchat" element={<MchatTracker />} />
            <Route path="diario" element={<HealthDiary />} />
            <Route path="educacao" element={<Education />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      )}
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
