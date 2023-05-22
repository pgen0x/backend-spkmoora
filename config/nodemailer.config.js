const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const log4js = require("../config/log4js");
const logger = log4js.getLogger("config/nodemailer.config.js");

dotenv.config();

const user = process.env.MAIL_USER;
const pass = process.env.MAIL_PASS;

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: pass,
  },
});

module.exports.sendForgetPassword = (name, email, tokenForget) => {
  // console.log("Check");
  transport
    .sendMail({
      from: user,
      to: email,
      subject: "Pemulihan Kata Sandi",
      html: `<h1>Pemulihan Kata Sandi</h1>
        <h2>Hello ${name}</h2>
        <p>Kami tidak bisa begitu saja mengirimkan kata sandi lama Anda. Tautan unik untuk mengatur ulang kata sandi Anda telah dibuat untuk Anda. Untuk mengatur ulang kata sandi Anda, klik tautan berikut.</p>
         <a href=${process.env.HOST_API}/api/user/verifyresetpassword/${tokenForget}> Klik Disini</a>
        <p>Jika anda tidak merasa melakukan ini, harap abaikan pesan ini.</p>
        </div>`,
    })
    .catch((err) => logger.error(err));
};
