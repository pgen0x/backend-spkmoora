const jwt = require("jsonwebtoken");
const log4js = require("../config/log4js");
const logger = log4js.getLogger("middleware/check-auth");

const JWT_KEY = process.env.JWT_KEY;

function verifyToken(req, res, next) {
  // Get auth header value
  const authHeader = req.headers["authorization"];

  // Check if auth header is present
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized access." });
  }

  // Split auth header value into bearer token format
  const bearerToken = authHeader.split(" ")[1];

  // Check if bearer token is present
  if (!bearerToken) {
    return res
      .status(401)
      .json({ message: "Unauthorized access. No token provided." });
  }

  try {
    // Verify the token using the JWT_SECRET
    const decoded = jwt.verify(bearerToken, JWT_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid token. Unauthorized access." });
  }
}

module.exports = verifyToken;
