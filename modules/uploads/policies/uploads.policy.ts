/**
 * Module dependencies
 * */
import * as policy from '../../../lib/middlewares/policy';

/**
 * Invoke Uploads Permissions
 */
const invokeRolesPolicies = () => {
  policy.Acl.allow([
    {
      roles: ['user', 'admin'],
      allows: [
        {
          resources: '/api/uploads/:uploadName',
          permissions: ['get', 'delete'],
        },
        {
          resources: '/api/uploads/images/:imageName',
          permissions: ['get'],
        },
      ],
    },
  ]);
};
/**
 * Invoke Uploads Permissions
 */
export default invokeRolesPolicies();
