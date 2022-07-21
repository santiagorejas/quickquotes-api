// Alumno: Orejas, Santiago
// Taller de Desarrollo Web 2022

require("dotenv").config();

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./routes/user-routes");
const quoteRoutes = require("./routes/quote-routes");
const likeRoutes = require("./routes/like-routes");
const commentRoutes = require("./routes/comment-routes");

app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.json({
    message: "Hola, mundo!",
  });
});

app.use("/user", userRoutes);
app.use("/quote", quoteRoutes);
app.use("/like", likeRoutes);
app.use("/comment", commentRoutes);

app.use((err, req, res, next) => {
  res.json({ message: err.message });

  next();
});

mongoose.connect(process.env.MONGO_URL).then(() => {
  app.listen(5000);
});
