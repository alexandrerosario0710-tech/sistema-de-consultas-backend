const jwt = require(`jsonwebtoken`)

async function authMiddleware(req, res, next) {
   try {
      const authHeader = req.headers.authorization;

      
      if (!authHeader) {
         return res.status(401).json({
            error: "Token não encontrado"
         });
      }

      if (!authHeader.startsWith("Bearer ")) {
         return res.status(401).json({
            error: "Token invalido"
         });
      }

      
      const token = authHeader.split(" ")[1];

     
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

     
      req.userId = decoded.id;
      req.userRole = decoded.role;

      return next();

   } catch (error) {
     
      if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
         return res.status(401).json({ 
            error: "Token inválido ou expirado" 
         });
      }

     
      console.error(error);
      return res.status(500).json({
         error: "Erro na autenticação"
      });
   }
}

module.exports = {
   authMiddleware
};