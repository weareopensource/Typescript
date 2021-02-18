"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSeed = exports.start = void 0;
const tslib_1 = require("tslib");
/**
 * Module dependencies.
 */
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const config_1 = tslib_1.__importDefault(require("../../config"));
const AppError_1 = tslib_1.__importDefault(require("../helpers/AppError"));
const UserService = tslib_1.__importStar(require("../../modules/users/services/user.service"));
const AuthService = tslib_1.__importStar(require("../../modules/auth/services/auth.service"));
const TaskService = tslib_1.__importStar(require("../../modules/tasks/services/tasks.service"));
// global seed options object
let seedOptions = {};
// save the specified user with the password provided from the resolved promise
const seedTheUser = (user) => async (password) => {
    user.password = password;
    if (user.email === seedOptions.seedAdmin.email && process.env.NODE_ENV === 'production' && await UserService.get(user))
        return new AppError_1.default(`Failed due to local account already exists: ${user.email}`, {});
    if (process.env.NODE_ENV === 'test' && await UserService.get(user))
        await UserService.deleteUser(user);
    try {
        const result = await UserService.create(user);
        if (seedOptions.logResults)
            console.log(chalk_1.default.bold.red(`Database Seeding:\t\t\tLocal ${user.email} added with password set to ${password}`));
        return result;
    }
    catch (err) {
        throw new AppError_1.default('Failed to seedTheUser.', { code: 'LIB_ERROR' });
    }
};
// save the specified user with the password provided from the resolved promise
const seedTasks = async (task, user) => {
    try {
        const result = await TaskService.create(task, user);
        if (seedOptions.logResults)
            console.log(chalk_1.default.bold.red(`Database Seeding:\t\t\tLocal ${task.title} added`));
        return result;
    }
    catch (err) {
        throw new AppError_1.default('Failed to seedTasks.', { code: 'LIB_ERROR' });
    }
};
async function start(options) {
    let pwd;
    const result = [];
    // Check for provided options
    seedOptions = lodash_1.default.clone(config_1.default.seedDB.options);
    if (lodash_1.default.has(options, 'logResults'))
        seedOptions.logResults = options.logResults;
    if (lodash_1.default.has(options, 'seedUser'))
        seedOptions.seedUser = options.seedUser;
    if (lodash_1.default.has(options, 'seedAdmin'))
        seedOptions.seedAdmin = options.seedAdmin;
    if (lodash_1.default.has(options, 'seedTasks'))
        seedOptions.seedTasks = options.seedTasks;
    try {
        if (process.env.NODE_ENV === 'production') {
            pwd = await AuthService.generateRandomPassphrase();
            result.push(await seedTheUser(seedOptions.seedAdmin)(pwd));
        }
        else {
            pwd = await AuthService.generateRandomPassphrase();
            result.push(await seedTheUser(seedOptions.seedUser)(pwd));
            pwd = await AuthService.generateRandomPassphrase();
            result.push(await seedTheUser(seedOptions.seedAdmin)(pwd));
            if (process.env.NODE_ENV === 'development') {
                result.push(await seedTasks(seedOptions.seedTasks[0], result[0]));
                result.push(await seedTasks(seedOptions.seedTasks[1], result[1]));
            }
        }
    }
    catch (err) {
        console.log(err);
        return new AppError_1.default('Error on seed start.', {});
    }
    return result;
}
exports.start = start;
async function userSeed(user) {
    let pwd;
    const result = [];
    // Check for provided options
    seedOptions = lodash_1.default.clone(config_1.default.seedDB.options);
    try {
        pwd = await AuthService.generateRandomPassphrase();
        result.push(await seedTheUser(user)(pwd));
    }
    catch (err) {
        console.log(err);
        return new AppError_1.default('Error on seed start.', {});
    }
    return result;
}
exports.userSeed = userSeed;
//# sourceMappingURL=seed.js.map