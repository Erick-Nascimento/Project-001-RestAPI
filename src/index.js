const express = require('express');
const app = express();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Routes
app.use(require('../routes'));

app.listen(3333, () => console.log("Server is running"));