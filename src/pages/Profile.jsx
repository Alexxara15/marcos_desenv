import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { PlusCircle, FileText, ChevronRight, Check, Sparkles, Smile, Baby, Trash2, Edit2, Link as LinkIcon, Settings, Bell, Moon, Shield } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { calculateMchatScore, getRiskLevel } from '../data/mchat';
import { milestonesData } from '../data/milestones';

const avatarColors = ['#f59e0b', '#10b981', '#8b5cf6', '#1273eb', '#ec4899', '#14b8a6'];

const Profile = () => {
  const { childrenProfiles, activeChild, addChild, updateChild, deleteChild, setActiveChildId } = useAppContext();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newChildData, setNewChildData] = useState({ name: '', birthDate: '', isPremature: false, weeksPremature: 0 });
  
  const [editingChildId, setEditingChildId] = useState(null);
  const [editChildData, setEditChildData] = useState({ name: '', birthDate: '', isPremature: false, weeksPremature: 0, color: '' });

  const [deletingChildId, setDeletingChildId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAddChild = (e) => {
    e.preventDefault();
    if (newChildData.name && newChildData.birthDate) {
      addChild(newChildData);
      setNewChildData({ name: '', birthDate: '', isPremature: false, weeksPremature: 0 });
      setShowAddForm(false);
    }
  };

  const handleStartEdit = (child, index, e) => {
    e.stopPropagation();
    setEditingChildId(child.id);
    setEditChildData({
      name: child.name,
      birthDate: child.birthDate,
      isPremature: child.isPremature || false,
      weeksPremature: child.weeksPremature || 0,
      color: child.color || avatarColors[index % avatarColors.length]
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    updateChild(editingChildId, editChildData);
    setEditingChildId(null);
  };

  const handleDelete = (childId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setDeletingChildId(childId);
  };

  const confirmDelete = (childId, e) => {
    e.preventDefault();
    e.stopPropagation();
    deleteChild(childId);
    setDeletingChildId(null);
  };

  const cancelDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDeletingChildId(null);
  };

  const generatePDF = async () => {
    if (!activeChild) {
      alert("Selecione uma criança primeiro.");
      return;
    }
    
    setIsGenerating(true);
    try {
      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const primaryColor = [14, 165, 233];
      
      pdf.setFillColor(...primaryColor);
      pdf.rect(0, 0, 210, 40, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Relatorio de Saude Infantil', 105, 20, { align: 'center' });
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 105, 30, { align: 'center' });

      pdf.setTextColor(30, 41, 59);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Perfil da Crianca', 20, 55);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Nome: ${activeChild.name}`, 20, 65);
      pdf.text(`Nascimento: ${new Date(activeChild.birthDate).toLocaleDateString('pt-BR')}`, 20, 72);
      if (activeChild.isPremature) {
        pdf.text(`Prematuro: Sim (${activeChild.weeksPremature} semanas)`, 20, 79);
      }

      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Resumo de Marcos', 20, 95);
      
      pdf.setFontSize(10);
      let yPos = 105;
      
      if (activeChild.milestones && Object.keys(activeChild.milestones).length > 0) {
        Object.entries(activeChild.milestones).forEach(([ageId, answers]) => {
          const ageInfo = milestonesData.find(m => m.id === ageId);
          if (ageInfo) {
            pdf.setFont('helvetica', 'bold');
            pdf.text(`Idade: ${ageInfo.title}`, 20, yPos);
            yPos += 7;
            
            let sim = 0, nao = 0, nSei = 0;
            Object.values(answers).forEach(ans => {
              if (ans === 'sim') sim++;
              if (ans === 'ainda_nao') nao++;
              if (ans === 'nao_sei') nSei++;
            });
            
            pdf.setFont('helvetica', 'normal');
            pdf.text(`Atingidos: ${sim} | Ainda nao: ${nao} | Nao observados: ${nSei}`, 25, yPos);
            yPos += 10;
          }
        });
      } else {
        pdf.setFont('helvetica', 'normal');
        pdf.text('Nenhum marco avaliado ainda.', 20, yPos);
        yPos += 10;
      }

      yPos += 5;
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Sinais de Autismo (TEA)', 20, yPos);
      yPos += 10;

      if (activeChild.mchat && Object.keys(activeChild.mchat).length === 20) {
        const score = calculateMchatScore(activeChild.mchat);
        const risk = getRiskLevel(score);
        
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Pontuacao Total: ${score}`, 20, yPos);
        yPos += 8;
        pdf.text(`Classificacao: ${risk.level}`, 20, yPos);
        yPos += 8;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        const splitText = pdf.splitTextToSize(`Orientacao: ${risk.text}`, 170);
        pdf.text(splitText, 20, yPos);
        yPos += (splitText.length * 5) + 5;
      } else {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Questionario nao preenchido ou incompleto.', 20, yPos);
      }

      yPos += 10;
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Ultimas Consultas', 20, yPos);
      yPos += 10;

      if (activeChild.consultations && activeChild.consultations.length > 0) {
        const recent = [...activeChild.consultations].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
        pdf.setFontSize(10);
        recent.forEach(c => {
          pdf.setFont('helvetica', 'bold');
          pdf.text(`Data: ${new Date(c.date).toLocaleDateString('pt-BR')} - Dr(a). ${c.doctor}`, 20, yPos);
          yPos += 5;
          pdf.setFont('helvetica', 'normal');
          pdf.text(`Peso: ${c.weight || '--'} kg | Altura: ${c.height || '--'} cm`, 25, yPos);
          yPos += 8;
        });
      } else {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Nenhuma consulta registrada.', 20, yPos);
      }

      pdf.save('relatorio_saude_infantil.pdf');
    } catch (error) {
      console.error("Erro ao gerar PDF", error);
      alert("Houve um problema ao gerar o PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-fade-in pb-20" style={{ backgroundColor: '#f0f9ff', minHeight: '100vh' }}>
      
      {/* Header com Logo */}
      <div style={{ padding: '1.5rem 1rem 1rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#ffffff', borderBottomLeftRadius: '2rem', borderBottomRightRadius: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <img 
          src="/assets/logo.png" 
          alt="MARCOS Logo" 
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
          style={{ 
            width: '100%', 
            maxWidth: '120px', 
            height: 'auto', 
            objectFit: 'contain',
            marginBottom: '0.25rem' 
          }} 
        />
        <div style={{ display: 'none' }}>
           <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-primary)', letterSpacing: '-1px' }}>MARCOS</h1>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Acompanhe o desenvolvimento do seu filho</p>
      </div>

      <div style={{ padding: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
        
        {/* Seção das Crianças */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Smile color="#f59e0b" size={24} /> Quem vamos acompanhar?
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {childrenProfiles.map((child, index) => {
              const isActive = activeChild?.id === child.id;
              const isEditing = editingChildId === child.id;
              const isDeleting = deletingChildId === child.id;
              const color = child.color || avatarColors[index % avatarColors.length];
              
              if (isEditing) {
                return (
                  <div key={child.id} className="animate-fade-in" style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: `2px solid ${color}` }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem' }}>Editando {child.name}</h3>
                    <form onSubmit={handleSaveEdit}>
                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 700 }}>Nome da Criança</label>
                        <input type="text" required className="form-input" value={editChildData.name} onChange={e => setEditChildData({...editChildData, name: e.target.value})} style={{ borderRadius: '1rem' }} />
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 700 }}>Data de Nascimento</label>
                        <input type="date" required className="form-input" value={editChildData.birthDate} onChange={e => setEditChildData({...editChildData, birthDate: e.target.value})} style={{ borderRadius: '1rem' }} />
                      </div>
                      
                      <div className="form-group" style={{ marginTop: '1rem' }}>
                        <label className="form-label" style={{ fontWeight: 700 }}>Cor do Perfil</label>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                          {avatarColors.map(c => (
                            <div 
                              key={c}
                              onClick={() => setEditChildData({...editChildData, color: c})}
                              style={{
                                width: '36px', height: '36px', borderRadius: '50%', backgroundColor: c, cursor: 'pointer',
                                border: editChildData.color === c ? '3px solid #1e293b' : '3px solid transparent',
                                boxShadow: editChildData.color === c ? 'inset 0 0 0 2px white' : 'none',
                                transition: 'all 0.2s'
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                        <button type="button" onClick={() => setEditingChildId(null)} className="btn-secondary" style={{ flex: 1, borderRadius: '1rem' }}>Cancelar</button>
                        <button type="submit" className="btn-primary" style={{ flex: 1, borderRadius: '1rem', backgroundColor: editChildData.color || color, borderColor: editChildData.color || color }}>Salvar</button>
                      </div>
                    </form>
                  </div>
                );
              }

              return (
                <div 
                  key={child.id} 
                  onClick={() => setActiveChildId(child.id)}
                  style={{ 
                    display: 'flex', flexDirection: 'column',
                    padding: '1rem', cursor: 'pointer',
                    borderRadius: '1.5rem',
                    backgroundColor: '#ffffff',
                    border: isActive ? `3px solid ${color}` : '3px solid transparent',
                    boxShadow: isActive ? `0 10px 25px -5px ${color}40` : '0 4px 6px -1px rgba(0,0,0,0.05)',
                    transform: isActive ? 'scale(1.02)' : 'scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.5rem', boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.2)' }}>
                        {child.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1e293b' }}>{child.name}</h3>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>{new Date(child.birthDate).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    {isActive ? (
                      <div style={{ backgroundColor: color, borderRadius: '50%', padding: '0.25rem', color: 'white' }}>
                        <Check size={20} strokeWidth={3} />
                      </div>
                    ) : (
                      <ChevronRight color="#cbd5e1" size={24} />
                    )}
                  </div>
                  
                  {/* Menu de Ações só aparece no item ativo para manter o visual limpo */}
                  {isActive && !isDeleting && (
                    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                      <button 
                        onClick={(e) => handleStartEdit(child, index, e)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <Edit2 size={14} /> Editar
                      </button>
                      <button 
                        onClick={(e) => handleDelete(child.id, e)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 700, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', marginLeft: '1rem' }}
                      >
                        <Trash2 size={14} /> Excluir
                      </button>
                    </div>
                  )}

                  {/* Confirmação de Exclusão */}
                  {isDeleting && (
                    <div className="animate-fade-in" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed #ef4444' }}>
                      <p style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 700, textAlign: 'center', marginBottom: '1rem' }}>
                        Certeza que deseja excluir {child.name}? Esta ação não pode ser desfeita.
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={cancelDelete} className="btn-secondary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}>Cancelar</button>
                        <button onClick={(e) => confirmDelete(child.id, e)} className="btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', backgroundColor: '#ef4444', borderColor: '#ef4444' }}>Sim, excluir</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Botão Adicionar Criança */}
            {!showAddForm && !editingChildId ? (
              <button 
                onClick={() => setShowAddForm(true)} 
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', 
                  padding: '1rem', borderRadius: '1.5rem', backgroundColor: 'transparent', 
                  border: '3px dashed #cbd5e1', color: '#64748b', fontWeight: 700, fontSize: '1rem',
                  marginTop: childrenProfiles.length > 0 ? '0.5rem' : '0',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
              >
                <PlusCircle size={24} color="#94a3b8" /> Adicionar Criança
              </button>
            ) : null}
          </div>
        </div>

        {/* Formulário de Adição */}
        {showAddForm && (
          <div className="animate-fade-in" style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1.5rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', marginBottom: '2.5rem', borderTop: '5px solid #10b981' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Baby color="#10b981" size={28} /> Novo Perfil
            </h2>
            <form onSubmit={handleAddChild}>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>Nome da Criança</label>
                <input type="text" required className="form-input" placeholder="Como o bebê se chama?" value={newChildData.name} onChange={e => setNewChildData({...newChildData, name: e.target.value})} style={{ borderRadius: '1rem', padding: '0.875rem' }} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>Data de Nascimento</label>
                <input type="date" required className="form-input" value={newChildData.birthDate} onChange={e => setNewChildData({...newChildData, birthDate: e.target.value})} style={{ borderRadius: '1rem', padding: '0.875rem' }} />
              </div>
              
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '1rem' }}>
                <input type="checkbox" id="premature" checked={newChildData.isPremature} onChange={e => setNewChildData({...newChildData, isPremature: e.target.checked})} style={{ width: '1.5rem', height: '1.5rem', accentColor: '#10b981' }} />
                <label htmlFor="premature" style={{ fontSize: '0.95rem', color: '#334155', fontWeight: 600, cursor: 'pointer' }}>Nasceu prematuro?</label>
              </div>

              {newChildData.isPremature && (
                <div className="form-group animate-fade-in" style={{ paddingLeft: '1.5rem', borderLeft: '4px solid #10b981', marginTop: '1rem' }}>
                  <label className="form-label" style={{ fontWeight: 700 }}>Com quantas semanas?</label>
                  <input type="number" required min="20" max="36" className="form-input" placeholder="Ex: 34" value={newChildData.weeksPremature} onChange={e => setNewChildData({...newChildData, weeksPremature: e.target.value})} style={{ borderRadius: '1rem' }} />
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem', fontWeight: 500 }}>Usaremos isso para corrigir a idade nas avaliações.</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary" style={{ flex: 1, borderRadius: '1rem', padding: '0.875rem', fontWeight: 700 }}>Cancelar</button>
                <button type="submit" className="btn-primary" style={{ flex: 2, borderRadius: '1rem', padding: '0.875rem', fontWeight: 700, backgroundColor: '#10b981', borderColor: '#10b981' }}>Salvar Perfil</button>
              </div>
            </form>
          </div>
        )}

        {/* Gerar PDF */}
        {activeChild && !showAddForm && (
          <div className="animate-fade-in" style={{ backgroundColor: '#1273eb', backgroundImage: 'linear-gradient(135deg, #1273eb 0%, #0284c7 100%)', padding: '1.5rem', borderRadius: '1.5rem', color: 'white', boxShadow: '0 10px 25px -5px rgba(14, 165, 233, 0.4)', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={24} /> Imprimir Resumo
              </h3>
              <Sparkles size={24} color="#fef08a" />
            </div>
            <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '1.5rem', lineHeight: 1.5, fontWeight: 500 }}>
              Gere um relatório super bonito em PDF contendo o progresso de <strong>{activeChild.name}</strong> para levar ao pediatra.
            </p>
            <button 
              onClick={generatePDF}
              disabled={isGenerating}
              style={{ 
                width: '100%', padding: '1rem', borderRadius: '1rem', 
                backgroundColor: '#ffffff', color: '#0284c7', 
                fontWeight: 800, fontSize: '1rem', 
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              {isGenerating ? 'Criando a mágica...' : 'Baixar PDF Completo'}
            </button>
          </div>
        )}

        {/* Rede de Apoio e Links Úteis */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LinkIcon color="#8b5cf6" size={20} /> Rede de Apoio
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer' }}>
              <div>
                <h4 style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>Caderneta da Criança</h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Ministério da Saúde</p>
              </div>
              <ChevronRight size={18} color="#cbd5e1" />
            </div>
            <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer' }}>
              <div>
                <h4 style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>Sociedade Brasileira de Pediatria</h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Artigos e Orientações</p>
              </div>
              <ChevronRight size={18} color="#cbd5e1" />
            </div>
            <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', cursor: 'pointer' }}>
              <div>
                <h4 style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>Calendário Nacional de Vacinação</h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Consulta Oficial PNI</p>
              </div>
              <ChevronRight size={18} color="#cbd5e1" />
            </div>
          </div>
        </div>

        {/* Configurações */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings color="#64748b" size={20} /> Configurações do App
          </h2>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Bell size={18} color="#64748b" />
                <span style={{ fontWeight: 600, color: '#334155', fontSize: '0.95rem' }}>Lembretes de Vacina</span>
              </div>
              <div style={{ width: '44px', height: '24px', backgroundColor: '#e2e8f0', borderRadius: '1rem', position: 'relative' }}>
                <div style={{ width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Moon size={18} color="#64748b" />
                <span style={{ fontWeight: 600, color: '#334155', fontSize: '0.95rem' }}>Modo Escuro</span>
              </div>
              <div style={{ width: '44px', height: '24px', backgroundColor: '#e2e8f0', borderRadius: '1rem', position: 'relative' }}>
                <div style={{ width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Shield size={18} color="#64748b" />
                <span style={{ fontWeight: 600, color: '#334155', fontSize: '0.95rem' }}>Privacidade e Dados</span>
              </div>
              <ChevronRight size={18} color="#cbd5e1" />
            </div>

          </div>
        </div>
        
        <div style={{ textAlign: 'center', padding: '1rem', marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>App MARCOS v1.0.0<br/>Desenvolvido com carinho.</p>
        </div>

      </div>
    </div>
  );
};

export default Profile;
