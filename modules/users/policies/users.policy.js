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
                    resources: '/api/users/me',
                    permissions: ['get'],
                }, {
                    resources: '/api/users/terms',
                    permissions: ['get'],
                }, {
                    resources: '/api/users',
                    permissions: ['put', 'delete'],
                }, {
                    resources: '/api/users/password',
                    permissions: ['post'],
                }, {
                    resources: '/api/users/avatar',
                    permissions: ['post', 'delete'],
                }, {
                    resources: '/api/users/accounts',
                    permissions: ['post', 'delete'],
                }, {
                    resources: '/api/users/data',
                    permissions: ['get', 'delete'],
                }, {
                    resources: '/api/users/data/mail',
                    permissions: ['get'],
                }],
        }, {
            roles: ['admin'],
            allows: [{
                    resources: '/api/users',
                    permissions: ['get'],
                }, {
                    resources: '/api/users/page/:userPage',
                    permissions: ['get'],
                }, {
                    resources: '/api/users/:userId',
                    permissions: ['get', 'put', 'delete'],
                }],
        }, {
            roles: ['guest'],
            allows: [{
                    resources: '/api/users/stats',
                    permissions: ['get'],
                }],
        }]);
};
/**
 * Invoke Tasks Permissions
 */
exports.default = invokeRolesPolicies();
//# sourceMappingURL=users.policy.js.map