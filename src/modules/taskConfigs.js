const { isNotEmpty, validarHorario, isHoraPermitida } = require('./verifications');
const { getAreasDeConhecimentoEMaterias } = require('../firebase/consultation/consultaMaterias');

// NOVO: Importar diretamente as funções do Firebase que você vai criar.
// Estas são funções hipotéticas que você precisará implementar.
const { getTasksByDate, insertTaskInFirestore } = require('../firebase/firestore/tasks');

// Função para calcular a semana do ano (lógica mantida)
function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return [d.getUTCFullYear(), weekNo];
}

// ALTERADO: A função agora chama diretamente o banco de dados.
async function isMateriaJaRegistrada(materia, data, UID) {
    try {
        // REMOVIDO: fetch('/getTasks')
        // NOVO: Chamada direta à função que consulta o Firestore.
        const tasksDoDia = await getTasksByDate(UID, data);

        const areasDeConhecimento = await getAreasDeConhecimentoEMaterias();
        const areaDaMateria = Object.keys(areasDeConhecimento).find(area => areasDeConhecimento[area].includes(materia));

        return tasksDoDia.some(task => {
            const areaDaTask = Object.keys(areasDeConhecimento).find(area => areasDeConhecimento[area].includes(task.materia));
            return areaDaTask === areaDaMateria;
        });
    } catch (error) {
        console.error('Erro ao verificar matéria registrada:', error);
        // Em caso de erro, é mais seguro impedir o registro para evitar duplicatas.
        return true;
    }
}

// ALTERADO: O nome da função agora é mais descritivo
async function createTaskHandler(req, res) {
    // ALTERADO: Obtendo o UID e o nome do usuário a partir do req.user injetado pelo authMiddleware
    const { uid, name } = req.user;
    const { periodo, horarioInicio, horarioTermino, materia, assunto } = req.body;

    // Validações
    if (!isNotEmpty(periodo) || !isNotEmpty(horarioInicio) || !isNotEmpty(horarioTermino) || !isNotEmpty(materia) || !isNotEmpty(assunto)) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }
    if (!validarHorario(horarioInicio, horarioTermino)) {
        return res.status(400).json({ error: "O horário de término deve ser após o horário de início." });
    }
    if (!isHoraPermitida(horarioInicio, horarioTermino, periodo)) {
        return res.status(400).json({ error: "O horário selecionado não pertence ao período." });
    }

    try {
        const hoje = new Date().toISOString().split('T')[0];
        if (await isMateriaJaRegistrada(materia, hoje, uid)) {
            return res.status(400).json({ error: "Você já registrou uma matéria desta área de conhecimento hoje." });
        }
        
        const horaInicioInt = parseInt(horarioInicio.split(':')[0]);
        const horaTerminoInt = parseInt(horarioTermino.split(':')[0]);
        const [ano, numeroSemana] = getWeekNumber(new Date());

        const taskData = {
            UID: uid,
            userName: name, // ALTERADO: Usando o nome real do usuário
            materia: materia,
            assunto: assunto,
            horarioInicio: horarioInicio,
            horarioTermino: horarioTermino,
            tempoEstimado: horaTerminoInt - horaInicioInt,
            periodo: periodo,
            ano: ano,
            numeroSemana: numeroSemana,
            createdAt: new Date().toISOString()
        };
        
        // REMOVIDO: fetch('/insertTasks')
        // NOVO: Chamada direta à função que insere no Firestore
        const novaTarefaId = await insertTaskInFirestore(taskData);

        return res.status(201).json({ message: "Tarefa criada com sucesso!", taskId: novaTarefaId });

    } catch (error) {
        console.error('Erro no handler de criação de tarefa:', error);
        return res.status(500).json({ error: "Erro interno ao processar a solicitação da tarefa." });
    }
}

module.exports = { createTaskHandler };