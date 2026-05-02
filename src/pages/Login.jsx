import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Stethoscope, Users, HeartPulse, User } from 'lucide-react';
import '../styles/Login.css';

const Login = () => {
  const [view, setView] = useState('select'); // 'select' | 'nurse_login'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleParentLogin = () => {
    login('parent');
  };

  const handleNurseLogin = (e) => {
    e.preventDefault();
    // Simulating authentication
    if (username === 'enfermeiro' && password === 'admin') {
      login('nurse');
    } else {
      setError('Credenciais inválidas. Tente: enfermeiro / admin');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img 
            src="/assets/logo.png" 
            alt="MARCOS Logo" 
            style={{ width: '80px', height: '80px', objectFit: 'contain', margin: '0 auto 20px auto', display: 'block' }} 
          />
          <h1>Saúde e Desenvolvimento</h1>
          <p>Acompanhe o crescimento e desenvolvimento infantil</p>
        </div>

        {view === 'select' ? (
          <div className="login-options">
            <button 
              className="login-option-btn parent-btn"
              onClick={handleParentLogin}
            >
              <Users size={32} />
              <span>Sou Pai, Mãe ou Cuidador</span>
            </button>
            
            <button 
              className="login-option-btn nurse-btn"
              onClick={() => setView('nurse_login')}
            >
              <Stethoscope size={32} />
              <span>Sou Profissional (Enfermeiro)</span>
            </button>
          </div>
        ) : (
          <div className="nurse-login-form">
            <h2>Acesso Profissional</h2>
            <form onSubmit={handleNurseLogin}>
              <div className="input-group">
                <label>Usuário</label>
                <div className="input-wrapper">
                  <User size={20} />
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ex: enfermeiro"
                    required
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Senha</label>
                <div className="input-wrapper">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="***"
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>
              
              {error && <p className="error-message">{error}</p>}
              
              <button type="submit" className="btn-primary w-full mt-4">
                Entrar
              </button>
              
              <button 
                type="button" 
                className="btn-outline w-full mt-3"
                onClick={() => setView('select')}
              >
                Voltar
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
