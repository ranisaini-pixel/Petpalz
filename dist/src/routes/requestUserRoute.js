"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const globalValidationHandler_1 = require("../middleware/globalValidationHandler");
const requestUser_1 = require("../controller/requestUser");
const jwtVerify_1 = require("../middleware/jwtVerify");
const JoiValidation_1 = require("../utils/JoiValidation");
const router = (0, express_1.Router)();
router.use(jwtVerify_1.verifyJWT);
router.post("/availabilityRequest", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.userAvailabilityRequestValidation, "body"), requestUser_1.userAvailabilityRequest);
router.put("/responsAvailabilityRequest/:_id", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.updateValidation, "params"), (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.respondToAvailabilityRequestValidation, "body"), requestUser_1.respondToAvailabilityRequest);
router.get("/requestList", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.requestListValidation, "query"), requestUser_1.getAvailabilityRequestsList);
router.get("/requestListById", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.requestListByIdValidation, "query"), requestUser_1.getRequestById);
exports.default = router;
//# sourceMappingURL=requestUserRoute.js.map