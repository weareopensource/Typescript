"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
/**
 * Data Model Mongoose
 */
const UploadsMongoose = new mongoose_1.default.Schema({
    length: Number,
    chunkSize: Number,
    uploadDate: Date,
    md5: String,
    filename: String,
    contentType: String,
    metadata: {
        user: {
            type: mongoose_1.default.SchemaTypes.ObjectId,
            ref: 'User',
        },
        kind: String,
    },
}, { strict: false });
exports.default = mongoose_1.default.model('Uploads', UploadsMongoose, 'uploads.files');
//# sourceMappingURL=uploads.model.mongoose.js.map