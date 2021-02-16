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
function invokeRolesPolicies() {
    policy.Acl.allow([{
            roles: ['guest'],
            allows: [{
                    resources: '/api/home/releases',
                    permissions: ['get'],
                }, {
                    resources: '/api/home/changelogs',
                    permissions: ['get'],
                }, {
                    resources: '/api/home/team',
                    permissions: ['get'],
                }, {
                    resources: '/api/home/pages/:name',
                    permissions: ['get'],
                }],
        }]);
}
exports.default = invokeRolesPolicies;
//# sourceMappingURL=home.policy.js.map