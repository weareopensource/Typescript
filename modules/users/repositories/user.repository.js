"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importUser = exports.stats = exports.deleteUser = exports.update = exports.search = exports.get = exports.create = exports.list = void 0;
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const user_model_mongoose_1 = tslib_1.__importDefault(require("../models/user.model.mongoose"));
/**
 * @desc Function to get all user in db
 */
async function list(searchFilter, page, perPage) {
    const filter = searchFilter ? {
        $or: [
            { firstName: { $regex: `${searchFilter}`, $options: 'i' } },
            { lastName: { $regex: `${searchFilter}`, $options: 'i' } },
            { email: { $regex: `${searchFilter}`, $options: 'i' } },
        ],
    } : {};
    return user_model_mongoose_1.default.find(filter).limit(perPage)
        .skip(perPage * page)
        .select('-password -providerData')
        .sort('-createdAt')
        .exec();
}
exports.list = list;
/**
 * @desc Function to create a user in db
 * @param {Object} user
 * @return {Object} user
 */
async function create(user) {
    return new user_model_mongoose_1.default(user).save();
}
exports.create = create;
/**
 * @desc Function to get a user from db by id or email
 * @param {Object} user
 * @return {Object} user
 */
async function get(user) {
    if (user.id && mongoose_1.default.Types.ObjectId.isValid(user.id))
        return user_model_mongoose_1.default.findOne({ _id: user.id }).exec();
    if (user.email)
        return user_model_mongoose_1.default.findOne({ email: user.email }).exec();
    if (user.resetPasswordToken) {
        return user_model_mongoose_1.default.findOne({
            resetPasswordToken: user.resetPasswordToken,
            resetPasswordExpires: {
                $gt: Date.now(),
            },
        }).exec();
    }
}
exports.get = get;
/**
 * @desc Function to get a search in db request
 * @param {Object} mongoose input request
 * @return {Array} users
 */
async function search(input) {
    return user_model_mongoose_1.default.find(input)
        .exec();
}
exports.search = search;
/**
 * @desc Function to update a user in db
 * @param {Object} user
 * @return {Object} user
 */
async function update(user) {
    return new user_model_mongoose_1.default(user).save();
}
exports.update = update;
/**
 * @desc Function to delete a user from db by id or email
 * @param {Object} user
 * @return {Object} confirmation of delete
 */
async function deleteUser(user) {
    if (user.id && mongoose_1.default.Types.ObjectId.isValid(user.id))
        return user_model_mongoose_1.default.deleteOne({ _id: user.id }).exec();
    if (user.email)
        return user_model_mongoose_1.default.deleteOne({ email: user.email }).exec();
}
exports.deleteUser = deleteUser;
/**
 * @desc Function to get collection stats
 * @return {Object} scrap
 */
async function stats() {
    return user_model_mongoose_1.default.countDocuments();
}
exports.stats = stats;
/**
 * @desc Function to import list of users in db
 * @param {[Object]} users
 * @param {[String]} filters
 * @return {Object} locations
 */
async function importUser(users, filters) {
    return user_model_mongoose_1.default.bulkWrite(users.map((user) => {
        const filter = {};
        filters.forEach((value) => {
            filter[value] = user[value];
        });
        return {
            updateOne: {
                filter,
                update: user,
                upsert: true,
            },
        };
    }));
}
exports.importUser = importUser;
//# sourceMappingURL=user.repository.js.map