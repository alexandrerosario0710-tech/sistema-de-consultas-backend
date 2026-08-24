require("dotenv").config();

const express = require(`express`);
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json())

const userRoutes = require(`./routes/usersRoutes`)
const consultaRoutes = require(`./routes/consultasRoutes`)
const proceduresRoutes = require(`./routes/procedureRoutes`)

app.use(`/usuarios`, userRoutes)
app.use(`/consultas`, consultaRoutes)
app.use(`/procedimentos`, proceduresRoutes)

app.listen(PORT, () => console.log(`Ouvindo a porta ${PORT}`));