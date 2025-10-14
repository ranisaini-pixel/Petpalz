"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStudent = exports.updateStudent = exports.getStudentList = exports.getStudentById = exports.loginStudent = exports.registerStudent = void 0;
const studentModel_1 = require("../models/studentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
dotenv.config();
const registerStudent = async (req, res, next) => {
    try {
        const { rollNo, password, name, collegeName, course, country, state, city, } = req.body;
        if (!(rollNo ||
            password ||
            name ||
            collegeName ||
            course ||
            country ||
            state ||
            city)) {
        }
        const existedStudent = await studentModel_1.default.findOne({ rollNo });
        // try {
        //   const existedStudent = await studentModel.findOne({ rollNo });
        //   if (existedStudent) {
        //     throw new ApiError(400, "Student LREADY EXITS");
        //     // throw "Rani";
        //   }
        // } catch (error: any) {
        //   console.log("error", error);
        //   console.log("inside nested catch");
        //   next(error);
        // }
        if (existedStudent) {
            // throw new ApiError(400, "Student already exists");
            return next(new ApiError_1.ApiError(400, "Student already exists"));
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newStudent = new studentModel_1.default({
                rollNo: rollNo,
                password: hashedPassword,
                name: name.trim(),
                collegeName: collegeName.toLowerCase().trim(),
                course: course.toLowerCase().trim(),
                country: country.toLowerCase().trim(),
                state: state.toLowerCase().trim(),
                city: city.toLowerCase().trim(),
            });
            await newStudent?.save();
            const createdStudent = await studentModel_1.default
                .findById(newStudent._id)
                .select("-password");
            if (!createdStudent) {
                return next(new ApiError_1.ApiError(400, "Student not created"));
            }
            return res
                .status(201)
                .json(new ApiResponse_1.ApiResponse(201, "Student created successfully", createdStudent));
        }
    }
    catch (error) {
        // console.log("inside catch");
        console.log(error);
        // return res.status(400).json(new ApiResponse(400, error.message, null));
        return next(error);
    }
};
exports.registerStudent = registerStudent;
const loginStudent = async (req, res) => {
    try {
        const { rollNo, password } = req.body;
        if (!(rollNo || password)) {
            return next(new ApiError_1.ApiError(400, "Please provide username and email"));
        }
        else {
            let existedStudent = await studentModel_1.default.findOne({ rollNo });
            if (!existedStudent) {
                return next(new ApiError_1.ApiError(400, "Student not found"));
            }
            else {
                let isPasswordValidate = await bcrypt.compare(password, existedStudent.password);
                if (!isPasswordValidate) {
                    return next(new ApiError_1.ApiError(400, "Password Incorrect"));
                }
                else {
                    const token = jwt.sign({ id: existedStudent._id }, process.env.PRIVATE_KEY, {
                        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
                    });
                    await studentModel_1.default.findOneAndUpdate({ rollNo }, {
                        $set: {
                            token: token,
                        },
                    }, {
                        new: true,
                        upsert: true,
                    });
                    const loggedInUser = await studentModel_1.default
                        .findById(existedStudent._id)
                        .select("-course -password -country -state -city -rollNo -createdAt -updatedAt");
                    return res
                        .status(200)
                        .json(new ApiResponse_1.ApiResponse(200, "Login Successful", loggedInUser));
                }
            }
        }
    }
    catch (error) {
        console.log("Error:", error);
        next(error);
    }
};
exports.loginStudent = loginStudent;
const getStudentById = async (req, res) => {
    try {
        const student = await studentModel_1.default.findById(res.locals.student._id);
        if (!student) {
            return next(new ApiError_1.ApiError(400, "Student not found"));
        }
        else {
            return res
                .status(200)
                .json(new ApiResponse_1.ApiResponse(200, "Student Details", student));
        }
    }
    catch (error) {
        console.log("Error:", error);
        next(error);
    }
};
exports.getStudentById = getStudentById;
const getStudentList = async (req, res) => {
    try {
        const studentsList = await studentModel_1.default.find();
        if (!studentsList) {
            return next(new ApiError_1.ApiError(400, "Student not found"));
        }
        else {
            return res
                .status(200)
                .json(new ApiResponse_1.ApiResponse(200, "All Student List", studentsList));
        }
    }
    catch (error) {
        console.log("Error:", error);
        next(error);
    }
};
exports.getStudentList = getStudentList;
const updateStudent = async (req, res) => {
    try {
        const { _id } = req.params;
        const updatedStudent = await studentModel_1.default
            .findOneAndUpdate({ _id }, {
            $set: {
                password: req.body.password,
                name: req.body.name,
                collegeName: req.body.collegeName,
                course: req.body.course,
                country: req.body.country,
                state: req.body.state,
                city: req.body.city,
            },
        }, { new: true })
            .select("-password");
        let updatedStudentData = await studentModel_1.default.findById({ _id });
        if (!updatedStudent) {
            return next(new ApiError_1.ApiError(400, "Student not found"));
        }
        else {
            return res
                .status(200)
                .json(new ApiResponse_1.ApiResponse(200, "Student Details Updated", updatedStudentData));
        }
    }
    catch (error) {
        console.log("Error:", error);
        next(error);
    }
};
exports.updateStudent = updateStudent;
const deleteStudent = async (req, res) => {
    try {
        const { _id } = req.params;
        const deleted = await studentModel_1.default.deleteOne({ _id });
        if (deleted.deletedCount === 0) {
            return next(new ApiError_1.ApiError(400, "Student not found"));
        }
        else {
            return res
                .status(200)
                .json(new ApiResponse_1.ApiResponse(200, "Student Deleted Successfully", null));
        }
    }
    catch (error) {
        console.log("Error:", error);
        next(error);
    }
};
exports.deleteStudent = deleteStudent;
function next(arg0) {
    throw new Error("Function not implemented.");
}
//# sourceMappingURL=studentController.js.map