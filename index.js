const express = require("express");
const app = express();
const cors = require("cors");
const { FRONTEND_URL, PORT } = require('./config');

//middleware
app.use(express.json());
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}));

//ROUTES


//Registro y Login rutas
app.use('/auth', require('./routes/encuestaAuth'));

app.use('/dashboard', require('./routes/dashboard'));

app.use('/admin', require('./routes/admin'));

app.listen(PORT, () => {
    console.log('Server is running on port 5000');
});