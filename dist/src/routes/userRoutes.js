"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwtVerify_1 = require("../middleware/jwtVerify");
const globalValidationHandler_1 = require("../middleware/globalValidationHandler");
const userControllers_1 = require("../controllers/userControllers");
const JoiValidation_1 = require("../utils/JoiValidation");
const router = (0, express_1.Router)();
router.post("/signup_user", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.signupUserValidation, "body"), userControllers_1.signup);
router.post("/check_email", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.checkEmailValidation, "body"), userControllers_1.checkEmail);
router.post("/login_user", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.loginUserValidation, "body"), userControllers_1.loginUser);
router.post("/login_mobile_number", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.sendMobileOTPValidation, "body"), userControllers_1.loginWithMobileNumber);
router.post("/verify_otp", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.IDValidation, "query"), (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.OTPVerificationValidation, "body"), userControllers_1.MobileOtpVerification);
router.post("/sso_login", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.SSOValidation, "body"), userControllers_1.SSOLogin);
router.use(jwtVerify_1.verifyJWT);
router.get("/get_users_list", userControllers_1.getUsersList);
router.get("/user_details", userControllers_1.getUsersById);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map