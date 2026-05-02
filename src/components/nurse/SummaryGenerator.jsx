import React, { useState } from 'react';
import { useNurseContext } from './NurseContext';
import { FileText, Copy, CheckCircle2, AlertTriangle } from 'lucide-react';

const SummaryGenerator = () => {
  const { data, clearData } = useNurseContext();
  const [copied, setCopied] = useState(false);

  const generateText = () => {
    let summary = `RESUMO DA CONSULTA DE PUERICULTURA\nData: ${new Date().toLocaleDateString('pt-BR')}\n\n`;

    // Growth
    if (data.growth.ageMonths || data.growth.weight) {
      summary += `1. ANTROPOMETRIA E CRESCIMENTO\n`;
      summary += `- Idade: ${data.growth.ageMonths || '--'} meses\n`;
      summary += `- Peso: ${data.growth.weight || '--'} kg | Altura: ${data.growth.height || '--'} cm | PC: ${data.growth.headCircumference || '--'} cm\n`;
      if (data.growth.bmi) {
        summary += `- IMC: ${data.growth.bmi} (Escore-Z Estimado: ${data.growth.zScore})\n`;
      }
      summary += `\n`;
    }

    // Exam
    summary += `2. EXAME FÍSICO (Cefalocaudal)\n`;
    const examFields = [
      { id: 'skin', label: 'Pele' },
      { id: 'head', label: 'Cabeça' },
      { id: 'eyes', label: 'Olhos' },
      { id: 'ears', label: 'Ouvidos' },
      { id: 'mouth', label: 'Boca' },
      { id: 'chest', label: 'Cardiopulmonar' },
      { id: 'abdomen', label: 'Abdome' },
      { id: 'genitals', label: 'Genitália' },
      { id: 'extremities', label: 'Extremidades' },
      { id: 'neurological', label: 'Neurológico' },
    ];
    
    let anyAltered = false;
    examFields.forEach(field => {
      const status = data.exam[field.id];
      if (status === 'Alterado') {
        anyAltered = true;
      }
      summary += `- ${field.label}: ${status}\n`;
    });
    
    if (data.exam.observations) {
      summary += `OBSERVAÇÕES CLÍNICAS: ${data.exam.observations}\n`;
    }
    summary += `\n`;

    // MCHAT
    const answeredMchat = data.mchat.answers.filter(a => a !== null).length;
    if (answeredMchat > 0) {
      summary += `3. RASTREIO DE DESENVOLVIMENTO (M-CHAT-R/F)\n`;
      summary += `- Perguntas respondidas: ${answeredMchat}/20\n`;
      summary += `- Pontuação: ${data.mchat.score} falhas\n`;
      summary += `- Risco Identificado: ${data.mchat.risk}\n\n`;
    }

    summary += `---\nGerado por MARCOS - Guia Clínico Interativo`;
    return summary;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateText());
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      clearData();
    }, 2000);
  };

  return (
    <div className="summary-generator bg-gradient-to-br from-indigo-50 to-sky-50 p-6 rounded-2xl shadow-sm border border-indigo-100">
      <div className="flex items-center justify-between mb-6 border-b border-indigo-200/50 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center bg-indigo-100 shadow-inner">
            <img src="https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f4cb.svg" alt="Ícone de Prancheta" className="w-8 h-8 object-contain drop-shadow-sm" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Magia do Resumo</h3>
            <p className="text-sm text-indigo-600/80 font-medium">Pronto para o Prontuário</p>
          </div>
        </div>
        
        <button 
          onClick={handleCopy}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all ${
            copied ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 hover:-translate-y-1'
          }`}
        >
          {copied ? <><CheckCircle2 size={20} /> Copiado!</> : <><Copy size={20} /> Copiar Resumo</>}
        </button>
      </div>

      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-inner">
        <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700 leading-relaxed custom-scrollbar max-h-[400px] overflow-y-auto">
          {generateText()}
        </pre>
      </div>
      
      <p className="text-xs text-center text-slate-400 mt-4 font-medium flex justify-center items-center gap-1">
        <AlertTriangle size={12} /> Lembre-se: Nenhum dado paciente foi salvo no banco de dados. Cole no PEC oficial.
      </p>
    </div>
  );
};

export default SummaryGenerator;
