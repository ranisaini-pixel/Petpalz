import { Router } from "express";

import { verifyJWT } from "../middleware/jwtVerify";
import { globalValidator } from "../middleware/globalValidationHandler";
import { toggleLike } from "../controllers/likeControlle";
// import { likeCommentValidation } from "../utils/JoiValidation";

const router: Router = Router();

router.use(verifyJWT);
router.post(
  "/toggleLike",
  //   globalValidator(likeCommentValidation, "body"),
  toggleLike
);

export default router;
