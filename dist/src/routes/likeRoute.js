"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwtVerify_1 = require("../middleware/jwtVerify");
const likeControlle_1 = require("../controllers/likeControlle");
// import { likeCommentValidation } from "../utils/JoiValidation";
const router = (0, express_1.Router)();
router.use(jwtVerify_1.verifyJWT);
router.post("/toggleLike", 
//   globalValidator(likeCommentValidation, "body"),
likeControlle_1.toggleLike);
exports.default = router;
//# sourceMappingURL=likeRoute.js.map