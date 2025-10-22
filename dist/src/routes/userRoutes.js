"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwtVerify_1 = require("../middleware/jwtVerify");
const globalValidationHandler_1 = require("../middleware/globalValidationHandler");
const userControllers_1 = require("../controllers/userControllers");
const JoiValidation_1 = require("../utils/JoiValidation");
const multer_1 = require("../middleware/multer");
const router = (0, express_1.Router)();
router.post("/signup", 
// globalValidator(signupUserValidation, "body"),
multer_1.default.single("profileImage"), userControllers_1.signup);
router.post("/check-email", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.checkEmailValidation, "body"), userControllers_1.checkEmail);
router.post("/login", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.loginUserValidation, "body"), userControllers_1.loginUser);
router.post("/login-mobile-number", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.sendMobileOTPValidation, "body"), userControllers_1.loginWithMobileNumber);
router.post("/verify-otp", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.OTPVerificationValidation, "body"), userControllers_1.MobileOtpVerification);
router.post("/sso-login", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.SSOValidation, "body"), userControllers_1.SSOLogin);
router.use(jwtVerify_1.verifyJWT);
router.get("/get-users-list", userControllers_1.getUsersList); //validation
router.get("/user-details", userControllers_1.getUsersById);
router.get("/all_post_details", userControllers_1.getUserPosts);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map