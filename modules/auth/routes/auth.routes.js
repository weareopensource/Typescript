"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const passport_1 = tslib_1.__importDefault(require("passport"));
const auth_controller_1 = tslib_1.__importDefault(require("../controllers/auth.controller"));
const model = tslib_1.__importStar(require("../../../lib/middlewares/model"));
const user_schema_1 = tslib_1.__importDefault(require("../../users/models/user.schema"));
exports.default = (app) => {
    // Setting up the users password api
    app.route('/api/auth/forgot').post(auth_controller_1.default.forgot);
    app.route('/api/auth/reset/:token').get(auth_controller_1.default.validateResetToken);
    app.route('/api/auth/reset').post(auth_controller_1.default.reset);
    // Setting up the users authentication api
    app.route('/api/auth/signup').post(model.isValid(user_schema_1.default), auth_controller_1.default.signup);
    app.route('/api/auth/signin').post(passport_1.default.authenticate('local'), auth_controller_1.default.signin);
    // Jwt reset token
    app.route('/api/auth/token').get(passport_1.default.authenticate('jwt'), auth_controller_1.default.buildToken);
    // Setting the oauth routes
    app.route('/api/auth/:strategy').get(auth_controller_1.default.oauthCall);
    app.route('/api/auth/:strategy/callback').get(auth_controller_1.default.oauthCallback);
    app.route('/api/auth/:strategy/callback').post(auth_controller_1.default.oauthCallback); // specific for apple call back
};
//# sourceMappingURL=auth.routes.js.map