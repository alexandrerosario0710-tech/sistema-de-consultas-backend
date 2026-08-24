const db = require(`../db/connection`)

async function createConsulta(userId, proceduresId, appointment_date, appointment_time, status = `marcado`, notes = null) {
    try {
        if(!userId || isNaN(userId)) {
            throw new Error(`Dados invalidos`)
        }
        if (proceduresId && isNaN(proceduresId)) {
            throw new Error(`Dados invalidos`);
        }
        if(!appointment_date || !appointment_time) {
            throw new Error(`Dados invalidos`)
        }

        const [result] = await db.query(
            `INSERT INTO consultas (userId, proceduresId, appointment_date, appointment_time, status, notes) VALUES(?, ?, ?, ?, ?, ?)`,
            [userId, proceduresId, appointment_date, appointment_time, status, notes]
        )
        return result.insertId
    }catch(error) {
        console.error(error)
        throw error;
    }
}

async function getConsultas() {
    try {
        const [rows] = await db.query(
            `SELECT * FROM consultas`
        )
        return rows;
    }catch(error) {
        console.error(error)
        throw error;
    }
}

async function getConsultaById(id) {
    try {
        if(!id || isNaN(id)) {
            throw new Error(`Dados invalidos`)
        }

        const [rows] = await db.query(
            `SELECT * FROM consultas WHERE id = ?`,
            [id]
        )
        return rows[0]
    }catch(error) {
        console.error(error)
        throw error;
    }
}

async function updateConsulta(id, userId, proceduresId, appointment_date, appointment_time, status, notes) {
    try {
        if(!userId || isNaN(userId)) {
            throw new Error(`Dados invalidos`)
        }

        if(!id || isNaN(id)) {
            throw new Error(`Dados invalidos`)
        }

        if(!proceduresId || isNaN(proceduresId)) {
            throw new Error(`Dados invalidos`)
        }

        if(!appointment_date || !appointment_time || !status) {
            throw new Error(`Dados invalidos`)
        }

        const [result] = await db.query(
            `UPDATE consultas SET userId = ?, proceduresId = ?, appointment_date = ?, appointment_time = ?, status = ?, notes = ? WHERE id = ?`,
            [userId, proceduresId, appointment_date, appointment_time, status, notes, id]
        )
        return result.affectedRows;
    }catch(error) {
        console.error(error)
        throw error;
    }
}

async function deleteConsulta(id) {
    try {
        if(!id || isNaN(id)) {
            throw new Error(`Dados invalidos`)
        }

        const [result] = await db.query(
            `DELETE FROM consultas WHERE id = ?`,
            [id]
        )
        return result.affectedRows;
    }catch(error) {
        console.error(error)
        throw error;
    }
}

async function findConsultaByDateAndTime(appointment_date, appointment_time) {
    try {

        if(!appointment_date || !appointment_time) {
            throw new Error(`Dados invalidos`)
        }

        const [rows] = await db.query(
            `SELECT * FROM consultas WHERE appointment_date = ? AND appointment_time = ?`,
            [appointment_date, appointment_time]
        )
        return rows.length > 0 ? rows[0] : null;
    }catch(error) {
        console.log(error)
        throw error;
    }
}

async function updateConsultaStatus(id, status) {
    try {
        if(!id || isNaN(id)) {
            throw new Error(`Dados invalidos`)
        }
        if(!status) {
            throw new Error(`Dados invalidos`)
        }

        const [result] = await db.query(
            `UPDATE consultas SET status = ? WHERE id = ?`,
            [status, id]
        )
        return result.affectedRows;
    }catch(error) {
        console.error(error)
        throw error;
    }
}

async function getConsultasByStatus(status) {
    try {
        if(!status) {
            throw new Error(`Status invalidos`)
        }

        const [rows] = await db.query(
            `SELECT * FROM consultas WHERE status = ?`,
            [status]
        )
        return rows.length > 0 ? rows : null;
    }catch(error) {
        console.error(error)
        throw error
    }
}

async function getConsultasByUser(userId) {
    try {
        if(!userId || isNaN(userId)) {
            throw new Error(`Dados invalidos`)
        }

        const [rows] = await db.query(
            `SELECT * FROM consultas WHERE userId = ?`,
            [userId]
        )
        return rows;
    }catch(error) {
        console.error(error)
        throw error;
    }
}

module.exports = {
    createConsulta,
    getConsultas,
    getConsultaById,
    updateConsulta,
    deleteConsulta,
    findConsultaByDateAndTime,
    updateConsultaStatus,
    getConsultasByStatus,
    getConsultasByUser,
}