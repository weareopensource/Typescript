"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Module dependencies
* */
const policy = tslib_1.__importStar(require("../../../lib/middlewares/policy"));
/**
 * Invoke Uploads Permissions
 */
function invokeRolesPolicies() {
    policy.Acl.allow([{
            roles: ['user', 'admin'],
            allows: [{
                    resources: '/api/uploads/:uploadName',
                    permissions: ['get', 'delete'],
                }, {
                    resources: '/api/uploads/images/:imageName',
                    permissions: ['get'],
                }],
        }]);
}
exports.default = invokeRolesPolicies;
//# sourceMappingURL=uploads.policy.js.map