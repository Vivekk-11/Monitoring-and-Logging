import express from "express";

const app = express();

app.use(express.json());

app.get("/user", (req, res) => {
  res.json({ message: "successful user!" });
});

app.get("/users", (req, res) => {
  res.json({ message: "successful users!" });
});

app.listen(3000);
