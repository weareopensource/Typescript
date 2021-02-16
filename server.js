"use strict";
/**
 * Module dependencies.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const app_1 = require("./lib/app");
const server = app_1.start().catch((e) => {
    console.log(`server failed: ${e.message}`);
    throw (e);
});
process.on('SIGINT', () => {
    console.info(chalk_1.default.blue(' SIGINT Graceful shutdown ', new Date().toISOString()));
    app_1.shutdown(server);
});
process.on('SIGTERM', () => {
    console.info(chalk_1.default.blue(' SIGTERM Graceful shutdown ', new Date().toISOString()));
    app_1.shutdown(server);
});
//# sourceMappingURL=server.js.map