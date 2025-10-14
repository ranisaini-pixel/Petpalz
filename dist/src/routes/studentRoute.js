"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentController_1 = require("../controller/studentController");
const jwtVerify_1 = require("../middleware/jwtVerify");
const JoiValidation_1 = require("../utils/JoiValidation");
const globalValidationHandler_1 = require("../middleware/globalValidationHandler");
const router = (0, express_1.Router)();
router.post("/createStudent", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.registerStudentValidation, "body"), studentController_1.registerStudent);
router.get("/loginStudent", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.loginStudentValidation, "body"), studentController_1.loginStudent);
router.use(jwtVerify_1.verifyJWT);
router.get("/getSudent", studentController_1.getStudentById);
router.get("/getStudentList", studentController_1.getStudentList);
router.put("/updateStudent/:_id", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.updateValidation, "params"), (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.updateStudentValidation, "body"), studentController_1.updateStudent);
router.delete("/deleteStudent/:_id", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.deleteStudentValidation, "params"), studentController_1.deleteStudent);
exports.default = router;
//# sourceMappingURL=studentRoute.js.map