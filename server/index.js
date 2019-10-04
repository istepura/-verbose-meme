const keys = require("./keys");

//Express setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

//PG client
const { Pool } = require("pg");
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDB,
  password: keys.pgPassword,
  port: keys.pgPort
});

pgClient.on("error", () => console.log("Lost PG connection"));

pgClient
  .query("CREATE TABLE IF NOT EXISTS values (number INT)")
  .catch(err => console.log(err));

//Redis
const redis = require("redis");
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});

const publisher = redisClient.duplicate();

//Routes
app.get("/", (req, res) => {
  res.send("Hi");
});

app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * FROM values");

  res.send(values.rows);
});

app.get("/values/current", (req, res) => {
  redisClient.hgetall("values", (err, values) => {
    res.send(values);
  });
});

app.post("/values", async (req, res) => {
  const idx = req.body.index;

  if (parseInt(idx) > 40) {
    return res.status(422).send("Index is too high");
  }
  redisClient.hset("values", idx, "None");
  publisher.publish("insert", idx);
  pgClient.query("INSERT INTO values(number) VALUES($1)", [idx]);

  res.send({ working: true });
});

app.listen(5000, err => {
  console.log("Listening");
});
