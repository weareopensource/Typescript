"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importUpload = exports.deleteMany = exports.list = void 0;
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const UploadRepository = tslib_1.__importStar(require("../repositories/uploads.repository"));
/**
 * @desc Function to ask repository to get all uploads from a specific user
 * @param {Object} user
 * @return {Promise} user uploads
 */
async function list(user) {
    const result = await UploadRepository.list({ 'metadata.user': user._id });
    return Promise.resolve(result);
}
exports.list = list;
/**
 * @desc Function to ask repository to delete all uploads from a specific user
 * @param {Object} user
 * @return {Promise} confirmation of delete
 */
async function deleteMany(user) {
    const result = await UploadRepository.deleteMany({ 'metadata.user': user._id });
    return Promise.resolve(result);
}
exports.deleteMany = deleteMany;
/**
 * @desc Function to ask repository to import a list of uploads
 */
function importUpload(uploads, filters, collection) {
    return UploadRepository.importUpload(uploads, filters, collection);
}
exports.importUpload = importUpload;
//# sourceMappingURL=uploads.data.service.js.map