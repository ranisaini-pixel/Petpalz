import * as multer from "multer";
import * as path from "path";
import * as fs from "fs";

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

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = /jpeg|jpg|png|pdf|mp4/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only images, PDFs, or videos are allowed"));
  }
};

// Create multer instance
const upload = multer({
  storage,
  // limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

export default upload;
