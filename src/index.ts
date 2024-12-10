import express from "express";
import { histogramCount, requestCount } from "./monitoring/requestCount";
import client from "prom-client";

const app = express();

app.use(express.json());

app.use(histogramCount);

app.get("/user", (req, res) => {
  res.status(200).json({ message: "successful user!" });
});

app.get("/users", (req, res) => {
  res.status(200).json({ message: "successful users!" });
});

app.get("/metrics", async (req, res) => {
  const metrics = await client.register.metrics();
  res.set("Content-Type", client.register.contentType);
  res.end(metrics);
});

app.listen(3000, () => {
  console.log("it's running in localhost:3000");
});
