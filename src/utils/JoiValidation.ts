import * as BaseJoi from "joi";
import JoiDate from "@joi/date";
const Joi = BaseJoi.extend(JoiDate);

export const signupUserValidation = Joi.object({
  userName: Joi.string().trim().required().messages({
    "string.empty": "User Name is required",
  }),
  fullName: Joi.string().trim(),
  email: Joi.string()
    .email({ tlds: { allow: ["com", "in"] } })
    .required(),
  mobileNumber: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .max(10)
    .required()
    .messages({
      "string.empty": "Mobile Number is required",
      "string.min": "Mobile Number must be at least 10 characters long",
      "string.pattern.base":
        "OTP must only contain numbers (no special characters and characters).",
    }),
  dateOfBirth: Joi.string().required(),
  password: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(6)
    .max(6)
    .trim()
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters long",
      "string.pattern.base":
        "Password must only contain numbers (no special characters and characters).",
    }),
});

export const checkEmailValidation = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: ["com", "in"] } })
    .required(),
});

export const loginUserValidation = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: ["com", "in"] } })
    .required(),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
  }),
});

export const sendEmailOTPValidation = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: ["com", "in"] } })
    .required(),
});

export const sendMobileOTPValidation = Joi.object({
  mobileNumber: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(10)
    .max(10)
    .required()
    .messages({
      "string.empty": "Mobile Number is required",
      "string.min": "Mobile Number must be at least 10 characters long",
      "string.pattern.base":
        "OTP must only contain numbers (no special characters and characters).",
    }),
});

export const OTPVerificationValidation = Joi.object({
  otp: Joi.string()
    .pattern(/^[0-9]+$/)
    .min(4)
    .max(4)
    .required()
    .messages({
      "string.empty": "OTP is required",
      "string.min": "OTP must be at least 4 characters long",
      "string.pattern.base":
        "OTP must only contain numbers (no special characters and characters).",
    }),
});

export const IDValidation = Joi.object({
  _id: Joi.string().hex().length(24).required().messages({
    "string.empty": "_id is required",
    "string.hex": "_id must be a valid hex string",
    "string.length": "_id must be 24 characters long",
  }),
});

export const SSOValidation = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: ["com", "in"] } })
    .required(),

  SSOType: Joi.string().trim().valid("1", "2", "3", "4"),
  socialId: Joi.string().length(5).messages({
    "string.length": "socialId must be 5 characters long",
  }),
});

export const resetPasswordValidation = Joi.object({
  password: Joi.string()
    .min(8)
    .max(15)
    .pattern(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,15}$/,
      "password"
    )
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password must be at most 15 characters long",
      "string.pattern.name":
        "Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
    }),

  confirmPassword: Joi.string()
    .min(8)
    .max(15)
    .pattern(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,15}$/,
      "password"
    )
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password must be at most 15 characters long",
      "string.pattern.name":
        "Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
    }),
});

export const changePasswordValidation = Joi.object({
  oldPassword: Joi.string()
    .min(8)
    .max(15)
    .pattern(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,15}$/,
      "password"
    )
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password must be at most 15 characters long",
      "string.pattern.name":
        "Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
    }),
  currentPassword: Joi.string()
    .min(8)
    .max(15)
    .pattern(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,15}$/,
      "password"
    )
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password must be at most 15 characters long",
      "string.pattern.name":
        "Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
    }),

  confirmPassword: Joi.string()
    .min(8)
    .max(15)
    .pattern(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,15}$/,
      "password"
    )
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password must be at most 15 characters long",
      "string.pattern.name":
        "Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
    }),
});

export const searchTearmValidation = Joi.object({
  searchTerm: Joi.string().trim().required().messages({
    "string.empty": "searchTearm is required",
  }),
  limit: Joi.number().min(1).max(100).optional(),
  page: Joi.number().min(1).max(100).required().messages({
    "string.empty": "Page is required",
  }),
});

export const requestListValidation = Joi.object({
  searchTerm: Joi.string().trim().optional().messages({
    "string.empty": "searchTearm is required",
  }),
  limit: Joi.number().min(1).max(100).optional(),
  page: Joi.number().min(1).max(100).required().messages({
    "string.empty": "Page is required",
  }),
  type: Joi.string().trim().valid("0", "1").required().messages({
    "string.empty": "Type is required",
  }),
});

export const requestListByIdValidation = Joi.object({
  searchTerm: Joi.string().trim().optional().messages({
    "string.empty": "searchTearm is required",
  }),
  limit: Joi.number().min(1).max(100).optional(),
  page: Joi.number().min(1).max(100).required().messages({
    "string.empty": "Page is required",
  }),
  type: Joi.string().trim().valid("0", "3").required().messages({
    "string.empty": "Type is required",
  }),
  _id: Joi.string().hex().length(24).required().messages({
    "string.empty": "_id is required",
    "string.hex": "_id must be a valid hex string",
    "string.length": "_id must be 24 characters long",
  }),
});

export const createPostValidation = Joi.object({
  file: Joi.string().optional(),
  content: Joi.string().min(5).max(150).required(),
  author: Joi.string().hex().length(24).required().messages({
    "string.empty": "_id is required",
    "string.hex": "_id must be a valid hex string",
    "string.length": "_id must be 24 characters long",
  }),
});

export const updatePostValidation = Joi.object({
  content: Joi.string().min(5).max(150).required(),
});
