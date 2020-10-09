const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require('passport');
const path = require("path");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const app = express();
dotenv.config({ path: ".env" });
const { port, mongoURI } = require("./config.js");
const transactionsRoutes = require("./routes/transactions.js");
const User = require("./models/User.js");
const authRoutes = require("./routes/auth.js");
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
app.use(
  session({
    resave : true,
    saveUninitialized : true,
    secret : 'this is my secret',
    store : new MongoStore({ mongooseConnection : mongoose.connection})
  })
)
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use(passport.initialize())
app.use(passport.session())
app.use("/api/transactions", transactionsRoutes);
app.use("/api/auth", authRoutes);
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/public"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "index.html"));
  });
}
app.get("/", (req, res) => res.send("Hello World"));
app.listen(port, () => console.log("Express is running at port " + port));
