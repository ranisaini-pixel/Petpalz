"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoutes_1 = require("./userRoutes");
const postRoute_1 = require("./postRoute");
const likeRoute_1 = require("./likeRoute");
const commentRoute_1 = require("./commentRoute");
const router = (0, express_1.Router)();
router.use("/user", userRoutes_1.default);
router.use("/post", postRoute_1.default);
router.use("/like", likeRoute_1.default);
router.use("/comment", commentRoute_1.default);
exports.default = router;
//# sourceMappingURL=routev1.js.map