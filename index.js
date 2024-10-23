const express = require("express");
const path = require("path"); // Importa path
const cors = require("cors");
const { FRONTEND_URL, PORT } = require('./config');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: FRONTEND_URL
}));

app.use('/auth', require('./routes/encuestaAuth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/admin', require('./routes/admin'));

app.use(express.static(path.join(__dirname, 'build'))); 


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html')); 
});


app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});
