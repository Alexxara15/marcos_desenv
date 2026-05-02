import React, { createContext, useContext, useState } from 'react';

const NurseContext = createContext();

export const useNurseContext = () => useContext(NurseContext);

export const NurseProvider = ({ children }) => {
  const DEFAULT_STATE = {
    growth: {
      ageMonths: '',
      weight: '',
      height: '',
      headCircumference: '',
      bmi: null,
      zScore: null,
    },
    exam: {
      skin: 'Normal',
      head: 'Normal',
      eyes: 'Normal',
      ears: 'Normal',
      mouth: 'Normal',
      chest: 'Normal',
      abdomen: 'Normal',
      genitals: 'Normal',
      extremities: 'Normal',
      neurological: 'Normal',
      observations: '',
    },
    mchat: {
      score: 0,
      risk: '',
      answers: Array(20).fill(null), // true for pass, false for fail
    },
    milestones: {
      achieved: [],
      alerts: [],
    }
  };

  const [consultationData, setConsultationData] = useState(DEFAULT_STATE);

  const updateGrowth = (data) => setConsultationData(prev => ({ ...prev, growth: { ...prev.growth, ...data } }));
  const updateExam = (data) => setConsultationData(prev => ({ ...prev, exam: { ...prev.exam, ...data } }));
  const updateMchat = (data) => setConsultationData(prev => ({ ...prev, mchat: { ...prev.mchat, ...data } }));
  const updateMilestones = (data) => setConsultationData(prev => ({ ...prev, milestones: { ...prev.milestones, ...data } }));
  const clearData = () => setConsultationData(DEFAULT_STATE);

  return (
    <NurseContext.Provider value={{
      data: consultationData,
      updateGrowth,
      updateExam,
      updateMchat,
      updateMilestones,
      clearData
    }}>
      {children}
    </NurseContext.Provider>
  );
};
