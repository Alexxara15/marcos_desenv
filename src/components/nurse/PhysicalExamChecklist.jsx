import React from 'react';
import { useNurseContext } from './NurseContext';
import { CheckCircle2, AlertCircle, Stethoscope } from 'lucide-react';

const EXAM_ITEMS = [
  { id: 'skin', label: 'Pele e Mucosas', normal: 'Corada, hidratada, sem lesões' },
  { id: 'head', label: 'Cabeça e Fontanelas', normal: 'Normocéfalo, fontanela anterior plana e normotensa' },
  { id: 'eyes', label: 'Olhos (Reflexo Vermelho)', normal: 'Reflexo vermelho presente bilateralmente, sem estrabismo' },
  { id: 'ears', label: 'Ouvidos e Audição', normal: 'Orelhas bem implantadas, responde a sons' },
  { id: 'mouth', label: 'Boca e Dentes', normal: 'Palato íntegro, mucosa úmida' },
  { id: 'chest', label: 'Ausculta Cardiopulmonar', normal: 'Murmúrio vesicular presente, bulhas rítmicas e normofonéticas, sem sopros' },
  { id: 'abdomen', label: 'Abdome e Umbigo', normal: 'Flácido, indolor, sem visceromegalias, coto umbilical sem sinais de infecção' },
  { id: 'genitals', label: 'Genitália', normal: 'Típica, sem alterações' },
  { id: 'extremities', label: 'Membros e Quadril', normal: 'Pulsos presentes, manobras de Ortolani/Barlow negativas' },
  { id: 'neurological', label: 'Neurológico (Reflexos)', normal: 'Tônus adequado, reflexos primitivos compatíveis com a idade' }
];

const PhysicalExamChecklist = () => {
  const { data, updateExam } = useNurseContext();
  const exam = data.exam;

  const handleToggle = (id, status) => {
    updateExam({ [id]: status });
  };

  const handleObsChange = (e) => {
    updateExam({ observations: e.target.value });
  };

  return (
    <div className="physical-exam bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
          <Stethoscope size={24} />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Checklist Rápido: Exame Físico</h3>
      </div>

      <div className="space-y-4">
        {EXAM_ITEMS.map((item) => (
          <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
            <div className="mb-3 md:mb-0">
              <h4 className="font-bold text-slate-700">{item.label}</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-md">Esperado: {item.normal}</p>
            </div>
            
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => handleToggle(item.id, 'Normal')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  exam[item.id] === 'Normal' 
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' 
                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 size={18} /> Normal
              </button>
              <button
                onClick={() => handleToggle(item.id, 'Alterado')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  exam[item.id] === 'Alterado' 
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' 
                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <AlertCircle size={18} /> Alterado
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
        <label className="block text-sm font-semibold text-slate-600 mb-2">Observações (Se houver alterações)</label>
        <textarea 
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          rows="3"
          placeholder="Descreva aqui qualquer achado clínico alterado que mereça destaque no resumo..."
          value={exam.observations}
          onChange={handleObsChange}
        ></textarea>
      </div>
    </div>
  );
};

export default PhysicalExamChecklist;
