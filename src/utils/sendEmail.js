import nodemailer from "nodemailer";

async function sendEmail({
  to = [],
  cc,
  bcc,
  subject,
  text,
  html,
  attachments = [],
} = {}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"Muhammad MVC👻" <${process.env.EMAIL}>`, // sender address

    to, // list of receivers
    cc,
    bcc,

    subject, // Subject line
    text, // plain text body
    html, // html body
    attachments,
  });
  console.log(info);
  return info.rejected.length ? false : true;
}

export default sendEmail;
