"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multer = require("multer");
const path = require("path");
const fs = require("fs");
// Define upload folder
const uploads = path.join(__dirname, "../../uploads");
// Create folder if it doesn’t exist
if (!fs.existsSync(uploads)) {
    fs.mkdirSync(uploads, { recursive: true });
}
// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploads); // where files will be saved
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
});
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|mp4/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) {
        cb(null, true);
    }
    else {
        cb(new Error("Only images, PDFs, or videos are allowed"));
    }
};
// Create multer instance
const upload = multer({
    storage,
    // limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter,
});
exports.default = upload;
//# sourceMappingURL=multer.js.map