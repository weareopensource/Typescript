"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const passport_1 = tslib_1.__importDefault(require("passport"));
const tasks = tslib_1.__importStar(require("../controllers/tasks.controller"));
const model = tslib_1.__importStar(require("../../../lib/middlewares/model"));
const policy = tslib_1.__importStar(require("../../../lib/middlewares/policy"));
const tasks_schema_1 = tslib_1.__importDefault(require("../models/tasks.schema"));
/**
 * Routes
 */
exports.default = (app) => {
    // stats
    app.route('/api/tasks/stats').all(policy.isAllowed)
        .get(tasks.stats);
    // list & post
    app.route('/api/tasks')
        .get(tasks.list) // list
        .post(passport_1.default.authenticate('jwt'), policy.isAllowed, model.isValid(tasks_schema_1.default), tasks.create); // create
    // classic crud
    app.route('/api/tasks/:taskId').all(passport_1.default.authenticate('jwt'), policy.isAllowed) // policy.isOwner available (require set in middleWare)
        .get(tasks.get) // get
        .put(model.isValid(tasks_schema_1.default), tasks.update) // update
        .delete(model.isValid(tasks_schema_1.default), tasks.deleteTask); // delete
    // Finish by binding the task middleware
    app.param('taskId', tasks.taskByID);
};
//# sourceMappingURL=tasks.routes.js.map