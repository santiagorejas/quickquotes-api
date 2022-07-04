// Alumno: Orejas, Santiago
// Taller de Desarrollo Web 2022

const express = require("express");
const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.json({
        message: "Hola, mundo!",
    });
});

app.listen(5000);
