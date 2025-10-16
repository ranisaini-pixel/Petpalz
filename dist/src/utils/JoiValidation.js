"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestListByIdValidation = exports.requestListValidation = exports.searchTearmValidation = exports.addCongregationValidation = exports.changePasswordValidation = exports.resetPasswordValidation = exports.SSOValidation = exports.IDValidation = exports.OTPVerificationValidation = exports.sendMobileOTPValidation = exports.sendEmailOTPValidation = exports.loginUserValidation = exports.checkEmailValidation = exports.signupUserValidation = void 0;
const BaseJoi = require("joi");
const date_1 = require("@joi/date");
const Joi = BaseJoi.extend(date_1.default);
exports.signupUserValidation = Joi.object({
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
        "string.pattern.base": "OTP must only contain numbers (no special characters and characters).",
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
        "string.pattern.base": "Password must only contain numbers (no special characters and characters).",
    }),
});
exports.checkEmailValidation = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: ["com", "in"] } })
        .required(),
});
exports.loginUserValidation = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: ["com", "in"] } })
        .required(),
    password: Joi.string().min(6).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters long",
    }),
});
exports.sendEmailOTPValidation = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: ["com", "in"] } })
        .required(),
});
exports.sendMobileOTPValidation = Joi.object({
    mobileNumber: Joi.string()
        .pattern(/^[0-9]+$/)
        .min(10)
        .max(10)
        .required()
        .messages({
        "string.empty": "Mobile Number is required",
        "string.min": "Mobile Number must be at least 10 characters long",
        "string.pattern.base": "OTP must only contain numbers (no special characters and characters).",
    }),
});
exports.OTPVerificationValidation = Joi.object({
    otp: Joi.string()
        .pattern(/^[0-9]+$/)
        .min(4)
        .max(4)
        .required()
        .messages({
        "string.empty": "OTP is required",
        "string.min": "OTP must be at least 4 characters long",
        "string.pattern.base": "OTP must only contain numbers (no special characters and characters).",
    }),
});
exports.IDValidation = Joi.object({
    _id: Joi.string().hex().length(24).required().messages({
        "string.empty": "_id is required",
        "string.hex": "_id must be a valid hex string",
        "string.length": "_id must be 24 characters long",
    }),
});
exports.SSOValidation = Joi.object({
    // email, SSOType, socialId
    email: Joi.string()
        .email({ tlds: { allow: ["com", "in"] } })
        .required(),
    SSOType: Joi.string().trim().valid("1", "2", "3", "4"),
    socialId: Joi.string().length(5).messages({
        "string.length": "socialId must be 5 characters long",
    }),
});
exports.resetPasswordValidation = Joi.object({
    password: Joi.string()
        .min(8)
        .max(15)
        .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,15}$/, "password")
        .required()
        .messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.max": "Password must be at most 15 characters long",
        "string.pattern.name": "Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
    }),
    confirmPassword: Joi.string()
        .min(8)
        .max(15)
        .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,15}$/, "password")
        .required()
        .messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.max": "Password must be at most 15 characters long",
        "string.pattern.name": "Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
    }),
});
exports.changePasswordValidation = Joi.object({
    oldPassword: Joi.string()
        .min(8)
        .max(15)
        .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,15}$/, "password")
        .required()
        .messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.max": "Password must be at most 15 characters long",
        "string.pattern.name": "Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
    }),
    currentPassword: Joi.string()
        .min(8)
        .max(15)
        .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,15}$/, "password")
        .required()
        .messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.max": "Password must be at most 15 characters long",
        "string.pattern.name": "Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
    }),
    confirmPassword: Joi.string()
        .min(8)
        .max(15)
        .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,15}$/, "password")
        .required()
        .messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.max": "Password must be at most 15 characters long",
        "string.pattern.name": "Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
    }),
});
exports.addCongregationValidation = Joi.object({
    congregationName: Joi.string().trim().required().messages({
        "string.empty": "First Name is required",
    }),
    congregationState: Joi.string().trim().required().messages({
        "string.empty": "Last Name is required",
    }),
    congregationCity: Joi.string().trim().required().messages({
        "string.empty": "Last Name is required",
    }),
    zipCode: Joi.string()
        .pattern(/^[0-9]+$/)
        .min(6)
        .max(6)
        .required()
        .messages({
        "string.empty": "Pin Code is required",
        "string.min": "Pin Code must be at least 6 characters long",
        "string.pattern.base": "Password must only contain numbers (no special characters and characters).",
    }),
});
exports.searchTearmValidation = Joi.object({
    searchTerm: Joi.string().trim().required().messages({
        "string.empty": "searchTearm is required",
    }),
    limit: Joi.number().min(1).max(100).optional(),
    page: Joi.number().min(1).max(100).required().messages({
        "string.empty": "Page is required",
    }),
});
exports.requestListValidation = Joi.object({
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
exports.requestListByIdValidation = Joi.object({
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
//# sourceMappingURL=JoiValidation.js.map