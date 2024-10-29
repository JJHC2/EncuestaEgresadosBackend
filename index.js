const express = require("express");
const cors = require("cors");
const { PORT } = require('./config');
;

const app = express();


app.use(cors());


app.use(express.json());


app.use('/auth', require('./routes/encuestaAuth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/admin', require('./routes/admin'));




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
