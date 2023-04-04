require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("./db/mongodb");

const user = require("./model/model");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const data = new user({
      USERNAME: req.body.USERNAME,
      EMAIL: req.body.EMAIL,
      PASSWORD: req.body.PASSWORD,
    });
    await data.save();
    const tokan = await jwt.sign({ _id: data._id }, process.env.jwt_key, {
      expiresIn: "100s",
    });

    res.status(201).send("if dto is valid");
    console.log(data);
    console.log(tokan);
  } catch (error) {
    res.status(400).send("no login or passwod, they are not a string");
    console.log(error);
  }
});
app.post("/login", async (req, res) => {
  try {
    const email = req.body.EMAIL;
    const password = req.body.PASSWORD;

    const data = await user.findOne({ EMAIL: email });
    const ismacth = await bcrypt.compare(password, data.PASSWORD);

    if (ismacth) {
      const tokan = await jwt.sign({ _id: data._id }, process.env.jwt_key, {
        expiresIn: "100s",
      });
      console.log(tokan);
      res.status(200).send("tokens if dto is valid");
    } else {
      res
        .status(403)
        .send(
          "no user with such login , password doesn't macth actual one , etc"
        );
    }
  } catch (error) {
    res.status(400).send("no login or password,or they are not a strings");
    console.log(error);
  }
});

//middleware verifytoken

const verifytoken = (req, res, next) => {
  const beare = req.headers["authorization"];
  if (typeof beare !== "undefined") {
    const test = beare.split(" ");
    const token = test[1];
    req.token = token;
    next();
  } else {
    res.status(400).send("no refreshToken in body");
  }
};
app.post("/refresh", verifytoken, async (req, res) => {
  try {
    await jwt.verify(req.token, process.env.jwt_key, (err, auth) => {
      if (err) {
        res.status(403).send("Refresh token is invalid or expired");
      } else {
        res.status(200).json({
          messege: " tokens in body if dto is valid",
          auth,
        });
      }
    });
  } catch (error) {
    res.status(401).send("no refreshToken in body");
  }
});

app.listen(3000, () => {
  console.log("port run");
});
