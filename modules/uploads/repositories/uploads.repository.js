"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importUpload = exports.purge = exports.deleteMany = exports.deleteUpload = exports.update = exports.getStream = exports.get = exports.list = void 0;
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const mongoose_gridfs_1 = require("mongoose-gridfs");
const AppError_1 = tslib_1.__importDefault(require("../../../lib/helpers/AppError"));
const uploads_model_mongoose_1 = tslib_1.__importDefault(require("../models/uploads.model.mongoose"));
const Attachment = mongoose_gridfs_1.createModel({ bucketName: 'uploads', model: 'Uploads' });
/**
 * @desc Function to get all upload in db with filter or not
 * @param {Object} Filter
 * @return {Array} uploads
 */
async function list(filter) {
    return uploads_model_mongoose_1.default.find(filter)
        .select('filename uploadDate contentType')
        .sort('-createdAt');
}
exports.list = list;
/**
 * @desc Function to get an upload from db
 * @param {String} uploadName
 * @return {Stream} upload
 */
async function get(uploadName) {
    return uploads_model_mongoose_1.default.findOne({ filename: uploadName });
}
exports.get = get;
/**
 * @desc Function to get an upload stream from db
 * @param {Object} Upload
 * @return {Stream} upload
 */
function getStream(upload) {
    return Attachment.read(upload);
}
exports.getStream = getStream;
/**
 * @desc Function to update an upload in db
 * @param {ObjectID} upload ID
 * @param {Object} upload
 * @return {Object} upload updated
 */
async function update(id, upload) {
    return uploads_model_mongoose_1.default.findOneAndUpdate({ _id: id }, upload, { new: true });
}
exports.update = update;
/**
 * @desc Function to delete an upload from db
 * @param {Object} upload
 * @return {Object} confirmation of delete
 */
async function deleteUpload(upload) {
    if (!upload._id)
        upload = await uploads_model_mongoose_1.default.findOne({ filename: upload.filename });
    if (upload) {
        Attachment.unlink(upload._id, (err, unlinked) => {
            if (err)
                throw new AppError_1.default('Upload: delete error', { code: 'REPOSITORY_ERROR', details: err });
            return unlinked;
        });
    }
}
exports.deleteUpload = deleteUpload;
/**
 * @desc Function to delete uploads of one user in db
 * @param {Object} filter
 * @return {Object} confirmation of delete
 */
async function deleteMany(filter) {
    const uploads = await list(filter);
    uploads.forEach((upload) => {
        Attachment.unlink(upload._id, (err, unlinked) => {
            if (err)
                throw new AppError_1.default('Upload: delete error', { code: 'REPOSITORY_ERROR', details: err });
            return unlinked;
        });
    });
    return { deletedCount: uploads.length };
}
exports.deleteMany = deleteMany;
/**
 * @desc Function to purge uploads by kind if they are not referenced in another collection
 * @param {String} kind - metadata kind to match
 * @param {collection} collection - name of the collection to check reference presence
 * @param {String} key - name of the key to check id
 * @return {Object} confirmation of delete
 */
async function purge(kind, collection, key) {
    const toDelete = await uploads_model_mongoose_1.default.aggregate([
        { $match: { 'metadata.kind': kind } },
        {
            $lookup: {
                from: collection,
                localField: 'filename',
                foreignField: key,
                as: 'references',
            },
        },
        { $match: { references: [] } },
    ]);
    toDelete.forEach(async (id) => {
        Attachment.unlink(id, (err, unlinked) => {
            if (err)
                throw new AppError_1.default('Upload: delete error', { code: 'REPOSITORY_ERROR', details: err });
            return unlinked;
        });
    });
    return { deletedCount: toDelete.length };
}
exports.purge = purge;
/**
 * @desc Function to import list of uploads in db
 */
function importUpload(uploads, filters, collection) {
    const schema = new mongoose_1.default.Schema({}, { collection, strict: false });
    let model;
    try {
        model = mongoose_1.default.model(collection);
    }
    catch (error) {
        model = mongoose_1.default.model(collection, schema);
    }
    return model.bulkWrite(uploads.map((upload) => {
        const filter = {};
        filters.forEach((value) => {
            filter[value] = upload[value];
        });
        return {
            updateOne: {
                filter,
                update: upload,
                upsert: true,
            },
        };
    }));
}
exports.importUpload = importUpload;
//# sourceMappingURL=uploads.repository.js.map