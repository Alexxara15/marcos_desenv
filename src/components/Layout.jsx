import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Target, Puzzle, HeartPulse, BookOpen, UserCircle } from 'lucide-react';

const Layout = () => {
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

      <nav className={`bottom-nav ${showNav ? '' : 'hidden'}`}>
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
      </nav>
    </div>
  );
};

export default Layout;
