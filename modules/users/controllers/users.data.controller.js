"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMail = exports.get = exports.deleteUser = void 0;
const tslib_1 = require("tslib");
const config_1 = tslib_1.__importDefault(require("../../../config"));
const errors_1 = tslib_1.__importDefault(require("../../../lib/helpers/errors"));
const mails_1 = tslib_1.__importDefault(require("../../../lib/helpers/mails"));
const responses_1 = require("../../../lib/helpers/responses");
const TaskDataService = tslib_1.__importStar(require("../../tasks/services/tasks.data.service"));
const UploadDataService = tslib_1.__importStar(require("../../uploads/services/uploads.data.service"));
const UserService = tslib_1.__importStar(require("../services/user.service"));
/**
 * @desc Endpoint to ask the service to delete the user connected and all his data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function deleteUser(req, res) {
    try {
        const result = {
            user: await UserService.deleteUser(req.user),
            tasks: await TaskDataService.deleteTask(req.user),
            uploads: await UploadDataService.deleteMany(req.user),
        };
        result.user.id = req.user.id;
        responses_1.success(res, 'user and his data were deleted')(result);
    }
    catch (err) {
        responses_1.error(res, 422, 'Unprocessable Entity', errors_1.default(err))(err);
    }
}
exports.deleteUser = deleteUser;
/**
 * @desc Endpoint to ask the service to get all user data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function get(req, res) {
    try {
        const result = {
            user: await UserService.get(req.user),
            tasks: await TaskDataService.list(req.user),
            uploads: await UploadDataService.list(req.user),
        };
        responses_1.success(res, 'user data')(result);
    }
    catch (err) {
        responses_1.error(res, 422, 'Unprocessable Entity', errors_1.default(err))(err);
    }
}
exports.get = get;
/**
 * @desc Endpoint to ask the service to get all user data and send it to user mail
 */
async function getMail(req, res) {
    try {
        // const result = {
        //   user: await UserService.get(req.user),
        //   tasks: await TaskDataService.list(req.user),
        //   uploads: await UploadDataService.list(req.user),
        // };
        // send mail
        const mail = await mails_1.default({
            from: config_1.default.mailer.from,
            to: req.user.email,
            subject: `${config_1.default.app.title}: your data`,
        });
        if (!mail.accepted)
            return responses_1.error(res, 400, 'Bad Request', 'Failure sending email')();
        responses_1.success(res, 'An email has been sent to the user email with data')({ status: true });
    }
    catch (err) {
        responses_1.error(res, 422, 'Unprocessable Entity', errors_1.default(err))(err);
    }
}
exports.getMail = getMail;
//# sourceMappingURL=users.data.controller.js.map