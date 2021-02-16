"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUpload = exports.update = exports.getStream = exports.get = void 0;
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const multer_1 = require("../../../lib/services/multer");
const UploadRepository = tslib_1.__importStar(require("../repositories/uploads.repository"));
/**
 * @desc Function to ask repository to get an upload
 * @param {String} uploadName
 * @return {Promise} Upload
 */
async function get(uploadName) {
    const result = await UploadRepository.get(uploadName);
    return Promise.resolve(result);
}
exports.get = get;
/**
 * @desc Function to ask repository to get stream of chunks data
 * @param {Object} Upload
 * @return {Promise} result stream
 */
async function getStream(upload) {
    const result = await UploadRepository.getStream(upload);
    return Promise.resolve(result);
}
exports.getStream = getStream;
/**
 * @desc Function to ask repository to update an upload
 * @param {Object} req.file
 * @param {Object} User
 * @param {String} kind, upload configuration path (important for futur transformations)
 * @return {Promise} Upload
 */
async function update(file, user, kind) {
    const upload = {
        filename: await multer_1.generateFileName(file.filename || file.originalname),
        metadata: {
            user: user.id,
            kind: kind || null,
        },
    };
    const result = await UploadRepository.update(file._id, upload);
    return Promise.resolve(result);
}
exports.update = update;
/**
 * @desc Function to ask repository to delete chunks data
 * @param {Object} Upload
 * @return {Promise} confirmation of delete
 */
async function deleteUpload(upload) {
    const result = await UploadRepository.deleteUpload(upload);
    return Promise.resolve(result);
}
exports.deleteUpload = deleteUpload;
//# sourceMappingURL=uploads.service.js.map