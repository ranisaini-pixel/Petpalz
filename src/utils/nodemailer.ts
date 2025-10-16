import * as nodemailer from "nodemailer";
import * as dotenv from "dotenv";

dotenv.config();

const { EMAIL, PASSWORD } = process.env as {
  EMAIL: string;
  PASSWORD: string;
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
});

export const sendMail = async (to: string, subject: string, html: string) => {
  try {
    const mailOptions = {
      from: EMAIL,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.log("Error:", error);
  }
};
