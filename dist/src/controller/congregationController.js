"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCongregation = void 0;
const congregationModel_1 = require("../models/congregationModel");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const addCongregation = async (req, res, next) => {
    try {
        const { congregationName, congregationState, congregationCity, zipCode } = req.body;
        let existedCongregation = await congregationModel_1.default.findOne({
            congregationName,
        });
        if (existedCongregation) {
            return next(new ApiError_1.ApiError(400, "Congregation already exists"));
        }
        else {
            const newCongregation = new congregationModel_1.default({
                congregationName,
                congregationState,
                congregationCity,
                zipCode,
            });
            await newCongregation?.save();
            let savedCongregation = await congregationModel_1.default
                .findOne({
                congregationName,
            })
                .populate("congregationState", "name")
                .populate("congregationCity", "name");
            if (!savedCongregation) {
                return next(new ApiError_1.ApiError(400, "Congregation not added"));
            }
            return res
                .status(201)
                .json(new ApiResponse_1.ApiResponse(201, "Congregation added successfully", savedCongregation));
        }
    }
    catch (error) {
        console.log("Error:", error);
        next(error);
    }
};
exports.addCongregation = addCongregation;
function next(arg0) {
    throw new Error("Function not implemented.");
}
//# sourceMappingURL=congregationController.js.map