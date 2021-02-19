/**
 * Module dependencies
* */
import * as policy from '../../../lib/middlewares/policy';

/**
 * Invoke Tasks Permissions
 */
const invokeRolesPolicies = () => {
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
};
/**
 * Invoke Tasks Permissions
 */
export default invokeRolesPolicies();
