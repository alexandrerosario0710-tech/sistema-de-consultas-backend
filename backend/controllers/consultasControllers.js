const consultaModels = require(`../models/consultasModels`);
const User = require(`../models/usersModels`);
const procedureModels = require(`../models/proceduresModels`);

async function createConsulta(req, res) {
    try {
        const {userId, procedureId, appointment_date, appointment_time, notes} = req.body;

        if(!userId || isNaN(userId)) {
            return res.status(400).json({error: `Dados invalidos`})
        }
        if(!appointment_date || !appointment_time) {
            return res.status(400).json({error: `Preencha todos os campos`})
        }

        const [ano, mes, dia] = appointment_date.split('-');
        const [hora, minuto] = appointment_time.split(':');

        const consultaDate = new Date(ano, mes - 1, dia, hora, minuto || 0, 0);
        const now = new Date();

        if(consultaDate < now) {
            return res.status(400).json({error: `Não é possivel marcar consulta no passado`})
        }

        const existingConsulta = await consultaModels.findConsultaByDateAndTime(appointment_date, appointment_time)
        if(existingConsulta) {
            return res.status(400).json({error: `Já existe uma consulta marcada para este horario`})
        }

        const user = await User.getUserById(userId)
        if(!user) {
            return res.status(404).json({error: `Usuario não encontrado`})
        }

        if(procedureId) {
            const procedure = await procedureModels.getProcedureById(procedureId)
            if(!procedure) {
                return res.status(404).json({error: `Nenhum procedimento foi encontrado`})
            }
        }

        const insertId = await consultaModels.createConsulta(userId, procedureId, appointment_date, appointment_time, "marcado", notes)

        return res.status(201).json({message: `Consulta criada!`, id: insertId})
    }catch(error) {
        console.error(error)
        return res.status(500).json({error: `Erro ao tentar criar a consulta`})
    }
}

async function getConsultas(req, res) {
    try {
        const consultas = await consultaModels.getConsultas()

        return res.status(200).json(consultas)
    }catch(error) {
        console.error(error)
        return res.status(500).json({error: `Erro ao buscar consultas`})
    }
}

async function getConsultaById(req, res) {
    try {
        const {id} = req.params;
        if(!id || isNaN(id)) {
            return res.status(400).json({error: `Dados invalidos`})
        }

        const getConsultaId = await consultaModels.getConsultaById(id)
        if(!getConsultaId) {
            return res.status(404).json({error: `Nenhnuma consulta foi encontrada`})
        }
        
        return res.status(200).json(getConsultaId)
    }catch(error) {
        console.error(error)
        return res.status(500).json({error: `Erro ao buscar consultas`})
    }
}

async function updateConsulta(req, res) {
    try {
        const {id} = req.params;
        const {userId, procedureId, appointment_date, appointment_time, status, notes} = req.body;

        if(!id || isNaN(id) || !userId || isNaN(userId) || !procedureId || isNaN(procedureId)) {
            return res.status(400).json({error: `Dados invalidos`})
        }
        if(!appointment_date || !appointment_time || !status) {
            return res.status(400).json({error: `Preencha todos os campos`})
        }

        const affectedRows = await consultaModels.updateConsulta(id, userId, procedureId, appointment_date, appointment_time, status, notes)
        if(affectedRows === 0) {
            return res.status(400).json({error: `Nenhuma consulta foi encontrada`})
        }

        return res.status(200).json({message: `Consulta atualizada com sucesso!`})
    }catch(error) {
        console.log(error)
        return res.status(500).json({error: `Erro ao tentar atualizar a consulta`})
    }
}

async function deleteConsulta(req, res) {
    try {
        const {id} = req.params;
        if(!id || isNaN(id)) {
            return res.status(400).json({error: `Dados invalidos!`})
        }

        const affectedRows = await consultaModels.deleteConsulta(id)
        if(affectedRows === 0) {
            return res.status(404).json({error: `Nennhuma consulta foi encontrada`})
        }

        return res.status(200).json({message: `Consulta removida com sucesso`})
    }catch(error) {
        console.error(error)
        return res.status(500).json({error: `Erro ao tentar remover a consulta`})
    }
}

async function concluirConsulta(req, res) {
    try {
        const {id} = req.params

        if(!id || isNaN(id)) {
            return res.status(400).json({error: `Dados invalidos`})
        }

        const consulta = await consultaModels.getConsultaById(id)
        if(!consulta) {
            return res.status(404).json({error: `Nenhuma consulta foi encontrada`})
        }

        const consultaDateTime = new Date(`${consulta.appointment_date}T${consulta.appointment_time}`)
        const now = new Date()

        if(now < consultaDateTime) {
            return res.status(400).json({error: `Não é possivel concluir uma consulta antes do horario marcado`})
        }

        if(consulta.status === "cancelado") {
            return res.status(400).json({error: `Não é possivel concluir uma consulta cancelada`})
        }

        if(consulta.status === "concluido") {
            return res.status(400).json({error: `Está consulta já foi concluida`})
        }

        const affectedRows = await consultaModels.updateConsultaStatus(id, "concluido")
        if(affectedRows === 0) {
            return res.status(404).json({error: `Consulta não atualizada`})
        }
        return res.status(200).json({message: `Consulta concluida`})    
    }catch(error) {
        console.log(error)
        return res.status(500).json({error: `Erro ao tentar concluir a conslta`})
    }
}

async function cancelarConsulta(req, res) {
    try {
        const { id } = req.params;
        if (!id || isNaN(id)) {
            return res.status(400).json({ error: "Dados invalidos" });
        }
        
        const consulta = await consultaModels.getConsultaById(id);
        if (!consulta) {
            return res.status(404).json({ error: "Nenhuma consulta foi encontrada" });
        }

        if (consulta.status === "concluido") {
            return res.status(400).json({ error: "Não é possivel cancelar uma consulta concluida" });
        }
        if (consulta.status === "cancelado") {
            return res.status(400).json({ error: "Está consulta já foi cancelada" });
        }

        const dataBr = new Date(consulta.appointment_date).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
        const [dia, mes, ano] = dataBr.split('/');
        
        // Pega a string do horário (ex: "10:00:00")
        const horaOriginal = consulta.appointment_time.toString();
        const [hora, minuto] = horaOriginal.split(':');

        // 2. Montamos o objeto final no horário local do Brasil
        const consultaDate = new Date(Number(ano), Number(mes) - 1, Number(dia), Number(hora), Number(minuto), 0);
        const now = new Date();

        if (consultaDate < now) {
            return res.status(400).json({ error: "Não é possivel cancelar consultas já realizadas" });
        }

        const diffMs = consultaDate.getTime() - now.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);

        if (req.userRole !== "admin" && diffHours < 24) {
            return res.status(400).json({ error: "Consulta só podem ser canceladas com pelo menos 24 horas de antecedencia" });
        }

        const affectedRows = await consultaModels.updateConsultaStatus(id, "cancelado");
        if (affectedRows === 0) {
            return res.status(404).json({ error: "Nenhuma consulta foi cancelada" });
        }

        return res.status(200).json({ message: "Consulta cancelada" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao tentar cancelar consulta" });
    }
}

async function getConsultasByStatus(req, res) {
    try {
        const {status} = req.params;
        if(!status) {
            return res.status(400).json({error: `Status invalidos`})
        }

        const allowedStatus = [`marcado`, `concluido`, `cancelado`];
        if(!allowedStatus.includes(status)) {
            return res.status(400).json({error: `Status invalido`})
        }

        const consulta = await consultaModels.getConsultasByStatus(status)
        return res.status(200).json(consulta)
    }catch(error) {
        console.error(error)
        return res.status(500).json({error: `Erro ao buscar consultasd`})
    }
}

async function getConsultasByUser(req, res) {
    try {
        let userId;

        if(req.params.userId) {
            userId = req.params.userId
        }else {
            userId = req.userId
        }

        const consulta = await consultaModels.getConsultasByUser(userId);

        return res.status(200).json(consulta)
    }catch(error) {
        console.error(error)
        return res.status(500).json({error: `Erro ao tentar buscar consultas deste usuario`})
    }
}

module.exports = {
    createConsulta,
    getConsultas,
    getConsultaById,
    updateConsulta,
    deleteConsulta,
    cancelarConsulta,
    concluirConsulta,
    getConsultasByStatus,
    getConsultasByUser,
}
