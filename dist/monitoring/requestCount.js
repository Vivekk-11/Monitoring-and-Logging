"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.histogramCount = exports.requestCount = void 0;
const prom_client_1 = __importDefault(require("prom-client"));
const requestCounter = new prom_client_1.default.Counter({
    name: "request_count",
    help: "Total request count",
    labelNames: ["method", "route", "status_code"],
});
const requestCount = (req, res, next) => {
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
exports.requestCount = requestCount;
const httpRequestDurationMicroseconds = new prom_client_1.default.Histogram({
    name: "http_request_duration_ms",
    help: "Total request count",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.1, 5, 15, 50, 100, 300, 500, 1000, 3000],
});
const histogramCount = (req, res, next) => {
    const startTime = Date.now();
    res.on("finish", () => {
        if (req.path !== "/metrics") {
            const endTime = Date.now();
            httpRequestDurationMicroseconds.observe({
                method: req.method,
                route: req.route ? req.route.path : req.path,
                status_code: res.statusCode,
            }, endTime - startTime);
        }
    });
    next();
};
exports.histogramCount = histogramCount;
