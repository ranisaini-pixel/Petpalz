"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const globalValidationHandler_1 = require("../middleware/globalValidationHandler");
const congregationController_1 = require("../controller/congregationController");
const JoiValidation_1 = require("../utils/JoiValidation");
const router = (0, express_1.Router)();
router.post("/addCongregation", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.addCongregationValidation, "body"), congregationController_1.addCongregation);
exports.default = router;
//# sourceMappingURL=congregationRoute.js.map