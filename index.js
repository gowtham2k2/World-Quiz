import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import fs, { readFileSync } from "fs";

const app = express();
const port = 3000;

let world = [];
let currentQuestion = {};
let score;
let isAnswerCorrect;
var isGameStarted = false;

// db connections
// const db = new pg.Client({
//   user: "postgres",
//   password: "gowtham2k2",
//   port: 5432,
//   host: "localhost",
//   database: "world",
// });

// db.connect();

// db.query("SELECT * FROM capitals", (err, res) => {
//   if (err) console.error("error in executing query", err.stack);
//   else world = res.rows;
//   db.end();
// });
// end of db section

// *****************************
// comment out the code if u want to use Postgres sql db
world = JSON.parse(readFileSync("world.json", "utf-8"));
// paste it above...
// *****************************

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// get route
app.get("/", async (req, res) => {
  if (isGameStarted) {
    await randomCountry();
    res.render("index.ejs", {
      country: currentQuestion,
      totalScore: score,
      enableForm: true,
    });
  } else {
    score = 0;
    res.render("index.ejs", { status: true });
  }
});
// start game post route
app.post("/start", (req, res) => {
  isGameStarted = req.body.isGameStarted.toLowerCase() === "true";
  res.redirect("/");
});

// answer submit post route
app.post("/submit", (req, res) => {
  const userAnswer = req.body.answer;
  checkAnswer(userAnswer);
  res.render("index.ejs", {
    totalScore: score,
    country: currentQuestion,
    wasCorrect: isAnswerCorrect,
    enableForm: false,
  });
});

// quit game post route
app.post("/quit", (req, res) => {
  isGameStarted = false;
  score = 0;
  res.redirect("/");
});

// Listing to app on port 3000
app.listen(port, () => {
  console.log("app is running on port: " + port);
});

async function randomCountry() {
  const randomCountry = world[Math.floor(Math.random() * world.length)];
  currentQuestion = randomCountry;
  console.log(currentQuestion);
}

function checkAnswer(answer) {
  if (answer.trim().toLowerCase() === currentQuestion.capital.toLowerCase()) {
    score++;
    isAnswerCorrect = true;
  } else {
    isAnswerCorrect = false;
  }
}
