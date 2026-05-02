import React, { useState } from 'react';
import { Target, Flag, PlayCircle, AlertTriangle } from 'lucide-react';

const MILESTONES_DATA = [
  {
    age: '2 meses',
    tests: ['Observar o sorriso social', 'Acompanhar o movimento de um objeto 180º', 'Elevar a cabeça em pronação'],
    redFlags: ['Não reage a sons fortes', 'Não fixa o olhar', 'Não leva as mãos à boca']
  },
  {
    age: '4 meses',
    tests: ['Observar gargalhadas', 'Agarrar objetos', 'Sustentação da cabeça firme', 'Rolar sobre o abdome'],
    redFlags: ['Não sorri para as pessoas', 'Não sustenta a cabeça', 'Não acompanha com os olhos']
  },
  {
    age: '6 meses',
    tests: ['Sentar com apoio', 'Transferir objetos de uma mão para a outra', 'Balbuciar (dada, baba)'],
    redFlags: ['Não tenta pegar objetos', 'Não demonstra afeto', 'Dificuldade de levar objetos à boca']
  },
  {
    age: '9 meses',
    tests: ['Sentar sem apoio', 'Engatinhar ou se arrastar', 'Fazer "tchau" ou bater palmas', 'Movimento de pinça'],
    redFlags: ['Não senta com apoio', 'Não balbucia', 'Não responde ao próprio nome']
  },
  {
    age: '12 meses',
    tests: ['Andar com apoio', 'Falar 1 ou 2 palavras', 'Entregar um objeto quando solicitado'],
    redFlags: ['Não engatinha', 'Não procura objetos escondidos', 'Não aponta']
  }
];

const MilestonesGuide = () => {
  const [activeTab, setActiveTab] = useState(MILESTONES_DATA[0].age);

  const currentMilestone = MILESTONES_DATA.find(m => m.age === activeTab);

  return (
    <div className="milestones-guide bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8 border-b border-amber-100 pb-6">
        <div className="w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center bg-amber-100 shadow-inner">
          <img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f476.svg" alt="Ícone de Bebê" className="w-10 h-10 object-contain drop-shadow-sm" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Guia de Marcos do Desenvolvimento</h3>
          <p className="text-sm text-slate-500">Consulta Rápida por Faixa Etária</p>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 mb-6 pb-2 custom-scrollbar">
        {MILESTONES_DATA.map(m => (
          <button
            key={m.age}
            onClick={() => setActiveTab(m.age)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === m.age 
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            {m.age}
          </button>
        ))}
      </div>

      {currentMilestone && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
            <h4 className="flex items-center gap-2 font-bold text-emerald-800 mb-4">
              <PlayCircle size={20} /> Como Testar (Esperado)
            </h4>
            <ul className="space-y-3">
              {currentMilestone.tests.map((test, idx) => (
                <li key={idx} className="flex items-start gap-3 text-emerald-900 font-medium text-sm bg-white p-3 rounded-xl shadow-sm">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 text-xs">{idx + 1}</span>
                  {test}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-rose-50 rounded-2xl p-5 border border-rose-100">
            <h4 className="flex items-center gap-2 font-bold text-rose-800 mb-4">
              <AlertTriangle size={20} /> Sinais de Alerta (Red Flags)
            </h4>
            <ul className="space-y-3">
              {currentMilestone.redFlags.map((flag, idx) => (
                <li key={idx} className="flex items-start gap-3 text-rose-900 font-medium text-sm bg-white p-3 rounded-xl shadow-sm">
                  <span className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0"><Flag size={14} /></span>
                  {flag}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestonesGuide;
