import { request, RequestHandler } from "express";
import client from "prom-client";

const requestCounter = new client.Counter({
  name: "request_count",
  help: "Total request count",
  labelNames: ["method", "route", "status_code"],
});

export const requestCount: RequestHandler = (req, res, next) => {
  res.on("finish", () => {
    if (req.path !== "/metrics") {
      console.log("STATUS", res.status, res.statusCode);
      const { method } = req;
      requestCounter.inc({
        method,
        route: req.route ? req.route.path : req.path,
        status_code: res.statusCode,
      });
    }
  });

  next();
};

const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Total request count",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 5, 15, 50, 100, 300, 500, 1000, 3000],
});

export const histogramCount: RequestHandler = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", () => {
    if (req.path !== "/metrics") {
      const endTime = Date.now();
      httpRequestDurationMicroseconds.observe(
        {
          method: req.method,
          route: req.route ? req.route.path : req.path,
          status_code: res.statusCode,
        },
        endTime - startTime
      );
    }
  });

  next();
};
