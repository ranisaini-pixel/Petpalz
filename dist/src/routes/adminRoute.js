"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const globalValidationHandler_1 = require("../middleware/globalValidationHandler");
const JoiValidation_1 = require("../utils/JoiValidation");
const adminController_1 = require("../controller/adminController");
const userController_1 = require("../controller/userController");
const jwtVerify_1 = require("../middleware/jwtVerify");
const router = (0, express_1.Router)();
router.post("/loginAdmin", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.loginUserValidation, "body"), adminController_1.loginAdmin);
router.post("/adminForgotPassword", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.sendOTPValidation, "body"), adminController_1.ForgotPassword);
router.post("/resetPassword", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.updateValidation, "query"), (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.resetPasswordValidation, "body"), userController_1.resetPassword);
router.post("/changePassword", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.updateValidation, "query"), (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.changePasswordValidation, "body"), userController_1.changePassword);
router.use(jwtVerify_1.verifyJWT);
router.get("/adminDetails", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.updateValidation, "query"), adminController_1.getAdminDetails);
exports.default = router;
//# sourceMappingURL=adminRoute.js.map