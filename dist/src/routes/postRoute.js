"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = require("../middleware/multer");
const jwtVerify_1 = require("../middleware/jwtVerify");
const globalValidationHandler_1 = require("../middleware/globalValidationHandler");
const postControllers_1 = require("../controllers/postControllers");
const JoiValidation_1 = require("../utils/JoiValidation");
const router = (0, express_1.Router)();
router.use(jwtVerify_1.verifyJWT);
router.post("/create_post", 
// globalValidator(createPostValidation, "body"),
multer_1.default.array("media", 5), postControllers_1.createPost);
router.put("/update_post/:_id", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.IDValidation, "params"), (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.updatePostValidation, "body"), postControllers_1.updatePost);
router.delete("/delete_post/:_id", postControllers_1.deletePost);
router.get("/post_details/:_id", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.IDValidation, "params"), postControllers_1.getPostById);
router.get("/all_post_details", postControllers_1.getPostByUserId);
router.get("/post_list", postControllers_1.getPostsList);
exports.default = router;
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
//# sourceMappingURL=postRoute.js.map