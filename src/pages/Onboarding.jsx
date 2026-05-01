import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ChevronRight, Baby, ArrowRight } from 'lucide-react';

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const { addChild } = useAppContext();
  const navigate = useNavigate();

  // Formulário da criança
  const [newChildData, setNewChildData] = useState({ name: '', birthDate: '', isPremature: false, weeksPremature: 0, color: '' });
  const avatarColors = ['#f59e0b', '#10b981', '#8b5cf6', '#1273eb', '#ec4899', '#14b8a6'];

  const slides = [
    {
      title: "Bem-vindo ao MARCOS",
      text: "O aplicativo perfeito para acompanhar cada etapa mágica do desenvolvimento do seu filho.",
      color: "#1e3a8a", // Dark Blue
      bgColor: "#eff6ff",
      image: "/assets/inicio1.png"
    },
    {
      title: "Desenvolver",
      text: "Acompanhe os marcos de desenvolvimento de 0 a 6 anos com um checklist fácil e rápido.",
      color: "#d97706", // Yellow/Orange
      bgColor: "#fffbeb",
      image: "/assets/inicio2.png"
    },
    {
      title: "Brincar",
      text: "Avalie a interação e o comportamento do seu filho de forma simples para identificar sinais importantes.",
      color: "#7e22ce", // Purple
      bgColor: "#faf5ff",
      image: "/assets/inicio3.png"
    },
    {
      title: "Crescer",
      text: "Mantenha o calendário de vacinação em dia e registre as consultas e o peso do bebê.",
      color: "#1d4ed8", // Blue
      bgColor: "#eff6ff",
      image: "/assets/inicio4.png"
    },
    {
      title: "Aprender",
      text: "Receba dicas valiosas e sugestões de atividades para estimular o aprendizado em casa.",
      color: "#047857", // Green
      bgColor: "#ecfdf5",
      image: "/assets/inicio5.png"
    }
  ];

  const handleNext = () => {
    if (step < slides.length) {
      setStep(step + 1);
    }
  };

  const handleAddChildAndStart = (e) => {
    e.preventDefault();
    if (newChildData.name && newChildData.birthDate) {
      const color = newChildData.color || avatarColors[Math.floor(Math.random() * avatarColors.length)];
      addChild({ ...newChildData, color });
      onComplete(); // Set hasSeenOnboarding = true in App.jsx
      navigate('/marcos'); // Vai para a primeira aba conforme pedido
    }
  };

  // Se estivermos na tela de adicionar criança (último step)
  if (step === slides.length) {
    return (
      <div className="animate-fade-in" style={{ backgroundColor: '#f0f9ff', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '2rem 1.5rem', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/assets/logo.png" alt="MARCOS" style={{ width: '100px', height: 'auto', marginBottom: '1rem', margin: '0 auto' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e3a8a' }}>Vamos começar?</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.5rem' }}>Para personalizar sua experiência, crie o primeiro perfil.</p>
        </div>

        <div className="card" style={{ backgroundColor: '#ffffff', borderRadius: '1.5rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', borderTop: '5px solid #10b981' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Baby color="#10b981" size={24} /> Dados da Criança
          </h2>
          <form onSubmit={handleAddChildAndStart}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700 }}>Nome da Criança</label>
              <input type="text" required className="form-input" placeholder="Ex: Joãozinho" value={newChildData.name} onChange={e => setNewChildData({...newChildData, name: e.target.value})} style={{ borderRadius: '1rem' }} />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700 }}>Data de Nascimento</label>
              <input type="date" required className="form-input" value={newChildData.birthDate} onChange={e => setNewChildData({...newChildData, birthDate: e.target.value})} style={{ borderRadius: '1rem' }} />
            </div>
            
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '1rem' }}>
              <input type="checkbox" id="premature_onboard" checked={newChildData.isPremature} onChange={e => setNewChildData({...newChildData, isPremature: e.target.checked})} style={{ width: '1.5rem', height: '1.5rem', accentColor: '#10b981' }} />
              <label htmlFor="premature_onboard" style={{ fontSize: '0.95rem', color: '#334155', fontWeight: 600, cursor: 'pointer' }}>Nasceu prematuro?</label>
            </div>

            {newChildData.isPremature && (
              <div className="form-group animate-fade-in" style={{ paddingLeft: '1.5rem', borderLeft: '4px solid #10b981', marginTop: '1rem' }}>
                <label className="form-label" style={{ fontWeight: 700 }}>Com quantas semanas?</label>
                <input type="number" required min="20" max="36" className="form-input" placeholder="Ex: 34" value={newChildData.weeksPremature} onChange={e => setNewChildData({...newChildData, weeksPremature: e.target.value})} style={{ borderRadius: '1rem' }} />
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1.5rem', borderRadius: '1rem', padding: '1rem', fontWeight: 800, fontSize: '1rem', backgroundColor: '#10b981', borderColor: '#10b981', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
              Entrar no App <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  const slide = slides[step];

  return (
    <div className="animate-fade-in" style={{ backgroundColor: slide.bgColor, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem', transition: 'background-color 0.5s ease' }}>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: '400px' }}>
        <img 
          src={slide.image} 
          alt={slide.title} 
          onError={(e) => {
            // Fallback caso a imagem ainda não exista na pasta
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
          style={{ width: step === 0 ? '180px' : '150px', height: 'auto', marginBottom: '2rem', objectFit: 'contain' }} 
        />
        <div style={{ display: 'none', fontSize: '5rem', marginBottom: '1.5rem', color: slide.color }}>
          {step === 0 ? '✨' : '⭐'}
        </div>
        
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: slide.color, textAlign: 'center', marginBottom: '1rem', lineHeight: 1.2 }}>
          {slide.title}
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#4b5563', textAlign: 'center', lineHeight: 1.6, fontWeight: 500 }}>
          {slide.text}
        </p>
      </div>

      <div style={{ width: '100%', maxWidth: '400px', paddingBottom: '2rem' }}>
        {/* Indicadores */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          {slides.map((_, i) => (
            <div key={i} style={{ width: i === step ? '24px' : '8px', height: '8px', borderRadius: '4px', backgroundColor: i === step ? slide.color : '#cbd5e1', transition: 'all 0.3s ease' }} />
          ))}
        </div>

        <button 
          onClick={handleNext}
          className="btn-primary"
          style={{ width: '100%', padding: '1rem', borderRadius: '1rem', fontSize: '1.1rem', fontWeight: 800, backgroundColor: slide.color, borderColor: slide.color, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
        >
          {step === 0 ? 'Conhecer o App' : step === slides.length - 1 ? 'Começar Agora' : 'Próximo'}
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
