"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stats = exports.deleteUser = exports.terms = exports.update = exports.getBrut = exports.get = exports.search = exports.create = exports.list = exports.removeSensitive = void 0;
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const bcrypt_1 = require("bcrypt");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const config_1 = tslib_1.__importDefault(require("../../../config"));
const UserRepository = tslib_1.__importStar(require("../repositories/user.repository"));
/**
 * @desc Local function to removeSensitive data from user
 * @param {Object} user
 * @return {Object} user
 */
function removeSensitive(user, conf) {
    if (!user || typeof user !== 'object')
        return null;
    const keys = conf || config_1.default.whitelists.users.default;
    return lodash_1.default.pick(user, keys);
}
exports.removeSensitive = removeSensitive;
/**
 * @desc Function to get all users in db
 * @param {String} filter
 * @param {Int} page
 * @param {Int} perPage
 * @return {Promise} users selected
 */
async function list(filter, page, perPage) {
    const result = await UserRepository.list(filter, page, perPage);
    return Promise.resolve(result.map((user) => removeSensitive(user)));
}
exports.list = list;
/**
 * @desc Function to ask repository to create a  user (define provider, check & haspassword, save)
 * @param {Object} user
 * @return {Promise} user
 */
async function create(user) {
    // Set provider to local
    if (!user.provider)
        user.provider = 'local';
    // confirming to secure password policies
    if (user.password) {
        // done in model, let this comment for information if one day joi.zxcvbn is not ok / sufficient
        // const validPassword = zxcvbn(user.password);
        // if (!validPassword || !validPassword.score || validPassword.score < config.zxcvbn.minimumScore) {
        //   throw new AppError(`${validPassword.feedback.warning}. ${validPassword.feedback.suggestions.join('. ')}`);
        // }
        // When password is provided we need to make sure we are hashing it
        user.password = await bcrypt_1.hash(String(user.password), 10);
    }
    const result = await UserRepository.create(user);
    // Remove sensitive data before return
    return Promise.resolve(removeSensitive(result));
}
exports.create = create;
/**
 * @desc Function to ask repository to search users by request
 * @param {Object} mongoose input request
 * @return {Array} users
 */
async function search(input) {
    const result = await UserRepository.search(input);
    return Promise.resolve(result.map((user) => removeSensitive(user)));
}
exports.search = search;
/**
 * @desc Function to ask repository to get a user by id or email
 * @param {Object} user.id / user.email
 * @return {Object} user
 */
async function get(user) {
    const result = await UserRepository.get(user);
    return Promise.resolve(removeSensitive(result));
}
exports.get = get;
/**
 * @desc Function to ask repository to get a user by id or email without filter data return (test & intern usage)
 * @param {Object} user.id / user.email
 * @return {Object} user
 */
async function getBrut(user) {
    return UserRepository.get(user);
}
exports.getBrut = getBrut;
/**
 * @desc Function to ask repository to update a user
 */
async function update(user, body, option) {
    if (!option)
        user = lodash_1.default.assignIn(user, removeSensitive(body, config_1.default.whitelists.users.update));
    else if (option === 'admin')
        user = lodash_1.default.assignIn(user, removeSensitive(body, config_1.default.whitelists.users.updateAdmin));
    else if (option === 'recover')
        user = lodash_1.default.assignIn(user, removeSensitive(body, config_1.default.whitelists.users.recover));
    const result = await UserRepository.update(user);
    return Promise.resolve(removeSensitive(result));
}
exports.update = update;
/**
 * @desc Functio to ask repository to sign terms for current user
 * @param {Object} user - original user
 * @return {Promise} user -
 */
async function terms(user) {
    user = lodash_1.default.assignIn(user, { terms: new Date() });
    const result = await UserRepository.update(user);
    return Promise.resolve(removeSensitive(result));
}
exports.terms = terms;
/**
 * @desc Function to ask repository to a user from db by id or email
 * @param {Object} user
 * @return {Promise} result & id
 */
async function deleteUser(user) {
    const result = await UserRepository.deleteUser(user);
    return Promise.resolve(result);
}
exports.deleteUser = deleteUser;
/**
 * @desc Function to get all stats of db
 * @return {Promise} All stats
 */
async function stats() {
    const result = await UserRepository.stats();
    return Promise.resolve(result);
}
exports.stats = stats;
//# sourceMappingURL=user.service.js.map