const User = require(`../models/usersModels`)
const bcrypt = require(`bcrypt`)
const jwt = require(`jsonwebtoken`);
const { logout } = require("./consultasControllers");

async function createUser(req, res) {
    try {
        const {name, email, password, phone, birth_date, role = `patient`} = req.body;

        if(!name || !email || !password || !phone || !birth_date) {
            return res.status(400).json({error: `Preencha todos os campos`})
        }

        const existingUser = await User.findUserByEmail(email);

        if(existingUser.length > 0) {
            return res.status(400).json({error: `Usuario já existe`})
        }

        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)

        const insertId = await User.createUser(name, email, passwordHash, phone, birth_date, role)

        return res.status(201).json({message: `Usuario criado`, id: insertId})
    }catch(error) {
        console.error(error)
        return res.status(500).json({error: `Erro ao tentar criar usuario, tente novamente`})
    }
}

async function userLogin(req, res) {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({error: `Preencha todos os campos`})
        }

        const user = await User.findUserByEmail(email)
        if(user.length === 0) {
            return res.status(404).json({error: `Usuario não encontrado!`})
        }

        const isMatch = await bcrypt.compare(password, user[0].password)
        if(!isMatch) {
            return res.status(400).json({error: `Email ou senha incorretos`})
        }
        const token = jwt.sign(
            {
                id: user[0].id,
                role: user[0].role
            },
            process.env.JWT_SECRET,
            {expiresIn: `1h`}
        )
        return res.status(200).json({message: `Login realizado com sucesso`, id: user.id, token: token})
    }catch(error) {
        console.log(error)
        return res.status(500).json({error: `Erro ao tentar fazer login, tente novamente`})
    }
}

async function getUsers(req, res) {
    try {
        const users = await User.getUsers();

        return res.status(200).json(users)
    }catch(error) {
        console.error(error)
        return res.status(500).json({error: `Erro ao tentar encontrar usuarios`})
    }
}

async function getUserById(req, res) {
    try {
        const {id} = req.params;

        if(!id || isNaN(id)) {
            return res.status(400).json({error: `Dados invalidos`})
        }

        const user = await User.getUserById(id)
        if(!user) {
            return res.status(404).json()
        }

        return res.status(200).json(user)
    }catch(error) {
        console.error(error)
        return res.status(500).json({error: `Erro ao buscar usuarios`})
    }
}

async function updateUser(req, res) {
    try {
        const {id} = req.params;
        const {name, email, password, phone, birth_date, role} = req.body;

        if(!id || isNaN(id)) {
            return res.status(400).json({error: `Dados invalidos`})
        }
        const usuarioAtual = await User.getUserById(id);
        if(!usuarioAtual) {
            return res.status(404).json({error: `Usuario não encontrado`})
        }

        let senhaFinal = usuarioAtual.password

        if(password && password !== usuarioAtual.password) {
            const salt = await bcrypt.genSalt(10)
            senhaFinal = await bcrypt.hash(password, salt)
        }

        const affectedRows = await User.updateUser(id, name, email, senhaFinal, phone, birth_date, role)

        return res.status(200).json({message: `Usuario atualizado com sucesso`})
    }catch(error) {
        console.error(error)
        return res.status(500).json({error: `Erro ao tentar atualizar o usuario`})
    }
}

async function deleteUser(req, res) {
    try {
        const {id} = req.params;
        if(!id || isNaN(id)) {
            return res.status(400).json({message: `Dados invalidos`})
        }

        const affectedRows = await User.deleteUser(id)
        if(affectedRows === 0) {
            return res.status(404).json({message: `Nenhum usuario encontrado`})
        }

        return res.status(200).json({message: `Usuario removido com sucesso`})
    }catch(error) {
        console.error(error)
        return res.status(500).json({error: `Erro ao tentar remover usuario`})
    }
}

async function userlogout(req, res) {
    try {
        const authHeader = req.headers.authorization
        const token = authHeader.split(" ")[1];

        User.userlogout(token)

        return res.status(200).json({message: `Logout realizado com sucesso!`})
    }catch(error) {
        console.error(error)
        return res.status(500).json({error: `Erro ao tentar fazer logout`})
    }
}

module.exports = {
    createUser,
    userLogin,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    userlogout
}
