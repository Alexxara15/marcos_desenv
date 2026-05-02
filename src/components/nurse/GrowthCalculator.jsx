import React, { useState, useEffect } from 'react';
import { useNurseContext } from './NurseContext';
import { Activity, Ruler, Scale } from 'lucide-react';

const GrowthCalculator = () => {
  const { data, updateGrowth } = useNurseContext();
  const [localData, setLocalData] = useState(data.growth);

  useEffect(() => {
    // Simple mock logic for BMI and Z-score estimation based on standard WHO formulas
    if (localData.weight && localData.height) {
      const w = parseFloat(localData.weight);
      const h = parseFloat(localData.height) / 100; // in meters
      const bmi = (w / (h * h)).toFixed(1);
      
      let zScore = 0; // Mocked simple z-score based on BMI
      if (bmi < 14) zScore = -2;
      else if (bmi < 15) zScore = -1;
      else if (bmi < 18) zScore = 0;
      else if (bmi < 20) zScore = 1;
      else zScore = 2;

      updateGrowth({ ...localData, bmi, zScore });
    } else {
      updateGrowth({ ...localData, bmi: null, zScore: null });
    }
  }, [localData.weight, localData.height, localData.ageMonths]);

  const handleChange = (field, value) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="growth-calculator bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8 border-b border-sky-100 pb-6">
        <div className="w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center bg-sky-100 shadow-inner">
          <img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f4c8.svg" alt="Ícone de Crescimento" className="w-10 h-10 object-contain drop-shadow-sm" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Calculadora de Vigilância do Crescimento</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Idade (Meses)</label>
            <input 
              type="number" 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Ex: 6"
              value={localData.ageMonths}
              onChange={(e) => handleChange('ageMonths', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1 flex items-center gap-2">
                <Scale size={16} className="text-sky-500"/> Peso (kg)
              </label>
              <input 
                type="number" 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Ex: 7.5"
                value={localData.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1 flex items-center gap-2">
                <Ruler size={16} className="text-sky-500"/> Altura (cm)
              </label>
              <input 
                type="number" 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Ex: 65"
                value={localData.height}
                onChange={(e) => handleChange('height', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">Perímetro Cefálico (cm)</label>
            <input 
              type="number" 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Ex: 43"
              value={localData.headCircumference}
              onChange={(e) => handleChange('headCircumference', e.target.value)}
            />
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 flex flex-col justify-center items-center text-center border border-slate-100">
          <h4 className="text-slate-500 font-semibold mb-4">Resultado Imediato</h4>
          {data.growth.bmi ? (
            <div className="space-y-4 w-full">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                <span className="text-slate-600 font-medium">IMC</span>
                <span className="text-2xl font-bold text-sky-600">{data.growth.bmi}</span>
              </div>
              
              <div className={`p-4 rounded-xl text-white font-bold transition-all duration-300 ${
                data.growth.zScore <= -2 ? 'bg-red-500' : 
                data.growth.zScore >= 2 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}>
                {data.growth.zScore <= -2 ? 'Alerta: Escore-Z Baixo (<-2)' : 
                 data.growth.zScore >= 2 ? 'Atenção: Escore-Z Alto (>+2)' : 'Escore-Z Adequado'}
              </div>

              <div className="relative pt-6">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>-3</span>
                  <span>0</span>
                  <span>+3</span>
                </div>
                <div className="h-3 w-full bg-gradient-to-r from-red-400 via-emerald-400 to-amber-400 rounded-full relative">
                  <div 
                    className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow border-2 border-slate-800 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
                    style={{ left: `${((data.growth.zScore + 3) / 6) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-400 text-sm">
              <Activity size={48} className="mx-auto mb-3 opacity-20" />
              Preencha peso e altura para calcular
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrowthCalculator;
