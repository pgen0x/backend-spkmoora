const express = require("express");
const session = require("cookie-session");
const cors = require("cors");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");
const log4js = require("./config/log4js");
const logger = log4js.getLogger("app.js");
const userRoutes = require("./routes/user");
const JenisKendaraanRoutes = require("./routes/jenis_kendaraan");
const KriteriaPenilaianRoutes = require("./routes/kriteria_penilaian");

const { buildError } = require("express-ez-405");

const sessOption = {
  secret: "123456",
  cookie: {
    maxAge: 269999999999,
  },
  saveUninitialized: false,
  resave: true,
};

const app = express();
app.options("*", cors());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session(sessOption));
app.use((req, res, next) => {
  const allowedOrigins = ["http://localhost:3001"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  // res.setHeader("Access-Control-Allow-Origin", "*.codermatter.com");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/user", userRoutes);
app.use("/api/jeniskendaraan", JenisKendaraanRoutes);
app.use("/api/kriteriapenilaian", KriteriaPenilaianRoutes);

const awaitHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

app.get(
  "/health",
  awaitHandler(async (req, res) => {
    // #swagger.tags = ['Default']
    // #swagger.summary = 'Health check - can be called by load balancer to check health of REST API'
    logger.debug(`${req.protocol}, ${req.ip}, ${req.originalUrl}`);
    res.sendStatus(200);
  })
);

app.get(
  "/",
  awaitHandler(async (req, res) => {
    // #swagger.tags = ['Default']
    // #swagger.summary = 'Index'
    logger.debug(`${req.protocol}, ${req.ip}, ${req.originalUrl}`);
    res.sendStatus(403);
  })
);

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

/// 405 & 404 error catcher
app.use("", (req, _, next) => {
  const err = buildError(app, req);
  if (!err) return next();
  return next(err);
});
// 405 & 404 error catcher

// Error handling
app.use((err, _, res, __) =>
  res.status(err.status).json({ message: err.message })
);
// Error handling

module.exports = app;
