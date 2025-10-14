"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paramsValidator = exports.queryvalidator = exports.validate = void 0;
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                code: 400,
                message: error.message,
            });
        }
        next();
    };
};
exports.validate = validate;
const queryvalidator = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.query, { abortEarly: false });
        if (error) {
            //   return res.status(400).json(new ApiResponse(400,err))
            return res.status(400).json({
                code: 400,
                message: error.message,
            });
        }
        next();
    };
};
exports.queryvalidator = queryvalidator;
const paramsValidator = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.params, { abortEarly: false });
        if (error) {
            //   return res.status(400).json(new ApiResponse(400,err))
            return res.status(400).json({
                code: 400,
                message: error.message,
            });
        }
        next();
    };
};
exports.paramsValidator = paramsValidator;
//# sourceMappingURL=ValidateSchema.js.map