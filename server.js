const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
dotenv.config({ path: ".env" });
const { port, mongoURI } = require("./config.js");
const transactionsRoutes = require("./routes/transactions.js");
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("tiny"));
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is Connected"))
  .catch((err) => console.log(err));
app.use("/api/transactions", transactionsRoutes);
app.get("/", (req, res) => res.send("Hello World"));
app.listen(port, () => console.log("Express is running at port " + port));
