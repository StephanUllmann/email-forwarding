"use strict";

require("dotenv").config();
const express = require("express");
const api = express();
api.use(express.json());
api.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 8080;

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PW,
  },
});

api.get("/", (_, res) => {
  res.send("Email forwarding");
});

api.post("/", (req, res) => {
  console.log(req.body);
  const { text: txt, email, name } = req.body;
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: process.env.EMAIL_FORWARD_ADDRESS,
    subject: "Kontaktformular mariettaullmann.de",
    text: `von: ${name} \n email: ${email} \n\n ${txt}`,
    html: `<p>von: ${name}</p>
           <a href="mailto:${email}">${email}</a><br/>
           <p>${txt}</p> `,
  };

  transporter.sendMail(mailOptions, (err, inf) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(inf);
  });
});

api.listen(port, () => {
  console.log(`listening on port ${port}`);
});
