import React, { useState } from 'react';
import { educationData } from '../data/education';
import { BookOpen, Lightbulb } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Education = () => {
  const [activeGroup, setActiveGroup] = useState(0);
  const { activeChild } = useAppContext();

  return (
    <div className="animate-fade-in pb-20" style={{ backgroundColor: '#ecfdf5', minHeight: '100vh' }}>
      <img src="/assets/education_header.png" alt="Dicas e Educação" className="header-banner" style={{ height: '140px' }} />
      
      <div className="dashboard-content">
        <div className="glass-panel profile-card" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div>
              <h1 className="profile-name" style={{ color: '#064e3b' }}>Biblioteca de Dicas</h1>
              <p className="profile-age mt-1" style={{ color: '#047857' }}>Estímulos por faixa etária</p>
            </div>
            <BookOpen color="var(--color-aprender)" size={32} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none' }}>
          {educationData.map((group, index) => (
            <button
              key={index}
              onClick={() => setActiveGroup(index)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-full)',
                whiteSpace: 'nowrap',
                fontWeight: 600,
                fontSize: '0.85rem',
                transition: 'all var(--transition-fast)',
                backgroundColor: activeGroup === index ? 'var(--color-aprender)' : 'white',
                color: activeGroup === index ? 'white' : 'var(--color-text-muted)',
                border: `1px solid ${activeGroup === index ? 'var(--color-aprender)' : '#d1fae5'}`,
                boxShadow: activeGroup === index ? '0 4px 6px -1px rgba(16, 185, 129, 0.3)' : 'none'
              }}
            >
              {group.ageGroup}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {educationData[activeGroup].tips.map((tip, index) => (
            <div key={index} className="card" style={{ margin: 0, borderLeft: '4px solid var(--color-aprender)', borderColor: '#a7f3d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Lightbulb size={20} color="var(--color-aprender)" />
                <h3 style={{ fontWeight: 700, color: '#064e3b' }}>{tip.title}</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#4b5563', lineHeight: 1.5 }}>
                {tip.description}
              </p>
            </div>
          ))}
        </div>

        {/* Seção removida */}

      </div>
    </div>
  );
};

export default Education;
