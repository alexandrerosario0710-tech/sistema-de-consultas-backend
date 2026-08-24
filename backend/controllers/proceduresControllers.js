const proceduresModels = require(`../models/proceduresModels`)

async function createProcedure(req, res) {
    try {
        const {name, description, duration, price} = req.body;
        if(!name || !description || duration == null || price == null) {
            return res.status(400).json({error: `Preencha todos os campos`})
        }

        const insertId = await proceduresModels.createProcedure(name, description, duration, price)

        return res.status(201).json({message: `Procedimento criado!`, id: insertId})
    }catch(error) {
        console.error(error)
        return res.status(500).json({error: `Erro ao tentar criar o procedimento`})
    }
}

async function getProcedures(req, res) {
    try {
        const procedures = await proceduresModels.getProcedures();

        return res.status(200).json(procedures)
    }catch(error) {
        console.log(error)
        return res.status(500).json({error: `Erro ao buscar os procedimentos`})
    }
}

async function getProcedureById(req, res) {
    try {
        const {id} = req.params;
        if(!id || isNaN(id)) {
            return res.status(400).json({error: `Dados invalidos`})
        }

        const getProcedures = await proceduresModels.getProcedureById(id)
        if(!getProcedures) {
            return res.status(404).json()
        }

        return res.status(200).json(getProcedures)
    }catch(error) {
        console.error(error)
        return res.status(500).json({error: `Erro ao tentar buscar os procedimentos`})
    }
}

async function updateProcedure(req, res) {
    try {
        const {id} = req.params;
        const {name, description, duration, price} = req.body;

        if(!id || isNaN(id)) {
            return res.status(400).json({error: `Dados invalidos`})
        }
        if(!name || !description || duration == null || price == null) {
            return res.status(400).json({error: `Preencha todos os campos`})
        }

        const affectedRows = await proceduresModels.updateProcedure(id, name, description, duration, price)
        if(affectedRows === 0) {
            return res.status(404).json({error: `Nenhum procedimento encontrado`})
        }

        return res.status(200).json({message: `Procedimento atualizado com sucesso`})
    }catch(error) {
        console.error(error)
        return res.status(500).json({error: `Erro ao tentar atualizar o procedimento`})
    }
}

async function deleteProcedure(req, res) {
    try {
        const {id} = req.params;
        if(!id || isNaN(id)) {
            return res.status(400).json({error: `Dados invalidos`})
        }

        const affectedRows = await proceduresModels.deleteProcedure(id)
        if(affectedRows === 0) {
            return res.status(404).json({message: `Nenhum usuario encontrado`})
        }

        return res.status(200).json({message: `Procedimento removido com sucesso`})
    }catch(error) {
        console.error(error)
        return res.status(500).json({error: `Erro o tentar remover o procedimento`})
    }
}

module.exports = {
    createProcedure,
    getProcedures,
    getProcedureById,
    updateProcedure,
    deleteProcedure
}
