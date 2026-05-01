import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { mchatQuestions, calculateMchatScore, getRiskLevel } from '../data/mchat';
import { ChevronLeft, CheckCircle2, Circle, AlertTriangle, FileText, ArrowLeft } from 'lucide-react';

const MchatTracker = () => {
  const { activeChild, updateChild } = useAppContext();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (activeChild && activeChild.mchat) {
      setAnswers(activeChild.mchat);
      if (Object.keys(activeChild.mchat).length === mchatQuestions.length) {
        setShowResults(true);
      }
    }
  }, [activeChild]);

  if (!activeChild) {
    return (
      <div className="dashboard-content" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <p>Por favor, selecione ou adicione uma criança no início.</p>
      </div>
    );
  }

  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    updateChild(activeChild.id, { mchat: newAnswers });
  };

  const handleComplete = () => {
    window.scrollTo(0, 0);
    setShowResults(true);
  };

  const score = calculateMchatScore(answers);
  const risk = getRiskLevel(score);
  const progress = Math.round((Object.keys(answers).length / mchatQuestions.length) * 100);
  const isComplete = Object.keys(answers).length === mchatQuestions.length;

  if (showResults) {
    return (
      <div className="animate-fade-in pb-20">
        <div style={{ backgroundColor: risk.color === 'green' ? '#ecfdf5' : risk.color === 'orange' ? '#fffbeb' : '#fef2f2', padding: '2rem 1rem', textAlign: 'center', borderBottom: `4px solid ${risk.color === 'green' ? '#10b981' : risk.color === 'orange' ? '#f59e0b' : '#ef4444'}` }}>
          <AlertTriangle size={48} color={risk.color === 'green' ? '#10b981' : risk.color === 'orange' ? '#f59e0b' : '#ef4444'} style={{ margin: '0 auto', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937' }}>Resultado da Avaliação</h1>
          <p style={{ marginTop: '0.5rem', color: '#4b5563' }}>Criança: {activeChild.name}</p>
        </div>

        <div className="dashboard-content" style={{ marginTop: '1.5rem' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: risk.color === 'green' ? '#10b981' : risk.color === 'orange' ? '#f59e0b' : '#ef4444' }}>
              {score}
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937' }}>{risk.level}</h2>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#4b5563', lineHeight: 1.5 }}>
              {risk.text}
            </p>
          </div>

          <div className="alert-card" style={{ marginTop: '1rem', backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }}>
            <FileText className="alert-icon" style={{ color: '#0ea5e9' }} />
            <div>
              <h3 className="alert-title">Aviso Importante</h3>
              <p className="alert-text">Este questionário é apenas para rastreamento e não substitui o diagnóstico médico. Mostre este resultado ao pediatra do seu filho.</p>
            </div>
          </div>

          <button 
            onClick={() => setShowResults(false)}
            className="btn-dashed"
            style={{ marginTop: '1rem' }}
          >
            Revisar Respostas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-20" style={{ backgroundColor: '#faf5ff', minHeight: '100vh' }}>
      <div style={{ position: 'relative' }}>
        <button onClick={() => navigate('/')} style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10, background: 'rgba(255,255,255,0.8)', padding: '0.5rem', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }}>
          <ArrowLeft size={24} color="#1f2937" />
        </button>
        <img src="/assets/mchat_header.png" alt="Sinais de Autismo" className="header-banner" style={{ height: '160px' }} />
      </div>

      <div className="dashboard-content">
        <div className="glass-panel profile-card" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <h1 className="profile-name" style={{ color: '#6b21a8' }}>Sinais de Autismo (TEA)</h1>
          <p className="profile-age mt-1" style={{ color: '#9333ea' }}>Interação e comportamento de {activeChild.name}</p>
          
          <div style={{ width: '100%', marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem', color: '#7e22ce' }}>
              <span>Progresso</span>
              <span>{progress}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#f3e8ff', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--color-brincar)', transition: 'width 0.3s ease' }}></div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#f3e8ff', border: '1px solid #e9d5ff', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem', color: '#6b21a8' }}>
          Responda a estas perguntas sobre o comportamento de seu filho de modo a refletir o que ele faz <strong>habitualmente</strong>.
        </div>

        {mchatQuestions.map((q, index) => {
          const answer = answers[q.id];
          return (
            <div key={q.id} className="card" style={{ margin: '0 0 1rem 0' }}>
              <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--color-brincar)', marginRight: '0.5rem' }}>{index + 1}.</span>
                {q.text}
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button 
                  onClick={() => handleAnswer(q.id, 'sim')}
                  style={{
                    padding: '0.75rem', borderRadius: '0.5rem', border: '2px solid',
                    fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s',
                    borderColor: answer === 'sim' ? 'var(--color-brincar)' : 'var(--color-border)',
                    backgroundColor: answer === 'sim' ? '#faf5ff' : 'transparent',
                    color: answer === 'sim' ? '#7e22ce' : 'var(--color-text-muted)'
                  }}
                >
                  Sim
                </button>
                <button 
                  onClick={() => handleAnswer(q.id, 'nao')}
                  style={{
                    padding: '0.75rem', borderRadius: '0.5rem', border: '2px solid',
                    fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s',
                    borderColor: answer === 'nao' ? 'var(--color-brincar)' : 'var(--color-border)',
                    backgroundColor: answer === 'nao' ? '#faf5ff' : 'transparent',
                    color: answer === 'nao' ? '#7e22ce' : 'var(--color-text-muted)'
                  }}
                >
                  Não
                </button>
              </div>
            </div>
          );
        })}

        <button 
          onClick={handleComplete}
          disabled={!isComplete}
          className="btn-primary"
          style={{ 
            opacity: isComplete ? 1 : 0.5, 
            marginTop: '1rem', 
            padding: '1rem',
            backgroundColor: isComplete ? 'var(--color-brincar)' : '',
            borderColor: isComplete ? 'var(--color-brincar)' : ''
          }}
        >
          {isComplete ? 'Ver Resultado' : 'Responda todas para ver o resultado'}
        </button>
      </div>
    </div>
  );
};

export default MchatTracker;
