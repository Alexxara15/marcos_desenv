import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { vaccineSchedule } from '../data/vaccines';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Syringe, Stethoscope, LineChart as ChartIcon, Plus, CheckCircle2, Circle } from 'lucide-react';

const HealthDiary = () => {
  const { activeChild, updateChild } = useAppContext();
  const [activeTab, setActiveTab] = useState('vacinas');
  
  // States for new consultation
  const [showAddConsultation, setShowAddConsultation] = useState(false);
  const [newConsultation, setNewConsultation] = useState({ date: '', doctor: '', weight: '', height: '', notes: '' });

  if (!activeChild) {
    return (
      <div className="dashboard-content" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <p>Por favor, selecione ou adicione uma criança no início.</p>
      </div>
    );
  }

  const childVaccines = activeChild.vaccines || {}; // { vaccineId: true/false }
  const childConsultations = activeChild.consultations || [];

  const handleToggleVaccine = (vaccineId) => {
    const updatedVaccines = { ...childVaccines, [vaccineId]: !childVaccines[vaccineId] };
    updateChild(activeChild.id, { vaccines: updatedVaccines });
  };

  const handleAddConsultation = (e) => {
    e.preventDefault();
    const updatedConsultations = [...childConsultations, { id: Date.now().toString(), ...newConsultation }];
    updateChild(activeChild.id, { consultations: updatedConsultations });
    setNewConsultation({ date: '', doctor: '', weight: '', height: '', notes: '' });
    setShowAddConsultation(false);
  };

  // Prepare data for Growth Chart (Weight over time based on consultations)
  const growthData = childConsultations
    .filter(c => c.weight && c.date)
    .map(c => ({
      date: new Date(c.date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
      peso: parseFloat(c.weight),
      timestamp: new Date(c.date).getTime()
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="animate-fade-in pb-20" style={{ backgroundColor: '#eff6ff', minHeight: '100vh' }}>
      <img src="/assets/health_diary_header.png" alt="Diário de Saúde" className="header-banner" style={{ height: '140px' }} />
      
      <div className="dashboard-content">
        <div className="glass-panel profile-card" style={{ padding: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
            <button 
              onClick={() => setActiveTab('vacinas')}
              style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.85rem', backgroundColor: activeTab === 'vacinas' ? '#dbeafe' : 'transparent', color: activeTab === 'vacinas' ? '#1e3a8a' : 'var(--color-text-muted)', transition: 'all 0.2s' }}
            >
              <Syringe size={18} /> Vacinas
            </button>
            <button 
              onClick={() => setActiveTab('consultas')}
              style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.85rem', backgroundColor: activeTab === 'consultas' ? '#dbeafe' : 'transparent', color: activeTab === 'consultas' ? '#1e3a8a' : 'var(--color-text-muted)', transition: 'all 0.2s' }}
            >
              <Stethoscope size={18} /> Consultas
            </button>
            <button 
              onClick={() => setActiveTab('graficos')}
              style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.85rem', backgroundColor: activeTab === 'graficos' ? '#dbeafe' : 'transparent', color: activeTab === 'graficos' ? '#1e3a8a' : 'var(--color-text-muted)', transition: 'all 0.2s' }}
            >
              <ChartIcon size={18} /> Crescer
            </button>
          </div>
        </div>

        {activeTab === 'vacinas' && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '1rem' }}>Calendário Nacional</h2>
            <p style={{ fontSize: '0.85rem', color: '#1e40af', marginBottom: '1rem' }}>Marque as vacinas que {activeChild.name} já tomou.</p>
            
            {vaccineSchedule.map(schedule => (
              <div key={schedule.age} className="card" style={{ padding: '0', marginBottom: '1rem', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#334155' }}>{schedule.age}</h3>
                </div>
                <div style={{ padding: '0.5rem 1rem' }}>
                  {schedule.vaccines.map(vaccine => {
                    const isTaken = childVaccines[vaccine.id];
                    return (
                      <div 
                        key={vaccine.id} 
                        onClick={() => handleToggleVaccine(vaccine.id)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                      >
                        <div>
                          <p style={{ fontSize: '0.9rem', fontWeight: 600, color: isTaken ? 'var(--color-text-muted)' : '#1f2937', textDecoration: isTaken ? 'line-through' : 'none' }}>{vaccine.name}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Previne: {vaccine.disease}</p>
                        </div>
                        <div>
                          {isTaken ? <CheckCircle2 color="var(--color-crescer)" size={24} /> : <Circle color="#cbd5e1" size={24} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'consultas' && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e3a8a' }}>Histórico Médico</h2>
              <button onClick={() => setShowAddConsultation(!showAddConsultation)} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#1e40af', fontSize: '0.85rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                <Plus size={16} /> Nova
              </button>
            </div>

            {showAddConsultation && (
              <div className="card" style={{ border: '2px solid var(--color-secondary-light)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Registrar Consulta</h3>
                <form onSubmit={handleAddConsultation}>
                  <div className="form-group">
                    <label className="form-label">Data</label>
                    <input type="date" required className="form-input" value={newConsultation.date} onChange={e => setNewConsultation({...newConsultation, date: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pediatra / Unidade de Saúde</label>
                    <input type="text" required className="form-input" value={newConsultation.doctor} onChange={e => setNewConsultation({...newConsultation, doctor: e.target.value})} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label className="form-label">Peso (kg)</label>
                      <input type="number" step="0.01" className="form-input" value={newConsultation.weight} onChange={e => setNewConsultation({...newConsultation, weight: e.target.value})} />
                    </div>
                    <div>
                      <label className="form-label">Altura (cm)</label>
                      <input type="number" step="0.1" className="form-input" value={newConsultation.height} onChange={e => setNewConsultation({...newConsultation, height: e.target.value})} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Orientações Médicas</label>
                    <textarea rows="3" className="form-input" value={newConsultation.notes} onChange={e => setNewConsultation({...newConsultation, notes: e.target.value})}></textarea>
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem', backgroundColor: 'var(--color-crescer)', borderColor: 'var(--color-crescer)' }}>Salvar Consulta</button>
                </form>
              </div>
            )}

            {childConsultations.length === 0 && !showAddConsultation ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-text-muted)' }}>
                <Stethoscope size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
                <p>Nenhuma consulta registrada ainda.</p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Mantenha o histórico do pediatra sempre à mão.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[...childConsultations].sort((a, b) => new Date(b.date) - new Date(a.date)).map(consultation => (
                  <div key={consultation.id} className="card" style={{ borderLeft: '4px solid var(--color-crescer)', borderColor: '#bfdbfe' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontWeight: 700, color: '#1f2937' }}>{new Date(consultation.date).toLocaleDateString('pt-BR')}</h4>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{consultation.doctor}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', marginBottom: '0.5rem', backgroundColor: '#f8fafc', padding: '0.5rem', borderRadius: '0.25rem' }}>
                      {consultation.weight && <div><strong>Peso:</strong> {consultation.weight} kg</div>}
                      {consultation.height && <div><strong>Altura:</strong> {consultation.height} cm</div>}
                    </div>
                    {consultation.notes && (
                      <p style={{ fontSize: '0.85rem', color: '#4b5563', whiteSpace: 'pre-wrap' }}>{consultation.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'graficos' && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '1rem' }}>Evolução de Peso</h2>
            
            {growthData.length < 2 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-text-muted)', backgroundColor: '#fffbeb', borderRadius: 'var(--radius-lg)' }}>
                <p>Adicione pelo menos 2 consultas com peso para ver o gráfico de crescimento.</p>
              </div>
            ) : (
              <div className="card" style={{ padding: '1rem 0' }}>
                <div style={{ height: '300px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} tickMargin={10} />
                      <YAxis dataKey="peso" domain={['auto', 'auto']} tick={{ fontSize: 12, fill: '#64748b' }} unit="kg" />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Line type="monotone" dataKey="peso" name="Peso (kg)" stroke="var(--color-crescer)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default HealthDiary;
