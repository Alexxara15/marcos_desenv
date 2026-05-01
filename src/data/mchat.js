export const mchatQuestions = [
  { id: 1, text: "Se você apontar para algo do outro lado do quarto, seu filho(a) olha para o que você está apontando?", isReverse: false },
  { id: 2, text: "Você já se perguntou se seu filho(a) é surdo(a)?", isReverse: true },
  { id: 3, text: "Seu filho(a) brinca de faz de conta ou brincadeiras de imaginação? (ex: fingir que bebe de um copo vazio, fala no telefone)", isReverse: false },
  { id: 4, text: "Seu filho(a) gosta de subir nas coisas? (ex: móveis, brinquedos de parquinho, escadas)", isReverse: false },
  { id: 5, text: "Seu filho(a) faz movimentos estranhos com os dedos perto dos olhos? (ex: balança os dedos perto do rosto)", isReverse: true },
  { id: 6, text: "Seu filho(a) aponta com o dedo indicador para pedir algo ou para conseguir ajuda?", isReverse: false },
  { id: 7, text: "Seu filho(a) aponta com o dedo indicador para mostrar a você algo interessante?", isReverse: false },
  { id: 8, text: "Seu filho(a) se interessa por outras crianças? (ex: olha para elas, sorri, aproxima-se)", isReverse: false },
  { id: 9, text: "Seu filho(a) traz objetos para você (para lhe mostrar, e não para pedir ajuda)?", isReverse: false },
  { id: 10, text: "Seu filho(a) responde quando você o(a) chama pelo nome? (ex: olha, sorri, ou para o que está fazendo)", isReverse: false },
  { id: 11, text: "Quando você sorri para o seu filho(a), ele(a) sorri de volta para você?", isReverse: false },
  { id: 12, text: "Seu filho(a) se incomoda com barulhos do dia a dia? (ex: aspirador de pó, música alta)", isReverse: true },
  { id: 13, text: "Seu filho(a) sabe andar?", isReverse: false },
  { id: 14, text: "Seu filho(a) olha nos seus olhos quando você fala com ele(a), brinca com ele(a) ou o(a) veste?", isReverse: false },
  { id: 15, text: "Seu filho(a) tenta imitar o que você faz? (ex: dar tchau, bater palmas, ou imitar sons)", isReverse: false },
  { id: 16, text: "Se você virar a cabeça para olhar algo, seu filho(a) olha ao redor para ver o que você está olhando?", isReverse: false },
  { id: 17, text: "Seu filho(a) tenta fazer você olhar para ele(a)?", isReverse: false },
  { id: 18, text: "Seu filho(a) entende quando você diz a ele(a) para fazer algo? (ex: sem você apontar, entende 'coloca o livro na cadeira')", isReverse: false },
  { id: 19, text: "Se algo novo acontece, seu filho(a) olha para o seu rosto para ver como você se sente em relação a isso?", isReverse: false },
  { id: 20, text: "Seu filho(a) gosta de atividades de movimento? (ex: ser balançado, ou pular no seu colo)", isReverse: false },
];

// O M-CHAT-R/F funciona assim: 
// Itens 2, 5, e 12 a resposta de RISCO é "Sim".
// Para todos os outros itens (isReverse = false), a resposta de RISCO é "Não".
export const calculateMchatScore = (answers) => {
  let score = 0;
  
  mchatQuestions.forEach(q => {
    const answer = answers[q.id];
    if (!answer) return; // Se não respondeu, ignora por enquanto.
    
    if (q.isReverse) {
      if (answer === 'sim') score += 1;
    } else {
      if (answer === 'nao') score += 1;
    }
  });
  
  return score;
};

export const getRiskLevel = (score) => {
  if (score >= 0 && score <= 2) return { level: 'Baixo Risco', color: 'green', text: 'Se a criança tiver menos de 24 meses, faça a triagem novamente aos 2 anos. Nenhuma outra ação é necessária a menos que o acompanhamento indique risco.' };
  if (score >= 3 && score <= 7) return { level: 'Risco Moderado', color: 'orange', text: 'Deve ser feita a entrevista de seguimento M-CHAT-R/F com o pediatra para obter mais informações sobre as respostas de risco.' };
  if (score >= 8) return { level: 'Alto Risco', color: 'red', text: 'É aceitável ignorar o seguimento (entrevista M-CHAT-R/F) e encaminhar imediatamente a criança para avaliação diagnóstica de TEA e elegibilidade de intervenção precoce.' };
  return null;
};
