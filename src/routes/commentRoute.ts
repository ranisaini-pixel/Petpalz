import { Router } from "express";

import { verifyJWT } from "../middleware/jwtVerify";
import { globalValidator } from "../middleware/globalValidationHandler";
import {
  addCommentValidation,
  searchTearmValidation,
  updateCommentValidation,
  updateValidation,
} from "../utils/JoiValidation";
import {
  addComment,
  deleteComment,
  getUserComments,
  updateComment,
} from "../controllers/commentController";

const router: Router = Router();

router.use(verifyJWT);
router.post(
  "/add-comment",
  globalValidator(addCommentValidation, "body"),
  addComment
);

router.put(
  "/update-comment/:_id",
  globalValidator(updateValidation, "params"),
  globalValidator(updateCommentValidation, "body"),
  updateComment
);

router.delete("/delete-comment/:_id", deleteComment);

router.get(
  "/get-comment-list",
  globalValidator(searchTearmValidation, "query"),
  getUserComments
);

export default router;
