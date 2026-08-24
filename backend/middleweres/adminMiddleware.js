function adminMiddleware(req, res, next) {
    try {
        const authAdmin = req.userRole;

        if(authAdmin !== `admin`) {
            return res.status(403).json({error: `Acesso negado: Recursos restritos a administradores`})
        }

        return next();
    }catch(error) {
        console.error(error)
        return res.status(500).json({error: `Erro na verificação de admin`})
    }
}

module.exports = {adminMiddleware};