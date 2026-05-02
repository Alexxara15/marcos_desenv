import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NurseToolPage = ({ title, subtitle, children }) => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', width: '100%', maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box', fontFamily: 'Inter, sans-serif', paddingBottom: '80px' }}>
      <header style={{ background: 'white', borderBottom: '1px solid #F1F5F9', position: 'sticky', top: 0, zIndex: 50, width: '100%', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 16px', boxSizing: 'border-box', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <button 
              onClick={() => navigate('/painel')}
              style={{ padding: '8px', borderRadius: '50%', border: 'none', background: '#F1F5F9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#475569' }}
            >
              <ArrowLeft size={22} />
            </button>
            <div style={{ minWidth: 0 }}>
              <h1 style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</h1>
              <p style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500, margin: 0 }}>{subtitle}</p>
            </div>
          </div>
          <img 
            src="/assets/logo.png" 
            alt="MARCOS Logo" 
            style={{ height: '40px', width: 'auto', objectFit: 'contain', flexShrink: 0 }}
          />
        </div>
      </header>

      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '20px 16px', boxSizing: 'border-box', width: '100%' }}>
        {children}
      </main>
    </div>
  );
};

export default NurseToolPage;
