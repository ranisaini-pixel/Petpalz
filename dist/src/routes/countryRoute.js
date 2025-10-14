"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const countryController_1 = require("../controller/countryController");
const JoiValidation_1 = require("../utils/JoiValidation");
const globalValidationHandler_1 = require("../middleware/globalValidationHandler");
const router = (0, express_1.Router)();
router.post("/saveCountry", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.createCountryValidation, "body"), countryController_1.createCountry);
router.get("/getCountryDetail", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.getByIdValidation, "query"), countryController_1.getCountryById);
router.get("/getCountryList", countryController_1.getCountryList);
router.put("/update/:_id", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.updateValidation, "params"), (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.updateCSCValidation, "body"), countryController_1.updateCountry);
router.delete("/delete/:name", (0, globalValidationHandler_1.globalValidator)(JoiValidation_1.deleteCSCValidation, "params"), countryController_1.deleteCountry);
exports.default = router;
//# sourceMappingURL=countryRoute.js.map