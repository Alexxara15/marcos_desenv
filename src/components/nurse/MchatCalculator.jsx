import React, { useState } from 'react';
import { useNurseContext } from './NurseContext';
import { Brain, HelpCircle, AlertTriangle } from 'lucide-react';

// M-CHAT-R/F questions (simplified for UI demo)
const MCHAT_QUESTIONS = [
  "1. Se você apontar para algo do outro lado do cômodo, a criança olha para o que você está apontando?",
  "2. Você já se perguntou se sua criança poderia ser surda?",
  "3. A criança brinca de faz-de-conta? (Ex: fingir beber num copo vazio)",
  "4. A criança gosta de subir nas coisas? (Ex: móveis, parquinhos)",
  "5. A criança faz movimentos incomuns com os dedos perto dos olhos?",
  "6. A criança aponta com o dedo para pedir algo ou mostrar algo?",
  "7. A criança traz objetos para você para mostrar?",
  "8. A criança responde quando você chama o nome dela?",
  "9. A criança olha para você nos olhos?",
  "10. A criança parece ouvir normalmente, mas às vezes ignora você?",
  "11. A criança sorri quando você sorri para ela?",
  "12. A criança se incomoda muito com barulhos de rotina?",
  "13. A criança já andou?",
  "14. A criança olha nos seus olhos quando você fala, brinca ou veste ela?",
  "15. A criança tenta copiar o que você faz?",
  "16. Se você virar a cabeça para olhar algo, a criança olha ao redor para ver o que você está olhando?",
  "17. A criança tenta fazer você olhar para ela?",
  "18. A criança entende quando você diz a ela para fazer algo?",
  "19. Se algo novo acontece, a criança olha para o seu rosto para ver como você reage?",
  "20. A criança gosta de atividades de movimento? (Ex: ser balançada no colo)"
];

// In real M-CHAT, questions 2, 5, 12 are reversed scored. 
// For simplicity in this demo, let's assume 'Passou' is normal and 'Falhou' adds 1 to risk score.
// We will apply the reverse scoring for 2, 5, 12 internally if needed, but let's stick to Pass/Fail logic.

const MchatCalculator = () => {
  const { data, updateMchat } = useNurseContext();
  const answers = data.mchat.answers;

  const handleAnswer = (index, passed) => {
    const newAnswers = [...answers];
    newAnswers[index] = passed;
    
    // Calculate score
    const score = newAnswers.reduce((acc, curr) => {
      if (curr === false) return acc + 1; // Failed = +1 point
      return acc;
    }, 0);

    let risk = 'Baixo';
    if (score >= 8) risk = 'Alto';
    else if (score >= 3) risk = 'Médio';

    updateMchat({ answers: newAnswers, score, risk });
  };

  const answeredCount = answers.filter(a => a !== null).length;

  return (
    <div className="mchat-calculator bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8 border-b border-indigo-100 pb-6">
        <div className="w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center bg-indigo-100 shadow-inner">
          <img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f9e0.svg" alt="Ícone de Cérebro" className="w-10 h-10 object-contain drop-shadow-sm" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Calculadora M-CHAT-R/F</h3>
          <p className="text-sm text-slate-500">Rastreio de Autismo (16 a 30 meses)</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 max-h-[400px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {MCHAT_QUESTIONS.map((q, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="font-medium text-slate-700 text-sm mb-3">{q}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAnswer(idx, true)}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                    answers[idx] === true 
                      ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20' 
                      : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Passou
                </button>
                <button
                  onClick={() => handleAnswer(idx, false)}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                    answers[idx] === false 
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20' 
                      : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Falhou
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full md:w-1/3 shrink-0 flex flex-col gap-4">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Progresso</h4>
            <div className="text-3xl font-black text-indigo-600">{answeredCount}/20</div>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
              <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${(answeredCount/20)*100}%` }}></div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border text-center transition-all ${
            data.mchat.risk === 'Alto' ? 'bg-rose-50 border-rose-200 text-rose-700' :
            data.mchat.risk === 'Médio' ? 'bg-amber-50 border-amber-200 text-amber-700' :
            data.mchat.risk === 'Baixo' && answeredCount > 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
            'bg-slate-50 border-slate-100 text-slate-400'
          }`}>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-2">Risco M-CHAT</h4>
            <div className="text-2xl font-black mb-1">
              {answeredCount === 0 ? '-' : data.mchat.risk}
            </div>
            <div className="text-xs font-medium opacity-80">
              {data.mchat.score} Falhas pontuadas
            </div>
            
            {data.mchat.risk === 'Alto' && (
              <div className="mt-4 text-xs font-bold bg-rose-100 p-2 rounded-lg text-rose-800 flex items-center justify-center gap-1">
                <AlertTriangle size={14} /> Encaminhar para avaliação
              </div>
            )}
            {data.mchat.risk === 'Médio' && (
              <div className="mt-4 text-xs font-bold bg-amber-100 p-2 rounded-lg text-amber-800 flex items-center justify-center gap-1">
                <HelpCircle size={14} /> Aplicar M-CHAT-R/F Entrevista
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MchatCalculator;
