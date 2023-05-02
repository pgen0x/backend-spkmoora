const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const log4js = require("../config/log4js");
const logger = log4js.getLogger("controllers/user.js");
const { Users } = require("../models");
const nodemailer = require("../config/nodemailer.config");
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
            messages: "Email atau password salah",
          },
        });
      } else {
        fetchedUser = user;
        if (fetchedUser) {
          bcrypt.compare(pass, user.password).then((result) => {
            if (!result) {
              logger.error(`Auth failed, invalid password`);
              return res.status(401).json({
                error: {
                  messages: "Email atau password salah",
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
          messages: "Terjadi kesalahan!",
        },
      });
    });
};

exports.forgetPassword = async (req, res, next) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Reset password'

  const email = req.body.email;
  Users.findOne({ where: { email } }).then((result) => {
    if (!result) {
      return res.status(400).send({
        error: {
          messages: "Alamat email tidak terdaftar",
        },
      });
    } else {
      const characters =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let token = "";
      for (let i = 0; i < 35; i++) {
        token += characters[Math.floor(Math.random() * characters.length)];
      }
      result.token = token;
      result
        .save()
        .then((resultsave) => {
          logger.info("res" + JSON.stringify(resultsave));

          nodemailer.sendForgetPassword(
            resultsave.email,
            resultsave.email,
            resultsave.token
          );
          return res.status(200).send({
            success: {
              messages: "Password recovery sudah dikirimkan ke email anda",
            },
          });
        })
        .catch((error) => {
          logger.error("error" + error);
          return res.status(500).send({
            error: {
              messages: "Password recovery gagal dikirimkan ke email anda",
            },
          });
        });
    }
  });
};

exports.VerifyResetPassword = (req, res, next) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Verify password a user with token'

  Users.findOne({
    where: { token: req.params.token },
  })
    .then((user) => {
      if (!user) {
        return res.status(400).send({
          error: {
            messages: "Token not valid or expired",
          },
        });
      }

      if (user) {
        return res
          .writeHead(301, {
            Location: `${process.env.HOST}/resetpassword?email=${user.email}&token=${req.params.token}`,
          })
          .end();
      }
    })
    .catch((e) => {
      logger.error(e);
      res.status(500).json({
        error: {
          messages: `${e}`,
        },
      });
    });
};

exports.resetpassword = async (req, res, next) => {
  // #swagger.tags = ['User']
  // #swagger.summary = 'Reset password a user with token'

  const token = req.body.token;

  let newPassword;
  if (req.body.newPassword) {
    await bcrypt.hash(req.body.newPassword, 10).then(function (hash) {
      newPassword = hash;
      return hash;
    });
  }

  Users.findOne({ where: { token: token } }).then((user) => {
    if (!user) {
      return res.status(400).send({
        error: {
          messages: "Token tidak valid atau kadaluarsa",
        },
      });
    } else {
      user.password = newPassword;
      user.token = "";
      user
        .save()
        .then((result) => {
          return res.status(200).send({
            success: {
              messages: "Kata sandi berhasil di ubah",
            },
          });
        })
        .catch((err) => {
          logger.error(err);
          return res.status(500).send({
            error: {
              messages: "Terjadi Kesalahan",
            },
          });
        });
    }
  });
};
