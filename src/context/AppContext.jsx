import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [childrenProfiles, setChildrenProfiles] = useState(() => {
    const saved = localStorage.getItem('saude_infantil_profiles');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeChildId, setActiveChildId] = useState(() => {
    const saved = localStorage.getItem('saude_infantil_active_child');
    return saved ? saved : null;
  });

  useEffect(() => {
    localStorage.setItem('saude_infantil_profiles', JSON.stringify(childrenProfiles));
  }, [childrenProfiles]);

  useEffect(() => {
    if (activeChildId) {
      localStorage.setItem('saude_infantil_active_child', activeChildId);
    } else {
      localStorage.removeItem('saude_infantil_active_child');
    }
  }, [activeChildId]);

  const addChild = (childData) => {
    const newChild = {
      id: Date.now().toString(),
      ...childData,
      milestones: {}, // { "2meses": { "sorri_social": "sim", ... } }
      vaccines: [],
      consultations: [],
      growth: []
    };
    setChildrenProfiles([...childrenProfiles, newChild]);
    setActiveChildId(newChild.id);
  };

  const updateChild = (childId, updatedData) => {
    setChildrenProfiles(prev => prev.map(child => 
      child.id === childId ? { ...child, ...updatedData } : child
    ));
  };

  const activeChild = childrenProfiles.find(c => c.id === activeChildId);

  const deleteChild = (childId) => {
    const updatedProfiles = childrenProfiles.filter(c => c.id !== childId);
    setChildrenProfiles(updatedProfiles);
    if (activeChildId === childId) {
      setActiveChildId(updatedProfiles.length > 0 ? updatedProfiles[0].id : null);
    }
  };

  return (
    <AppContext.Provider value={{
      childrenProfiles,
      activeChildId,
      setActiveChildId,
      activeChild,
      addChild,
      updateChild,
      deleteChild
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
