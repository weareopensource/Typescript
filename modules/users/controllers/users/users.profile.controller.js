"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userInfo = exports.deleteUser = exports.terms = exports.update = void 0;
const tslib_1 = require("tslib");
const errors_1 = tslib_1.__importDefault(require("../../../../lib/helpers/errors"));
const UserService = tslib_1.__importStar(require("../../services/user.service"));
const responses_1 = require("../../../../lib/helpers/responses");
/**
 * @desc Endpoint to ask the service to update a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function update(req, res) {
    try {
        const user = await UserService.update(req.user, req.body);
        // reset login
        req.login(user, (errLogin) => {
            if (errLogin)
                return responses_1.error(res, 400, 'Bad Request', errors_1.default(errLogin))(errLogin);
            return responses_1.success(res, 'user updated')(user);
        });
    }
    catch (err) {
        responses_1.error(res, 422, 'Unprocessable Entity', errors_1.default(err))(err);
    }
}
exports.update = update;
/**
 * @desc Endpoint to ask the service to update the terms sign of the user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function terms(req, res) {
    try {
        const user = await UserService.terms(req.user);
        responses_1.success(res, 'user terms signed')(user);
    }
    catch (err) {
        responses_1.error(res, 422, 'Unprocessable Entity', errors_1.default(err))(err);
    }
}
exports.terms = terms;
/**
 * @desc Endpoint to ask the service to delete the user connected
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function deleteUser(req, res) {
    try {
        const result = await UserService.deleteUser(req.user);
        result.id = req.user.id;
        responses_1.success(res, 'user deleted')(result);
    }
    catch (err) {
        responses_1.error(res, 422, 'Unprocessable Entity', errors_1.default(err))(err);
    }
}
exports.deleteUser = deleteUser;
/**
 * @desc Endpoint to ask the service to sanitize the user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function userInfo(req, res) {
    console.log(test);
    // Sanitize the user - short term solution. Copied from core.controller.js
    // TODO create proper passport mock: See https://gist.github.com/mweibel/5219403
    let user = {};
    console.log(req.user.id);
    if (req.user) {
        user = {
            id: req.user.id,
            provider: escape(req.user.provider),
            roles: req.user.roles,
            avatar: req.user.avatar,
            email: escape(req.user.email),
            lastName: escape(req.user.lastName),
            firstName: escape(req.user.firstName),
            providerData: req.user.providerData,
            // others
            complementary: req.user.complementary,
        };
        if (req.user.bio)
            user.bio = req.user.bio;
        if (req.user.position)
            user.position = req.user.position;
        // startup requirement
        if (req.user.terms)
            user.terms = req.user.terms;
    }
    responses_1.success(res, 'user get')(user);
}
exports.userInfo = userInfo;
//# sourceMappingURL=users.profile.controller.js.map