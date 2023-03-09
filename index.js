const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const authRoutes = require('./routes/auth');
const sessionRoutes = require('./routes/session');
const app = express();
const  corsOptions = {
    origin: '*', // Reemplazar con dominio
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
// capturar body
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors(corsOptions));
// Conexión a Base de datos
const uri = `mongodb+srv://marvar999:201620364@cluster0.bsili.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(uri
)
.then(() => console.log('Base de datos conectada'))
.catch(e => console.log('error db:', e))
// import routes
app.use('/api/user', authRoutes);
app.use('/api/session', sessionRoutes);
// route middlewares
app.get('/', (req, res) => {
    res.json({
        estado: true,
        mensaje: 'funciona!'
    })
});

// iniciar server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`servidor andando en: ${PORT}`)
})