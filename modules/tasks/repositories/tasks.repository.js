"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importTask = exports.stats = exports.deleteMany = exports.deleteTask = exports.update = exports.get = exports.create = exports.list = void 0;
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const tasks_model_mongoose_1 = tslib_1.__importDefault(require("../models/tasks.model.mongoose"));
const defaultPopulate = [{
        path: 'user',
        select: 'email firstName lastName',
    },
];
/**
 * @desc Function to get all task in db with filter or not
 * @return {Array} tasks
 */
async function list(filter) {
    return tasks_model_mongoose_1.default.find(filter)
        .populate(defaultPopulate)
        .sort('-createdAt')
        .exec();
}
exports.list = list;
/**
 * @desc Function to create a task in db
 * @param {Object} task
 * @return {Object} task
 */
async function create(task) {
    return new tasks_model_mongoose_1.default(task).save()
        .then((doc) => doc.populate(defaultPopulate)
        .execPopulate());
}
exports.create = create;
/**
 * @desc Function to get a task from db
 * @param {String} id
 * @return {Object} task
 */
async function get(id) {
    if (!mongoose_1.default.Types.ObjectId.isValid(id))
        return null;
    return tasks_model_mongoose_1.default.findOne({ _id: id }).populate(defaultPopulate).exec();
}
exports.get = get;
/**
 * @desc Function to update a task in db
 * @param {Object} task
 * @return {Object} task
 */
async function update(task) {
    return new tasks_model_mongoose_1.default(task).save()
        .then((doc) => doc.populate(defaultPopulate)
        .execPopulate());
}
exports.update = update;
/**
 * @desc Function to delete a task in db
 * @param {Object} task
 * @return {Object} confirmation of delete
 */
async function deleteTask(task) {
    return tasks_model_mongoose_1.default.deleteOne({ _id: task.id })
        .exec();
}
exports.deleteTask = deleteTask;
/**
 * @desc Function to delete tasks of one user in db
 * @param {Object} filter
 * @return {Object} confirmation of delete
 */
async function deleteMany(filter) {
    if (filter)
        return tasks_model_mongoose_1.default.deleteMany(filter).exec();
}
exports.deleteMany = deleteMany;
/**
 * @desc Function to get collection stats
 * @return {Object} scrap
 */
async function stats() {
    return tasks_model_mongoose_1.default.countDocuments().exec();
}
exports.stats = stats;
/**
 * @desc Function to import list of tasks in db
 * @param {[Object]} tasks
 * @param {[String]} filters
 * @return {Object} tasks
 */
async function importTask(tasks, filters) {
    return tasks_model_mongoose_1.default.bulkWrite(tasks.map((task) => {
        const filter = {};
        filters.forEach((value) => {
            filter[value] = task[value];
        });
        return {
            updateOne: {
                filter,
                update: task,
                upsert: true,
            },
        };
    }));
}
exports.importTask = importTask;
//# sourceMappingURL=tasks.repository.js.map