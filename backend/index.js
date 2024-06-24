import express from "express";
import cors from 'cors';
import db from "./oracle-cards-20230607210323.json" assert { type: "json" };

const app = express()
const port = 3000

// Middlewares
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use(express.json())
app.use(cors())

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', (req, res) => {
  res.send(db.slice(0, 10))
})

app.options('/deck', (req, res) => {
  res.sendStatus(200)
})

app.post('/deck', (req, res) => {
  const numSet = new Set(req.body.cards)
  const foundSet = new Set();
  const ret = []
  for (const card of db) {
    if (numSet.has(card.name)) {
      ret.push(card);
      foundSet.add(card.name)
    }
  }
  console.log("Found: ", ret.length)
  for (const c of numSet) {
    if (!foundSet.has(c)) {
      console.log("Missing: ", c);
    }
  }
  res.json({cards: ret})
})

app.listen(port, () => {
  // console.log(`Example app listening on port ${port}`)
})