"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwtVerify_1 = require("../middleware/jwtVerify");
const globalValidationHandler_1 = require("../middleware/globalValidationHandler");
const JoiValidation_1 = require("../utils/JoiValidation");
const commentController_1 = require("../controllers/commentController");
const router = (0, express_1.Router)();
router.use(jwtVerify_1.verifyJWT);
router.post("/add-comment", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.addCommentValidation, "body"), commentController_1.addComment);
router.put("/update-comment/:_id", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.updateValidation, "params"), (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.updateCommentValidation, "body"), commentController_1.updateComment);
router.delete("/delete-comment/:_id", commentController_1.deleteComment);
router.get("/get-comment-list", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.searchTearmValidation, "query"), commentController_1.getUserComments);
exports.default = router;
//# sourceMappingURL=commentRoute.js.map