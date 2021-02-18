"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const passport_1 = tslib_1.__importDefault(require("passport"));
const config_1 = tslib_1.__importDefault(require("../../../config"));
const multer = tslib_1.__importStar(require("../../../lib/services/multer"));
const model = tslib_1.__importStar(require("../../../lib/middlewares/model"));
const policy = tslib_1.__importStar(require("../../../lib/middlewares/policy"));
const auth_password_controller_1 = require("../../auth/controllers/auth/auth.password.controller");
const user_schema_1 = tslib_1.__importDefault(require("../models/user.schema"));
const users_controller_1 = tslib_1.__importDefault(require("../controllers/users.controller"));
exports.default = (app) => {
    app.route('/api/users/me')
        .get(passport_1.default.authenticate('jwt'), policy.isAllowed, users_controller_1.default.userInfo);
    app.route('/api/users/terms')
        .get(passport_1.default.authenticate('jwt'), policy.isAllowed, users_controller_1.default.terms);
    app.route('/api/users').all(passport_1.default.authenticate('jwt'), policy.isAllowed)
        .put(model.isValid(user_schema_1.default), users_controller_1.default.update)
        .delete(users_controller_1.default.deleteProfileUser);
    app.route('/api/users/password')
        .post(passport_1.default.authenticate('jwt'), policy.isAllowed, auth_password_controller_1.updatePassword);
    app.route('/api/users/avatar').all(passport_1.default.authenticate('jwt'), policy.isAllowed)
        .post(multer.create('img', config_1.default.uploads.avatar), users_controller_1.default.updateAvatar)
        .delete(users_controller_1.default.deleteAvatar);
    app.route('/api/users/data').all(passport_1.default.authenticate('jwt'), policy.isAllowed)
        .get(users_controller_1.default.get)
        .delete(users_controller_1.default.deleteDataUser);
    app.route('/api/users/data/mail').all(passport_1.default.authenticate('jwt'), policy.isAllowed)
        .get(users_controller_1.default.getMail);
};
//# sourceMappingURL=users.routes.js.map