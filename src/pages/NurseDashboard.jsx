import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Trash2 } from 'lucide-react';
import { useNurseContext } from '../components/nurse/NurseContext';
import '../styles/NurseDashboard.css';

// Using Twitter's Flat Vector Emojis (Twemoji) to avoid the 3D Windows native look
// while keeping it colorful and not "too simple".
const getTwemojiUrl = (hex) => `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${hex}.svg`;

const TOOLS = [
  { id: 'growth', title: 'Calculadora Z', desc: 'Crescimento e Desenvolvimento', iconUrl: getTwemojiUrl('1f4c8'), path: '/calculadora-z', bg: '#EFF6FF', border: '#BFDBFE', textColor: '#1D4ED8' },
  { id: 'exam', title: 'Exame Físico', desc: 'Avaliação Clínica da Criança', iconUrl: getTwemojiUrl('1fa7a'), path: '/exame-fisico', bg: '#ECFDF5', border: '#A7F3D0', textColor: '#065F46' },
  { id: 'milestones', title: 'Marcos (MS)', desc: 'Saúde e Desenvolvimento Infantil', iconUrl: getTwemojiUrl('1f476'), path: '/marcos-ms', bg: '#FFFBEB', border: '#FDE68A', textColor: '#92400E' },
  { id: 'mchat', title: 'M-CHAT-R/F', desc: 'Saúde Neurodesen­volvimental', iconUrl: getTwemojiUrl('1f9e0'), path: '/mchat', bg: '#F5F3FF', border: '#DDD6FE', textColor: '#5B21B6' },
  { id: 'summary', title: 'Gerador de Resumo', desc: 'Documentação Clínica Rápida', iconUrl: getTwemojiUrl('1f4cb'), path: '/resumo', bg: '#FFF1F2', border: '#FECDD3', textColor: '#9F1239' }
];

const NurseDashboard = () => {
  const navigate = useNavigate();
  const { clearData } = useNurseContext();

  const handleClearSession = () => {
    if(window.confirm("Deseja realmente limpar os dados da sessão atual? Isso zerará as calculadoras e o resumo.")) {
      clearData();
    }
  };

  return (
    <div className="nurse-dashboard-page">
      {/* Header */}
      <header className="nurse-dash-header">
        <div className="nurse-dash-header-inner">
          <div className="nurse-dash-title-block">
            <img src="/assets/logo.png" alt="MARCOS Logo" className="nurse-dash-logo" />
            <div>
              <h1 className="nurse-dash-title">Perfil Profissional</h1>
              <p className="nurse-dash-subtitle">Cuidando da saúde das crianças</p>
            </div>
          </div>
          <button onClick={handleClearSession} className="nurse-dash-clear-btn">
            <Trash2 size={15} /> Nova Consulta
          </button>
        </div>
      </header>

      <main className="nurse-dash-main">
        <p className="nurse-dash-section-label">Ferramentas Clínicas</p>
        <div className="nurse-tools-grid">
          {TOOLS.map((tool, idx) => {
            const isFullWidth = idx === TOOLS.length - 1 && TOOLS.length % 2 !== 0;
            return (
              <div
                key={tool.id}
                onClick={() => navigate(tool.path)}
                className={`nurse-tool-card ${isFullWidth ? 'nurse-tool-card--full' : ''}`}
                style={{ backgroundColor: tool.bg, borderColor: tool.border }}
              >
                <div className="nurse-tool-icon" style={{ backgroundColor: 'rgba(255,255,255,0.6)', padding: '12px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <img src={tool.iconUrl} alt={tool.title} style={{ width: '38px', height: '38px', objectFit: 'contain' }} />
                </div>
                <div className="nurse-tool-text">
                  <h2 className="nurse-tool-title" style={{ color: tool.textColor, fontSize: '16px' }}>{tool.title}</h2>
                  <p className="nurse-tool-desc" style={{ color: tool.textColor, opacity: 0.8 }}>{tool.desc}</p>
                </div>
                <div className="nurse-tool-arrow" style={{ color: tool.textColor }}>
                  <ChevronRight size={22} />
                </div>
              </div>
            );
          })}
        </div>

        <p className="nurse-dash-footer-note">
          🔒 Nenhum dado paciente é salvo no servidor
        </p>
      </main>
    </div>
  );
};

export default NurseDashboard;
