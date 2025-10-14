"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stateController_1 = require("../controller/stateController");
const JoiValidation_1 = require("../utils/JoiValidation");
const globalValidationHandler_1 = require("../middleware/globalValidationHandler");
const router = (0, express_1.Router)();
router.post("/saveState", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.createStateValidation, "body"), stateController_1.createState);
router.get("/getStateDetail", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.getByIdValidation, "query"), stateController_1.getStateById);
router.get("/getStateList", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.searchTearmValidation, "query"), stateController_1.getStateList);
router.put("/updateState/:_id", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.updateValidation, "params"), (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.updateCSCValidation, "body"), stateController_1.updateState);
router.delete("/deleteState/:name", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.deleteCSCValidation, "params"), stateController_1.deleteState);
exports.default = router;
//# sourceMappingURL=stateRoute.js.map