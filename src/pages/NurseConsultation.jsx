import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, Stethoscope, Target, Brain, FileText } from 'lucide-react';
import { NurseProvider } from '../components/nurse/NurseContext';
import GrowthCalculator from '../components/nurse/GrowthCalculator';
import MilestonesGuide from '../components/nurse/MilestonesGuide';
import PhysicalExamChecklist from '../components/nurse/PhysicalExamChecklist';
import MchatCalculator from '../components/nurse/MchatCalculator';
import SummaryGenerator from '../components/nurse/SummaryGenerator';
import '../styles/NurseConsultation.css';

const TABS = [
  { id: 'growth', label: 'Crescimento', icon: Activity, color: 'text-sky-500' },
  { id: 'exam', label: 'Exame Físico', icon: Stethoscope, color: 'text-emerald-500' },
  { id: 'milestones', label: 'Marcos (MS)', icon: Target, color: 'text-amber-500' },
  { id: 'mchat', label: 'M-CHAT-R/F', icon: Brain, color: 'text-indigo-500' },
  { id: 'summary', label: 'Resumo', icon: FileText, color: 'text-rose-500' },
];

const NurseConsultationContent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  // Auto-scroll to top when tab changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'growth': return <GrowthCalculator />;
      case 'exam': return <PhysicalExamChecklist />;
      case 'milestones': return <MilestonesGuide />;
      case 'mchat': return <MchatCalculator />;
      case 'summary': return <SummaryGenerator />;
      default: return null;
    }
  };

  return (
    <div className="consultation-wizard bg-slate-50 min-h-screen pb-24 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/painel')}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-xl font-black text-slate-800">Guia Clínico Interativo</h1>
                <p className="text-sm font-medium text-slate-500">Ferramentas de Puericultura</p>
              </div>
            </div>
            <img 
              src="/assets/logo.png" 
              alt="MARCOS Logo" 
              className="h-12 w-auto object-contain hidden sm:block"
            />
          </div>

          {/* Desktop & Mobile Tabs */}
          <div className="flex overflow-x-auto gap-2 pb-4 pt-2 custom-scrollbar">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 whitespace-nowrap px-4 py-3 rounded-2xl font-bold transition-all duration-300 flex-1 min-w-[140px] justify-center border-2 ${
                    isActive 
                      ? `bg-white border-slate-200 shadow-md transform -translate-y-1 ${tab.color}` 
                      : 'bg-slate-50/50 border-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                  }`}
                >
                  <Icon size={isActive ? 20 : 18} className={isActive ? '' : 'opacity-70'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
        {renderTabContent()}
      </main>
    </div>
  );
};

const NurseConsultation = () => {
  return (
    <NurseProvider>
      <NurseConsultationContent />
    </NurseProvider>
  );
};

export default NurseConsultation;
