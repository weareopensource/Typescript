"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const passport_1 = tslib_1.__importDefault(require("passport"));
const policy = tslib_1.__importStar(require("../../../lib/middlewares/policy"));
const uploads = tslib_1.__importStar(require("../controllers/uploads.controller"));
/**
 * Routes
 */
exports.default = (app) => {
    // classic crud
    app.route('/api/uploads/:uploadName').all(passport_1.default.authenticate('jwt'), policy.isAllowed)
        .get(uploads.get)
        .delete(policy.isOwner, uploads.deleteUpload); // delete
    // classic crud
    app.route('/api/uploads/images/:imageName').all(passport_1.default.authenticate('jwt'), policy.isAllowed)
        .get(uploads.getSharp);
    // Finish by binding the task middleware
    app.param('uploadName', uploads.uploadByName);
    app.param('imageName', uploads.uploadByImageName);
};
//# sourceMappingURL=uploads.routes.js.map