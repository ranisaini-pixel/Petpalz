import { Router } from "express";

import { verifyJWT } from "../middleware/jwtVerify";
import { globalValidator } from "../middleware/globalValidationHandler";
import {
  checkEmail,
  getUserPosts,
  getUsersById,
  getUsersList,
  loginUser,
  loginWithMobileNumber,
  MobileOtpVerification,
  signup,
  SSOLogin,
} from "../controllers/userControllers";
import {
  checkEmailValidation,
  IDValidation,
  loginUserValidation,
  OTPVerificationValidation,
  sendMobileOTPValidation,
  signupUserValidation,
  SSOValidation,
} from "../utils/JoiValidation";
import upload from "../middleware/multer";
const router: Router = Router();

router.post(
  "/signup",
  // globalValidator(signupUserValidation, "body"),
  upload.single("profileImage"),
  signup
);

router.post(
  "/check-email",
  globalValidator(checkEmailValidation, "body"),
  checkEmail
);

router.post("/login", globalValidator(loginUserValidation, "body"), loginUser);

router.post(
  "/login-mobile-number",
  globalValidator(sendMobileOTPValidation, "body"),
  loginWithMobileNumber
);

router.post(
  "/verify-otp",
  globalValidator(OTPVerificationValidation, "body"),
  MobileOtpVerification
);

router.post("/sso-login", globalValidator(SSOValidation, "body"), SSOLogin);

router.use(verifyJWT);
router.get("/get-users-list", getUsersList); //validation

router.get("/user-details", getUsersById);

router.get("/all_post_details", getUserPosts);

export default router;
