"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const lodash_1 = tslib_1.__importDefault(require("lodash"));
/**
 * Extend user's controller
 */
exports.default = lodash_1.default.extend(require('./users/users.profile.controller'), require('./users/users.images.controller'));
//# sourceMappingURL=users.controller.js.map