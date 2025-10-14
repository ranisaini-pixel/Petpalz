"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const { EMAIL, PASSWORD } = process.env;
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: EMAIL,
        pass: PASSWORD,
    },
});
const sendMail = async (to, subject, html) => {
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
    }
    catch (error) {
        console.log("Error:", error);
    }
};
exports.sendMail = sendMail;
//# sourceMappingURL=nodemailer.js.map