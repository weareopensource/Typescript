"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userByPage = exports.userByID = exports.stats = exports.deleteUser = exports.update = exports.getUser = exports.list = void 0;
const tslib_1 = require("tslib");
const errors_1 = tslib_1.__importDefault(require("../../../lib/helpers/errors"));
const responses_1 = require("../../../lib/helpers/responses");
const UserService = tslib_1.__importStar(require("../services/user.service"));
/**
 * @desc Endpoint to ask the service to get the list of users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function list(req, res) {
    try {
        const users = await UserService.list(req.search, req.page, req.perPage);
        responses_1.success(res, 'user list')(users);
    }
    catch (err) {
        responses_1.error(res, 422, 'Unprocessable Entity', errors_1.default(err))(err);
    }
}
exports.list = list;
/**
 * @desc Endpoint to get the current user in req
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function getUser(req, res) {
    const user = req.model ? req.model.toJSON() : {};
    responses_1.success(res, 'user get')(user);
}
exports.getUser = getUser;
/**
 * @desc Endpoint to ask the service to update a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function update(req, res) {
    try {
        const user = await UserService.update(req.model, req.body, 'admin');
        responses_1.success(res, 'user updated')(user);
    }
    catch (err) {
        responses_1.error(res, 422, 'Unprocessable Entity', errors_1.default(err))(err);
    }
}
exports.update = update;
/**
 * @desc Endpoint to ask the service to delete a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function deleteUser(req, res) {
    try {
        const result = await UserService.deleteUser(req.model);
        result.id = req.model.id;
        responses_1.success(res, 'user deleted')(result);
    }
    catch (err) {
        responses_1.error(res, 422, 'Unprocessable Entity', errors_1.default(err))(err);
    }
}
exports.deleteUser = deleteUser;
/**
 * @desc Endpoint to get stats of users and return data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function stats(req, res) {
    try {
        const data = await UserService.stats();
        responses_1.success(res, 'users stats')(data);
    }
    catch (err) {
        responses_1.error(res, 422, 'Unprocessable Entity', errors_1.default(err))(err);
    }
}
exports.stats = stats;
/**
 * @desc MiddleWare to ask the service the user for this id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {String} id - user id
 */
async function userByID(req, res, next, id) {
    try {
        const user = await UserService.getBrut({ id });
        if (!user)
            responses_1.error(res, 404, 'Not Found', 'No User with that identifier has been found')();
        else {
            req.model = user;
            next();
        }
    }
    catch (err) {
        next(err);
    }
}
exports.userByID = userByID;
/**
 * @desc MiddleWare to check the params
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function  ...pagenumber&perpage&search
 * @param {String} params - params
 */
async function userByPage(req, res, next, params) {
    try {
        if (!params)
            responses_1.error(res, 404, 'Not Found', 'No users with that params has been found')();
        const request = params.split('&');
        if (request.length > 3)
            responses_1.error(res, 422, 'Not Found', 'That search countain more than 3 params')();
        else {
            if (request.length === 3) {
                req.page = Number(request[0]);
                req.perPage = Number(request[1]);
                req.search = String(request[2]);
            }
            else if (request.length === 2) {
                req.page = Number(request[0]);
                req.perPage = Number(request[1]);
            }
            else {
                req.page = 0;
                req.perPage = 0;
            }
            next();
        }
    }
    catch (err) {
        next(err);
    }
}
exports.userByPage = userByPage;
//# sourceMappingURL=admin.controller.js.map