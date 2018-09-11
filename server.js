const express = require("express"); //Express is the backend framework.
const mongoose = require("mongoose"); //Brings in mongoose
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express(); //initialize a variable to express.

// body parser middleware:
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB Config
const db = require("./config/keys").mongoURI; //database requires keys.js file, which contains our user

//Connect to MongoDB through mongoose
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected")) //.then is a promise. If it connects w/out error: log connected.
  .catch(err => console.log(err)); //.catch is to catch an error. This is also a promise.

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

// Use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000; //Lets us run the server. Port 5000. process.env.PORT is for deploying to Heroku.

app.listen(port, () => console.log(`Server running on port ${port}`)); //Back-tick quotes to enable string interpolation.
