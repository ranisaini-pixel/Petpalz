"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = require("../middleware/multer");
const jwtVerify_1 = require("../middleware/jwtVerify");
const globalValidationHandler_1 = require("../middleware/globalValidationHandler");
const postControllers_1 = require("../controllers/postControllers");
const JoiValidation_1 = require("../utils/JoiValidation");
const router = (0, express_1.Router)();
router.get("/post-list", postControllers_1.getPostsList);
router.use(jwtVerify_1.verifyJWT);
router.post("/create-post", 
// globalValidator(createPostValidation, "body"),
multer_1.default.array("files", 5), postControllers_1.createPost);
router.put("/update-post/:_id", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.IDValidation, "params"), 
// globalValidator(updatePostValidation, "body"),
multer_1.default.array("files", 5), postControllers_1.updatePost);
router.delete("/delete-post/:_id", postControllers_1.deletePost);
router.get("/post-details/:_id", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.IDValidation, "params"), postControllers_1.getPostById);
exports.default = router;
//# sourceMappingURL=postRoute.js.map