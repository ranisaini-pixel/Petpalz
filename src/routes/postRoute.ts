import { Router } from "express";
import upload from "../middleware/multer";
import { verifyJWT } from "../middleware/jwtVerify";
import { globalValidator } from "../middleware/globalValidationHandler";
import {
  createPost,
  deletePost,
  getPostById,
  getPostByUserId,
  getPostsList,
  updatePost,
} from "../controllers/postControllers";
import {
  createPostValidation,
  IDValidation,
  updatePostValidation,
} from "../utils/JoiValidation";

const router: Router = Router();

router.use(verifyJWT);
router.post(
  "/create_post",
  // globalValidator(createPostValidation, "body"),
  upload.array("files", 5),
  createPost
);

router.put(
  "/update_post/:_id",
  globalValidator(IDValidation, "params"),
  globalValidator(updatePostValidation, "body"),
  updatePost
);

router.delete("/delete_post/:_id", deletePost);

router.get(
  "/post_details/:_id",
  globalValidator(IDValidation, "params"),
  getPostById
);

router.get("/all_post_details", getPostByUserId);

router.get("/post_list", getPostsList);

export default router;

// Multiple files upload
// router.post(
//   "/upload-multiple",
//   upload.array("files", 5),
//   (req: Request, res: Response) => {
//     if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
//       return res.status(400).json({ message: "No files uploaded" });
//     }
//     res.status(200).json({
//       message: "Files uploaded successfully",
//       files: req.files,
//     });
//   }
// );
