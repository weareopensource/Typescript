"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadByImageName = exports.uploadByName = exports.deleteUpload = exports.getSharp = exports.get = void 0;
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const sharp_1 = tslib_1.__importDefault(require("sharp"));
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const errors_1 = tslib_1.__importDefault(require("../../../lib/helpers/errors"));
const responses_1 = require("../../../lib/helpers/responses");
const UploadsService = tslib_1.__importStar(require("../services/uploads.service"));
const config_1 = tslib_1.__importDefault(require("../../../config"));
/**
 * @desc Endpoint to get an upload by fileName
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function get(req, res) {
    try {
        const stream = await UploadsService.getStream({ _id: req.upload._id });
        if (!stream)
            responses_1.error(res, 404, 'Not Found', 'No Upload with that identifier can been found')();
        stream.on('error', (err) => {
            responses_1.error(res, 422, 'Unprocessable Entity', errors_1.default(err))(err);
        });
        res.set('Content-Type', req.upload.contentType);
        res.set('Content-Length', req.upload.length);
        stream.pipe(res);
    }
    catch (err) {
        responses_1.error(res, 422, 'Unprocessable Entity', errors_1.default(err))(err);
    }
}
exports.get = get;
/**
 * @desc Endpoint to get an upload by fileName with sharp options
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getSharp(req, res) {
    try {
        const stream = await UploadsService.getStream({ _id: req.upload._id });
        if (!stream)
            responses_1.error(res, 404, 'Not Found', 'No Upload with that identifier can been found')();
        stream.on('error', (err) => {
            responses_1.error(res, 422, 'Unprocessable Entity', errors_1.default(err))(err);
        });
        res.set('Content-Type', req.upload.contentType);
        switch (req.sharpOption) {
            case 'blur':
                stream.pipe(sharp_1.default().resize(req.sharpSize).blur(config_1.default.uploads.sharp.blur)).pipe(res);
                break;
            case 'bw':
                stream.pipe(sharp_1.default().resize(req.sharpSize).grayscale()).pipe(res);
                break;
            case 'blur&bw':
                stream.pipe(sharp_1.default().resize(req.sharpSize).grayscale().blur(config_1.default.uploads.sharp.blur)).pipe(res);
                break;
            default:
                stream.pipe(sharp_1.default().resize(req.sharpSize)).pipe(res);
        }
    }
    catch (err) {
        responses_1.error(res, 422, 'Unprocessable Entity', errors_1.default(err))(err);
    }
}
exports.getSharp = getSharp;
/**
 * @desc Endpoint to delete an upload
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function deleteUpload(req, res) {
    try {
        await UploadsService.deleteUpload({ _id: req.upload._id });
        responses_1.success(res, 'upload deleted')();
    }
    catch (err) {
        responses_1.error(res, 422, 'Unprocessable Entity', errors_1.default(err))(err);
    }
}
exports.deleteUpload = deleteUpload;
/**
 * @desc MiddleWare to ask the service the uppload for this uploadName
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {String} filename - upload filename
 */
async function uploadByName(req, res, next, uploadName) {
    try {
        const upload = await UploadsService.get(uploadName);
        if (!upload)
            responses_1.error(res, 404, 'Not Found', 'No Upload with that name has been found')();
        else {
            req.upload = upload;
            if (upload.metadata && upload.metadata.user)
                req.isOwner = upload.metadata.user; // user id if we proteck road by isOwner policy
            next();
        }
    }
    catch (err) {
        next(err);
    }
}
exports.uploadByName = uploadByName;
/**
 * @desc MiddleWare to ask the service the uppload for this uploadImageName
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {String} filename & params - upload filename & eventual params (two max) filename-maxSize-options.png
 */
async function uploadByImageName(req, res, next, uploadImageName) {
    try {
        // Name
        const imageName = uploadImageName.split('.');
        const opts = imageName[0].split('-');
        if (imageName.length !== 2)
            return responses_1.error(res, 404, 'Not Found', 'Wrong name schema')();
        if (opts.length > 3)
            return responses_1.error(res, 404, 'Not Found', 'Too much params')();
        // data work
        const upload = await UploadsService.get(`${opts[0]}.${imageName[1]}`);
        if (!upload)
            return responses_1.error(res, 404, 'Not Found', 'No Upload with that name has been found')();
        // options
        const sharpConfig = lodash_1.default.get(config_1.default, `uploads.${upload.metadata.kind}.sharp`);
        if (opts[1] && (!sharpConfig || !sharpConfig.sizes))
            return responses_1.error(res, 422, 'Unprocessable Entity', 'Size param not available')();
        if (opts[1] && (!/^\d+$/.test(opts[1]) || !sharpConfig.sizes.includes(opts[1])))
            return responses_1.error(res, 422, 'Unprocessable Entity', 'Wrong size param')();
        if (opts[2] && (!sharpConfig || !sharpConfig.operations))
            return responses_1.error(res, 422, 'Unprocessable Entity', 'Operations param not available')();
        if (opts[2] && !sharpConfig.operations.includes(opts[2]))
            return responses_1.error(res, 422, 'Unprocessable Entity', 'Operation param not available')();
        // return
        req.upload = upload;
        if (upload.metadata && upload.metadata.user)
            req.isOwner = upload.metadata.user; // user id if we proteck road by isOwner policy
        req.sharpSize = parseInt(opts[1], 10) || null;
        req.sharpOption = opts[2] || null;
        next();
    }
    catch (err) {
        next(err);
    }
}
exports.uploadByImageName = uploadByImageName;
//# sourceMappingURL=uploads.controller.js.map