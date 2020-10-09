const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
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
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/public"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "index.html"));
  });
}
app.get("/", (req, res) => res.send("Hello World"));
app.listen(port, () => console.log("Express is running at port " + port));
