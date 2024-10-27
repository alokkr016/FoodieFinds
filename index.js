const express = require("express");
let cors = require("cors");
let sqlite3 = require("sqlite3");
let { open } = require("sqlite");

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.static("static"));

let db;

(async () => {
  db = await open({
    filename: "./BD4_Assignment1/database.sqlite",
    driver: sqlite3.Database,
  });
})();

async function fetchAllResturants() {
  let query = "SELECT * from restaurants";
  let response = await db.all(query, []);
  return { resturants: response };
}

app.get("/restaurants", async (req, res) => {
  let results = await fetchAllResturants();
  res.status(200).json(results);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
