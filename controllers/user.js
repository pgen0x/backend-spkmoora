const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const log4js = require("../config/log4js");
const logger = log4js.getLogger("controllers/user.js");
const { Users } = require("../models");
const JWT_KEY = process.env.JWT_KEY;

exports.userLogin = (req, res, next) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Login user'
  const email = req.body.email;
  const pass = req.body.password;
  // logger.debug(`email: ${email}, pass: ${pass}`);
  let fetchedUser;
  Users.findOne({ where: { email } })
    .then((user) => {
      if (user === null) {
        logger.error(`Auth failed, not found`);
        return res.status(401).json({
          error: {
            messages: "Your email or password is incorrect",
          },
        });
      } else {
        fetchedUser = user;
        if (fetchedUser) {
          bcrypt.compare(pass, user.password).then((result) => {
            console.log("result:", result);
            if (!result) {
              logger.error(`Auth failed, invalid password`);
              return res.status(401).json({
                error: {
                  messages: "Your email or password is incorrect",
                },
              });
            }
            const token = jwt.sign(
              { email: fetchedUser.email, userId: fetchedUser.id },
              JWT_KEY,
              { expiresIn: "24h" }
            );

            res.status(200).json({
              token: token,
              expiresIn: 86400,
              user: {
                fetchedUser,
              },
            });
          });
        }
      }
    })
    .catch((error) => {
      logger.error(`error: Email ${error}`);
      return res.status(401).json({
        error: {
          messages: "Invalid authentication credentials!",
        },
      });
    });
};
