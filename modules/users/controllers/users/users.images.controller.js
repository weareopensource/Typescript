"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAvatar = exports.updateAvatar = void 0;
const tslib_1 = require("tslib");
const AppError_1 = tslib_1.__importDefault(require("../../../../lib/helpers/AppError"));
const errors_1 = tslib_1.__importDefault(require("../../../../lib/helpers/errors"));
const responses_1 = require("../../../../lib/helpers/responses");
const UploadsService = tslib_1.__importStar(require("../../../uploads/services/uploads.service"));
const UserService = tslib_1.__importStar(require("../../services/user.service"));
/**
 * @desc Endpoint to ask the service to update a user profile avatar
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function updateAvatar(req, res) {
    try {
        // catch multerErr
        if (req.multerErr)
            throw new AppError_1.default(req.multerErr.message, { code: 'SERVICE_ERROR', details: req.multerErr });
        // delete old image
        if (req.user.avatar)
            await UploadsService.deleteUpload({ filename: req.user.avatar });
        // update document uploaded (metadata ...)
        const result = await UploadsService.update(req.file, req.user, 'avatar');
        // update user
        const user = await UserService.update(req.user, { avatar: result.filename });
        // reload playload
        req.login(user, (errLogin) => {
            if (errLogin)
                return responses_1.error(res, 400, 'Bad Request', errors_1.default(errLogin))(errLogin);
            return responses_1.success(res, 'profile avatar updated')(user);
        });
    }
    catch (err) {
        responses_1.error(res, 422, 'Unprocessable Entity', errors_1.default(err))(err);
    }
}
exports.updateAvatar = updateAvatar;
/**
 * @desc Endpoint to ask the service to delete a user profile avatar
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function deleteAvatar(req, res) {
    try {
        if (req.user.avatar)
            await UploadsService.deleteUpload({ filename: req.user.avatar });
        // update user
        const user = await UserService.update(req.user, { avatar: '' });
        // reload playload
        req.login(user, (errLogin) => {
            if (errLogin)
                return responses_1.error(res, 400, 'Bad Request', errors_1.default(errLogin))(errLogin);
            return responses_1.success(res, 'profile avatar updated')(user);
        });
    }
    catch (err) {
        responses_1.error(res, 422, 'Unprocessable Entity', errors_1.default(err))(err);
    }
}
exports.deleteAvatar = deleteAvatar;
//# sourceMappingURL=users.images.controller.js.map