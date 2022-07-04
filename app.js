// Alumno: Orejas, Santiago
// Taller de Desarrollo Web 2022

require("dotenv").config();

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/user-routes");
const quoteRoutes = require("./routes/quote-routes");

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.json({
        message: "Hola, mundo!",
    });
});

app.use("/user", userRoutes);
app.use("/quote", quoteRoutes);

app.use((err, req, res, next) => {
    res.json({ message: err.message });

    next();
});

mongoose.connect(process.env.MONGO_URL).then(() => {
    app.listen(5000);
});
