"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cityController_1 = require("../controller/cityController");
const JoiValidation_1 = require("../utils/JoiValidation");
const globalValidationHandler_1 = require("../middleware/globalValidationHandler");
const router = (0, express_1.Router)();
router.post("/saveCity", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.createCityValidation, "body"), cityController_1.createCity);
router.get("/getCityDetail", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.getByIdValidation, "query"), cityController_1.getCityById);
router.get("/getCityList", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.searchTearmValidation, "query"), cityController_1.getCityList);
router.put("/update/:_id", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.updateValidation, "params"), (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.updateCSCValidation, "body"), cityController_1.updateCity);
router.delete("/delete/:name", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.deleteCSCValidation, "params"), cityController_1.deleteCity);
exports.default = router;
//# sourceMappingURL=cityRoute.js.map