"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Module dependencies¬
 */
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
mongoose_1.default.Promise = Promise;
/**
 * Data Model Mongoose
 */
const TaskMongoose = new mongoose_1.default.Schema({
    title: String,
    description: String,
    user: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});
/**
 * @desc Function to add id (+ _id) to all objects
 * @return {Object} Task
 */
function addID() {
    return this._id.toHexString();
}
/**
 * Model configuration
 */
TaskMongoose.virtual('id').get(addID);
// Ensure virtual fields are serialised.
TaskMongoose.set('toJSON', {
    virtuals: true,
});
exports.default = mongoose_1.default.model('Task', TaskMongoose);
//# sourceMappingURL=tasks.model.mongoose.js.map