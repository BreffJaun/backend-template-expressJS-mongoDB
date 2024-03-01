// I M P O R T:  E X T E R N A L  D E P E N D E N C I E S
import "dotenv/config";
import nodemailer from "nodemailer";

// I M P O R T:  E N V  O P T I O N S
import { SENDER_MAIL, GMAIL_APP_PASS } from "../../config/config.js";
import {
  MAIL_SUBJECT,
  generateMailHtml,
  createVerifyToken,
} from "./nodeMailerContent.js";

//========================

// C O N F I G U R A T I O N
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: SENDER_MAIL,
    pass: GMAIL_APP_PASS,
  },
});

const mailOptions = (user, kof) => {
  // kof => "kind of function"
  const options = {
    from: SENDER_MAIL,
    to: `${user.email}`,
    subject: MAIL_SUBJECT,
    html: generateMailHtml(user, createVerifyToken(user), kof),
  };
  return options;
};

export const sendMail = async (user, kof) => {
  try {
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions(user, kof), function (error, info) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("Email sent: " + info.response);
          resolve();
        }
      });
    });
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};
