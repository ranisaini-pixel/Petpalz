"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAvailabilityList = exports.userAvailability = void 0;
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const userAvailabilityModel_1 = require("../models/userAvailabilityModel");
const userAvailability = async (req, res, next) => {
    try {
        const { expiry } = req.body;
        const userId = res.locals.user._id;
        if (!userId) {
            return next(new ApiError_1.ApiError(400, "Unauthorised "));
        }
        const expiryDate = new Date(expiry);
        const now = new Date();
        const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
        if (expiryDate < oneHourFromNow) {
            return res.status(400).json({
                code: 400,
                message: "Availability must be at least one hour from now.",
            });
        }
        const existing = await userAvailabilityModel_1.default.findOne({ userId });
        if (existing) {
            existing.expiry = expiryDate;
        }
        else {
            const newUserAvailability = new userAvailabilityModel_1.default({
                userId,
                expiry: expiryDate,
            });
            await newUserAvailability.save();
        }
        // const isAvailable = expiryDate > now;
        return res
            .status(201)
            .json(new ApiResponse_1.ApiResponse(201, "Expiry Time set successfully", {}));
    }
    catch (error) {
        console.log("Error:", error);
        next(error);
    }
};
exports.userAvailability = userAvailability;
const getUserAvailabilityList = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, searchTerm = "" } = req.query;
        const pipeline = [
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userAvailabilityDetails",
                },
            },
            { $unwind: "$userAvailabilityDetails" },
        ];
        if (searchTerm && searchTerm !== "") {
            pipeline.push({
                $match: {
                    $or: [
                        {
                            "userAvailabilityDetails.firstName": {
                                $regex: searchTerm,
                                $options: "i",
                            },
                        },
                        {
                            "userAvailabilityDetails.lastName": {
                                $regex: searchTerm,
                                $options: "i",
                            },
                        },
                    ],
                },
            });
        }
        pipeline.push({
            $project: {
                firstName: "$userAvailabilityDetails.firstName",
                lastName: "$userAvailabilityDetails.lastName",
                gender: "$userAvailabilityDetails.gender",
                expiry: "$userAvailabilityDetails.expiry",
                congregationName: "$userAvailabilityDetails.congregationName",
                pinCode: "$userAvailabilityDetails.pinCode",
            },
        });
        pipeline.push({ $sort: { createdAt: -1 } }, { $skip: (Number(page) - 1) * Number(limit) }, { $limit: Number(limit) });
        const result = await userAvailabilityModel_1.default.aggregate(pipeline);
        return res.status(201).json(new ApiResponse_1.ApiResponse(201, "getting list successfully", {
            result,
            page,
            limit,
        }));
    }
    catch (error) {
        next(error);
        console.log("Error:", error);
    }
};
exports.getUserAvailabilityList = getUserAvailabilityList;
//# sourceMappingURL=userAvailabilityController.js.map