"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const joi_1 = tslib_1.__importDefault(require("@hapi/joi"));
/**
 *  Data Schema
 */
const TaskSchema = joi_1.default.object().keys({
    title: joi_1.default.string().trim().default('').required(),
    description: joi_1.default.string().allow('').default('').required(),
    user: joi_1.default.string().trim().default(''),
});
exports.default = TaskSchema;
//# sourceMappingURL=tasks.schema.js.map