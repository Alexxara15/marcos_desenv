import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { milestonesData } from '../data/milestones';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

const Milestones = () => {
  const { activeChild, updateChild } = useAppContext();
  const [selectedAge, setSelectedAge] = useState(milestonesData[0].id);

  if (!activeChild) {
    return (
      <div className="dashboard-content" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <p>Por favor, selecione ou adicione uma criança no início.</p>
      </div>
    );
  }

  const ageData = milestonesData.find(m => m.id === selectedAge);
  const childMilestones = activeChild.milestones || {};
  const currentAnswers = childMilestones[selectedAge] || {};

  const handleAnswer = (questionId, answer) => {
    const updatedAnswers = { ...currentAnswers, [questionId]: answer };
    const updatedMilestones = { ...childMilestones, [selectedAge]: updatedAnswers };
    updateChild(activeChild.id, { milestones: updatedMilestones });
  };

  // Helper function to count progress
  const getProgress = () => {
    let totalQuestions = 0;
    let answeredQuestions = 0;
    ageData.areas.forEach(area => {
      totalQuestions += area.questions.length;
      area.questions.forEach(q => {
        if (currentAnswers[q.id]) answeredQuestions++;
      });
    });
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  const progress = getProgress();

  return (
    <div className="animate-fade-in pb-20" style={{ backgroundColor: '#fffbeb', minHeight: '100vh' }}>
      <img src="/assets/milestones_header.png" alt="Marcos do Desenvolvimento" className="header-banner" style={{ height: '140px' }} />
      
      <div className="dashboard-content">
        <div className="glass-panel profile-card">
          <div style={{ width: '100%' }}>
            <h1 className="profile-name">Marcos do Desenvolvimento</h1>
            <p className="profile-age mt-1">Avaliação para {activeChild.name}</p>
            
            <div style={{ marginTop: '1rem' }}>
              <label className="form-label" style={{ color: '#b45309', fontWeight: 700 }}>Selecione a idade:</label>
              <select 
                className="profile-select" 
                style={{ width: '100%', padding: '0.75rem', fontWeight: 600 }}
                value={selectedAge}
                onChange={(e) => setSelectedAge(e.target.value)}
              >
                {milestonesData.map(age => (
                  <option key={age.id} value={age.id}>{age.title}</option>
                ))}
              </select>
            </div>
            
            {progress > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem', color: 'var(--color-text-muted)' }}>
                  <span>Progresso da avaliação</span>
                  <span>{progress}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#fef3c7', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--color-desenvolver)', transition: 'width 0.3s ease' }}></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {ageData.areas.map(area => (
          <div key={area.id} className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid #fef3c7' }}>
            <div style={{ backgroundColor: '#fef3c7', padding: '1rem', borderBottom: '1px solid #fde68a' }}>
              <h2 style={{ fontSize: '1.125rem', color: '#b45309', fontWeight: 800 }}>{area.title}</h2>
            </div>
            
            <div style={{ padding: '1rem' }}>
              {area.questions.map((q, index) => {
                const answer = currentAnswers[q.id];
                return (
                  <div key={q.id} style={{ marginBottom: index === area.questions.length - 1 ? 0 : '1.5rem' }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.75rem', color: '#1f2937' }}>
                      {q.text}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleAnswer(q.id, 'sim')}
                        className="btn-option"
                        style={{ 
                          backgroundColor: answer === 'sim' ? '#d1fae5' : 'transparent',
                          borderColor: answer === 'sim' ? '#10b981' : 'var(--color-border)',
                          color: answer === 'sim' ? '#047857' : 'var(--color-text-muted)'
                        }}
                      >
                        <CheckCircle2 size={18} />
                        Sim
                      </button>
                      <button 
                        onClick={() => handleAnswer(q.id, 'ainda_nao')}
                        className="btn-option"
                        style={{ 
                          backgroundColor: answer === 'ainda_nao' ? '#fee2e2' : 'transparent',
                          borderColor: answer === 'ainda_nao' ? '#ef4444' : 'var(--color-border)',
                          color: answer === 'ainda_nao' ? '#b91c1c' : 'var(--color-text-muted)'
                        }}
                      >
                        <Circle size={18} />
                        Ainda não
                      </button>
                      <button 
                        onClick={() => handleAnswer(q.id, 'nao_sei')}
                        className="btn-option"
                        style={{ 
                          backgroundColor: answer === 'nao_sei' ? '#fef3c7' : 'transparent',
                          borderColor: answer === 'nao_sei' ? '#f59e0b' : 'var(--color-border)',
                          color: answer === 'nao_sei' ? '#b45309' : 'var(--color-text-muted)'
                        }}
                      >
                        <AlertCircle size={18} />
                        Não sei
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            As informações aqui registradas ajudam no acompanhamento, mas não substituem a avaliação de um pediatra.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Milestones;
