"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.task = void 0;
const node_cron_1 = require("node-cron");
const userAvailabilityModel_1 = require("../models/userAvailabilityModel");
// Run every 1 hour
exports.task = node_cron_1.default.schedule("*/5 * * * *", async () => {
    try {
        const result = await userAvailabilityModel_1.default.deleteMany({
            expiry: { $lt: new Date() },
        });
        if (result.deletedCount > 0) {
            console.log(`${result.deletedCount} expired user availabilities removed.`);
        }
    }
    catch (err) {
        console.error("Error while deleting expired availabilities:", err);
    }
});
//# sourceMappingURL=node-cron.js.map