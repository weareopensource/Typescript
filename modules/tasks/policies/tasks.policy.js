"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Module dependencies
* */
const policy = tslib_1.__importStar(require("../../../lib/middlewares/policy"));
/**
 * Invoke Tasks Permissions
 */
const invokeRolesPolicies = () => {
    policy.Acl.allow([{
            roles: ['user'],
            allows: [{
                    resources: '/api/tasks',
                    permissions: '*',
                }, {
                    resources: '/api/tasks/:taskId',
                    permissions: '*',
                }],
        }, {
            roles: ['guest'],
            allows: [{
                    resources: '/api/tasks/stats',
                    permissions: ['get'],
                }, {
                    resources: '/api/tasks',
                    permissions: ['get'],
                }, {
                    resources: '/api/tasks/:taskId',
                    permissions: ['get'],
                }],
        }]);
};
exports.default = invokeRolesPolicies();
//# sourceMappingURL=tasks.policy.js.map