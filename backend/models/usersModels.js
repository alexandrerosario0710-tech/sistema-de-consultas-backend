const db = require(`../db/connection`)

async function createUser(name, email, password, phone, birth_date,  role = `patient`) {
    try {
        if(!name || !email || !password || !role || !phone || !birth_date) {
            throw new Error(`Dados invalidos`)
        }

        const [result] = await db.query(
            `INSERT INTO users (name, email, password, role, phone, birth_date) VALUES(?, ?, ?, ?, ?, ?)`,
            [name, email, password, role, phone, birth_date]
        )
        return result.insertId;
    }catch(error) {
        console.error(error)
        throw error;
    }
}

async function findUserByEmail(email) {
    try {
        if(!email) {
            throw new Error(`Dados invalidos`);
        }

        const [rows] = await db.query(
            `SELECT * FROM users WHERE email = ?`,
            [email]
        )
        return rows;
    }catch(error) {
        console.error(error)
        throw error;
    }
}

async function getUsers() {
    try {
        const [rows] = await db.query(
            `SELECT * FROM users`
        )
        return rows;
    }catch(error) {
        console.error(error)
        throw error;
    }
}

async function getUserById(id) {
    try {
        if(!id || isNaN(id)) {
            throw new Error(`Dados invalidos!`)
        }

        const [rows] = await db.query(
            `SELECT * FROM users WHERE id = ?`,
            [id]
        )
        return rows[0]
    }catch(error) {
        console.error(error);
        throw error;
    }
}

async function updateUser(id, name, email, passowrd, phone, birth_date) {
    try {
        if(!name || !email || !password || !phone || !birth_date) {
            throw new Error(`Dados invalidos`)
        }

        const [result] = await db.query(
            `UPDATE users SET name = ?, email = ?, password = ?, phone = ?, birth_date = ? WHERE id = ?`,
            [name, email, passowrd, phone, birth_date, id]
        )
        return result.affectedRows;
    }catch(error) {
        console.error(error);
        throw error;
    }
}

async function deleteUser(id) {
    try {
        if(!id || isNaN(id)) {
            throw new Error(`Dados invalidos`)
        }

        const [result] = await db.query(
            `DELETE FROM users WHERE id = ?`,
            [id]
        )
        return result.affectedRows;
    }catch(error) {
        console.error(error)
        throw error;
    }
}

async function userlogout(token) {
    try {
        const [result] = await db.query(
            `INSERT INTO token_blacklist (token) VALUES(?)`,
            [token]
        )
        return result.affectedRows;
    }catch(error) {
        console.error(error)
        throw error;
    }
}


module.exports = {
    createUser,
    findUserByEmail,
    getUserById,
    getUsers,
    updateUser,
    deleteUser,
    userlogout
}