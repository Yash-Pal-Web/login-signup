const express = require("express");
const app = express();
const passport = require("passport");
const cookieSession = require("cookie-session");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const morgan = require('morgan');
// const cors = require('cors')
// var pug = require('pug');
// app.use(morgan('combined'))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
require("./passport");

const User = require("./models/user");
const ejs = require("ejs");

const path = require("path");
app.set("views", path.join(__dirname, "static"));
app.set("view engine", "ejs");
// app.set('view engine', 'pug');
// app.use(cors());

let uri = "mongodb://localhost:27017/testingMongo";

mongoose.connect(uri, (err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to mongo", uri);
  }
});

//google session
app.use(
  session({
    name: "google-auth-session",
    secret: "keyboard cat",
    keys: ["key1", "key2"],
    saveUninitialized: false,
    resave: false,
  })
);

// facebook session
app.use(
  session({
    name: "facebook-auth-session",
    secret: "keyboard cat",
    keys: ["key1", "key2"],
    saveUninitialized: false,
    resave: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Route to Homepage
app.get("/", (req, res, next) => {
  //res.sendFile(__dirname + "/static/index.html");
  res.render("index.ejs");
});

// Route to Login Page

app.get("/login", (req, res, next) => {
  //res.sendFile(__dirname + "/static/login.html");
  res.render("login.ejs");
});
// login success
app.get("/success", (req, res, next) => {
  //res.sendFile(__dirname + "/static/login.html");
  res.render("success.ejs");
});

// Insert Login Code Here

app.post("/afterLogin", async (req, res) => {
  try {
    let user = await User.findOne({ username: req.body.username });

    if (!user) {
      throw new Error("No such user");
    }
    let data = await bcrypt.compare(req.body.password, user.password);
    if (data === false) {
      throw new Error("Wrong Password");
    }
    res.send({ message: "Success", statusCode: 200 });
  } catch (err) {
    res.send({ message: err.message, statusCode: 400 });
  }
});

// Route to Signup Page

app.get("/signup", (req, res, next) => {
  //  res.sendFile(__dirname + "/static/signup.html");
  res.render("signup.ejs");
});

//signup success
app.get("/success", (req, res, next) => {
  res.render("success.ejs");
});

app.post("/afterSignup", async (req, res) => {
  try {
    let user = await User.findOne({ username: req.body.username });

    if (user) {
      throw new Error("User Already Exists");
    }
    let data = await bcrypt.hash(req.body.password, 10);
    await User.create({ username: req.body.username, password: data });

    res.send({ message: "Signup Successful", statusCode: 200 });
    //req.flash('success_msg', 'You are registered and can now login');

    // res.status(200).send("Login Successful");
  } catch (err) {
    // res.send(err);
    res.send({ message: err.message, statusCode: 400 });
  }
});

//   try {
//     console.log(req.body);
//     let user = await User.create({
//       username: req.body.username,
//       username: req.body.username,
//     });
//     res.send({ user: user })
//   } catch (err) {
//     console.log(err);
//   }
// };

//app.post("/createUser", createUser);

// Auth google
app.get(
  "/auth",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// Auth Callback
app.get(
  "/auth/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/callback/success",
    failureRedirect: "/auth/callback/failure",
  })
);

// Success
app.get("/auth/callback/success", (req, res, next) => {
  if (!req.user) res.redirect("/auth/callback/failure");
  res.send("Welcome " + req.user.email);
});

// failure
app.get("/auth/callback/failure", (req, res) => {
  res.send("Error");
});

//facebook Auth

app.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope:
      //[ 'facebook', 'profile' ]

      ["id", "displayName", "photos", "email"],
  })
);

// Auth Callback
app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/auth/facebook/callback/success",
    failureRedirect: "/auth/facebook/callback/failure",
  })
);

// Success
app.get("/auth/facebook/callback/success", (req, res, next) => {
  if (!req.user) res.redirect("/auth/facebook/callback/failure");
  res.send("Welcome " + req.user.email);
  //console.log(req.user);
});

// failure
app.get("/auth/facebook/callback/failure", (req, res) => {
  res.send("Error");
});

// logout
app.get("/logout", function (req, res) {
  res.redirect("/");
});

app.listen(4000, () => {
  console.log("Server Running on port 4000");
});
