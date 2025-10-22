import { Router } from "express";
import upload from "../middleware/multer";
import { verifyJWT } from "../middleware/jwtVerify";
import { globalValidator } from "../middleware/globalValidationHandler";
import {
  createPost,
  deletePost,
  getPostById,
  getPostsList,
  updatePost,
} from "../controllers/postControllers";
import {
  createPostValidation,
  IDValidation,
  updatePostValidation,
} from "../utils/JoiValidation";

const router: Router = Router();

router.get("/post-list", getPostsList);

router.use(verifyJWT);
router.post(
  "/create-post",
  // globalValidator(createPostValidation, "body"),
  upload.array("files", 5),
  createPost
);

router.put(
  "/update-post/:_id",
  globalValidator(IDValidation, "params"),
  // globalValidator(updatePostValidation, "body"),
  upload.array("files", 5),
  updatePost
);

router.delete("/delete-post/:_id", deletePost);

router.get(
  "/post-details/:_id",
  globalValidator(IDValidation, "params"),
  getPostById
);

export default router;
