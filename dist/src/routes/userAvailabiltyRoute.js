"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const globalValidationHandler_1 = require("../middleware/globalValidationHandler");
const userAvailabilityController_1 = require("../controller/userAvailabilityController");
const JoiValidation_1 = require("../utils/JoiValidation");
const jwtVerify_1 = require("../middleware/jwtVerify");
const router = (0, express_1.Router)();
router.use(jwtVerify_1.verifyJWT);
router.put("/availability", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.userAvailabilityValidation, "body"), userAvailabilityController_1.userAvailability);
router.get("/getUserAvailabilityList", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.searchTearmValidation, "query"), userAvailabilityController_1.getUserAvailabilityList);
exports.default = router;
//# sourceMappingURL=userAvailabiltyRoute.js.map