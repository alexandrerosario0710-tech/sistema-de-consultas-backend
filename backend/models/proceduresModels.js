const db = require(`../db/connection`)

async function createProcedure(name, description, duration, price) {
    try {
        if(!name || !description || duration == 0 || price == 0) {
            throw new Error(`Dados invalidos`)
        }

        const [result] = await db.query(
            `INSERT INTO procedures(name, description, duration, price) VALUES(?, ?, ?, ?)`,
            [name, description, duration, price]
        )
        return result.insertId;
    }catch(error) {
        console.error(error);
        throw error;
    }
}

async function getProcedures() {
    try {
        const [rows] = await db.query(
            `SELECT * FROM procedures`
        )
        return rows;
    }catch(error) {
        console.error(error);
        throw error;
    }
}

async function getProcedureById(id) {
    try {
        if(!id || isNaN(id)) {
            throw new Error(`Dados invalidos`)
        }
        const [rows] = await db.query(
            `SELECT * FROM procedures WHERE id = ?`,
            [id]
        )
        return rows[0]
    }catch(error) {
        console.error(error)
        throw error;
    }
}

async function updateProcedure(id, name, description, duration, price) {
    try {
        if(!id || isNaN(id)) {
            throw new Error(`Dados invalidos`)
        }
        if(!name || !description || duration == 0 || price === undefined) {
            throw new Error(`Dados invalidos`)
        }
        const [result] = await db.query(
            `UPDATE procedures SET name = ?, description = ?, duration = ?, price = ? WHERE id = ?`,
            [name, description, duration, price, id]
        )
        return result.affectedRows;
    }catch(error) {
        console.error(error)
        throw error;
    }
}

async function deleteProcedure(id) {
    try {
        if(!id || isNaN(id)) {
            throw new Error(`Dados invalidos`)
        }

        const [result] = await db.query(
            `DELETE FROM procedures WHERE id = ?`,
            [id]
        )
        return result.affectedRows;
    }catch(error) {
        console.error(error)
        throw error;
    }
}

module.exports = {
    createProcedure,
    getProcedures,
    getProcedureById,
    updateProcedure,
    deleteProcedure
}