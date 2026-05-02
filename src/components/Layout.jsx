import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Target, Puzzle, HeartPulse, BookOpen, UserCircle, Home, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Layout = () => {
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { userRole, logout } = useAppContext();

  const location = useLocation();
  const isNurseConsultation = userRole !== 'parent' && location.pathname !== '/painel';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Se rolou para baixo mais de 10px e não está no topo
      if (currentScrollY > lastScrollY + 10 && currentScrollY > 50) {
        setShowNav(false);
      } 
      // Se rolou para cima (qualquer quantidade) ou está bem no topo
      else if (currentScrollY < lastScrollY - 5 || currentScrollY < 50) {
        setShowNav(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className="app-container">
      <main className="main-content">
        <Outlet />
      </main>

      {!isNurseConsultation && (
        <nav className={`bottom-nav ${showNav ? '' : 'hidden'}`}>
          {userRole === 'parent' ? (
            <>
              {/* Pilar 4: Desenvolver (Amarelo) */}
              <NavLink to="/marcos" className={({ isActive }) => `nav-item nav-item-desenvolver ${isActive ? 'active' : ''}`}>
                <Target className="nav-icon" size={24} />
                <span>Marcos</span>
              </NavLink>
              
              {/* Pilar 3: Brincar (Roxo) */}
              <NavLink to="/mchat" className={({ isActive }) => `nav-item nav-item-brincar ${isActive ? 'active' : ''}`}>
                <Puzzle className="nav-icon" size={24} />
                <span>Interação</span>
              </NavLink>
              
              {/* Pilar 1: Crescer (Azul) */}
              <NavLink to="/diario" className={({ isActive }) => `nav-item nav-item-crescer ${isActive ? 'active' : ''}`}>
                <HeartPulse className="nav-icon" size={24} />
                <span>Saúde</span>
              </NavLink>
              
              {/* Pilar 2: Aprender (Verde) */}
              <NavLink to="/educacao" className={({ isActive }) => `nav-item nav-item-aprender ${isActive ? 'active' : ''}`}>
                <BookOpen className="nav-icon" size={24} />
                <span>Dicas</span>
              </NavLink>

              {/* Aba Extra: Perfil */}
              <NavLink to="/perfil" className={({ isActive }) => `nav-item nav-item-perfil ${isActive ? 'active' : ''}`}>
                <UserCircle className="nav-icon" size={24} />
                <span>Perfil</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/painel" className={({ isActive }) => `nav-item nav-item-crescer ${isActive ? 'active' : ''}`}>
                <Home className="nav-icon" size={24} />
                <span>Painel</span>
              </NavLink>
              
              <button onClick={logout} className="nav-item text-danger flex flex-col items-center justify-center bg-transparent border-none" style={{ color: 'var(--color-danger)' }}>
                <LogOut className="nav-icon" size={24} />
                <span>Sair</span>
              </button>
            </>
          )}
        </nav>
      )}
    </div>
  );
};

export default Layout;
