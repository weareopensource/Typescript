"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const passport_1 = tslib_1.__importDefault(require("passport"));
const admin = tslib_1.__importStar(require("../controllers/admin.controller"));
const policy = tslib_1.__importStar(require("../../../lib/middlewares/policy"));
exports.default = (app) => {
    require('./users.routes.js').default(app);
    // stats
    app.route('/api/users/stats').all(policy.isAllowed)
        .get(admin.stats);
    // Users
    app.route('/api/users')
        .get(passport_1.default.authenticate('jwt'), policy.isAllowed, admin.list); // list
    // Users page
    app.route('/api/users/page/:userPage')
        .get(passport_1.default.authenticate('jwt'), policy.isAllowed, admin.list); // list
    // Single user routes
    app.route('/api/users/:userId')
        .get(admin.getUser) // get
        .put(passport_1.default.authenticate('jwt'), policy.isAllowed, admin.update) // update
        .delete(passport_1.default.authenticate('jwt'), policy.isAllowed, admin.deleteUser); // delete
    // Finish by binding the user middleware
    app.param('userId', admin.userByID);
    app.param('userPage', admin.userByPage);
};
//# sourceMappingURL=admin.routes.js.map