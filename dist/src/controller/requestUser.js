"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestById = exports.getAvailabilityRequestsList = exports.respondToAvailabilityRequest = exports.userAvailabilityRequest = void 0;
const ApiResponse_1 = require("../utils/ApiResponse");
const ApiError_1 = require("../utils/ApiError");
const userAvailabilityModel_1 = require("../models/userAvailabilityModel");
const mongoose_1 = require("mongoose");
const requestUserModel_1 = require("../models/requestUserModel");
const userAvailabilityRequest = async (req, res, next) => {
    try {
        const { receiverId, preference, numberOfPassenger } = req.body;
        const senderId = res.locals.user._id;
        if (!senderId) {
            return next(new ApiError_1.ApiError(400, "Unauthorised "));
        }
        const existingRequest = await requestUserModel_1.default.findOne({
            receiverId,
            senderId,
            preference: preference,
            status: "0",
        });
        if (existingRequest) {
            return next(new ApiError_1.ApiError(400, "Request already sent and pending"));
        }
        if (preference === "0") {
            const newRequest = new requestUserModel_1.default({
                receiverId,
                senderId,
                preference,
                numberOfPassenger: numberOfPassenger,
                status: "0",
            });
            await newRequest?.save();
            return res
                .status(200)
                .json(new ApiResponse_1.ApiResponse(200, "Availability request sent successfully", newRequest));
        }
        else {
            const newRequest = new requestUserModel_1.default({
                receiverId,
                senderId,
                preference,
                numberOfPassenger: null,
                status: "0",
            });
            await newRequest?.save();
            return res
                .status(200)
                .json(new ApiResponse_1.ApiResponse(200, "Availability request sent successfully", newRequest));
        }
    }
    catch (error) {
        console.log("Error:", error);
        next(error);
    }
};
exports.userAvailabilityRequest = userAvailabilityRequest;
const respondToAvailabilityRequest = async (req, res, next) => {
    try {
        const { status, response } = req.body;
        const { _id } = req.params; //requestId
        const senderId = res.locals.user?._id; //respond krne wale ki id
        //request exits or not
        const request = await requestUserModel_1.default.findById(_id);
        if (!request) {
            return next(new ApiError_1.ApiError(404, "Request not found"));
        }
        if (request.receiverId.toString() !== senderId.toString()) {
            return next(new ApiError_1.ApiError(403, "Not authorized to respond to this request"));
        }
        //sender and receiver availability
        const senderAvailability = await userAvailabilityModel_1.default.findOne({
            userId: request.senderId,
        });
        const receiverAvailability = await userAvailabilityModel_1.default.findOne({
            userId: request.receiverId,
        });
        const now = new Date();
        if (!senderAvailability || senderAvailability.expiry <= now) {
            return next(new ApiError_1.ApiError(400, "Sender availability has expired"));
        }
        if (!receiverAvailability || receiverAvailability.expiry <= now) {
            return next(new ApiError_1.ApiError(400, "Your availability has expired"));
        }
        if (status !== 0) {
            await requestUserModel_1.default.findByIdAndUpdate({ _id }, {
                $set: {
                    status: "3",
                    response: response,
                },
            });
        }
        return res
            .status(200)
            .json(new ApiResponse_1.ApiResponse(200, `Request ${status} successfully`, request));
    }
    catch (error) {
        console.error("Error", error);
        next(error);
    }
};
exports.respondToAvailabilityRequest = respondToAvailabilityRequest;
const getAvailabilityRequestsList = async (req, res, next) => {
    try {
        const { searchTerm = "", type } = req.query;
        const userId = res.locals.user._id;
        if (!userId) {
            return next(new ApiError_1.ApiError(404, "Unauthorised User"));
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        let pipeline = [];
        let match = {};
        if (type === "0") {
            match = {
                $match: {
                    senderId: new mongoose_1.default.Types.ObjectId(userId),
                },
            };
        }
        else {
            match = {
                $match: {
                    receiverId: new mongoose_1.default.Types.ObjectId(userId),
                },
            };
        }
        pipeline.push(match);
        pipeline.push({
            $lookup: {
                from: "users",
                localField: "receiverId",
                foreignField: "_id",
                as: "ReceiveRequestList",
            },
        }, {
            $unwind: {
                path: "$ReceiveRequestList",
            },
        }, {
            $match: {
                $or: [
                    {
                        "ReceiveRequestList.firstName": {
                            $regex: searchTerm,
                            $options: "i",
                        },
                    },
                    {
                        "ReceiveRequestList.lastName": {
                            $regex: searchTerm,
                            $options: "i",
                        },
                    },
                ],
            },
        }, {
            $project: {
                content: 1,
                status: 1,
                createdAt: 1,
                ReceivedRequest: {
                    _id: 1,
                    firstName: 1,
                    lastName: 1,
                },
            },
        }, { $sort: { createdAt: -1 } }, { $skip: skip }, { $limit: limit });
        const requests = await requestUserModel_1.default.aggregate(pipeline);
        const totalCount = await requestUserModel_1.default.countDocuments(type === "0" ? { senderId: userId } : { receiverId: userId });
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, "List fetched successfully", {
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
            },
            data: requests,
        }));
    }
    catch (error) {
        console.error("Error fetching request list:", error);
        next(error);
    }
};
exports.getAvailabilityRequestsList = getAvailabilityRequestsList;
const getRequestById = async (req, res, next) => {
    try {
        const { _id, searchTerm = "", type } = req.query;
        const userId = res.locals.user._id;
        if (!userId) {
            return next(new ApiError_1.ApiError(404, "Unauthorised User"));
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        let pipeline = [];
        let match = {};
        //0 for present(pending), 3 for past(closed )
        if (type === "0") {
            match = {
                $match: {
                    status: "0",
                },
            };
        }
        else {
            match = {
                $match: {
                    status: "3",
                },
            };
        }
        pipeline.push(match);
        pipeline.push({
            $lookup: {
                from: "users",
                localField: "senderId",
                foreignField: "_id",
                as: "senderDetails",
            },
        }, { $unwind: "$senderDetails" });
        if (searchTerm && searchTerm !== "") {
            pipeline.push({
                $match: {
                    $or: [
                        {
                            "senderDetails.firstName": {
                                $regex: searchTerm,
                                $options: "i",
                            },
                        },
                        {
                            "senderDetails.lastName": {
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
                firstName: "$senderDetails.firstName",
                lastName: "$senderDetails.lastName",
                congregationName: "$senderDetails.congregationName",
                preference: 1,
                numberOfPassenger: 1,
                response: 1,
            },
        }, { $sort: { createdAt: -1 } }, { $skip: skip }, { $limit: limit });
        const result = await requestUserModel_1.default.aggregate(pipeline);
        const totalCount = await requestUserModel_1.default.countDocuments(type === "0" ? { status: "0" } : { status: "3" });
        return res.status(201).json(new ApiResponse_1.ApiResponse(201, "Request Details", {
            result,
            page,
            limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
        }));
    }
    catch (error) {
        next(error);
        console.log("Error:", error);
    }
};
exports.getRequestById = getRequestById;
//# sourceMappingURL=requestUser.js.map