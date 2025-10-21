import { Router } from "express";

import { verifyJWT } from "../middleware/jwtVerify";
import { globalValidator } from "../middleware/globalValidationHandler";
import {
  checkEmail,
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
  "/signup_user",
  // globalValidator(signupUserValidation, "body"),
  upload.single("profileImage"),
  signup
);

router.post(
  "/check_email",
  globalValidator(checkEmailValidation, "body"),
  checkEmail
);

router.post(
  "/login_user",
  globalValidator(loginUserValidation, "body"),
  loginUser
);

router.post(
  "/login_mobile_number",
  globalValidator(sendMobileOTPValidation, "body"),
  loginWithMobileNumber
);

router.post(
  "/verify_otp",
  globalValidator(IDValidation, "query"),
  globalValidator(OTPVerificationValidation, "body"),
  MobileOtpVerification
);

router.post("/sso_login", globalValidator(SSOValidation, "body"), SSOLogin);

router.use(verifyJWT);
router.get("/get_users_list", getUsersList);

router.get("/user_details", getUsersById);

export default router;
