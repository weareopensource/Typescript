/**
 * Module dependencies
 */
import passport from 'passport';

import config from '../../../config';
import * as multer from '../../../lib/services/multer';
import * as model from '../../../lib/middlewares/model';
import * as policy from '../../../lib/middlewares/policy';
import { updatePassword } from '../../auth/controllers/auth/auth.password.controller';
import { deleteAvatar, updateAvatar } from '../controllers/users/users.images.controller';
import {
  deleteUser, getMe, terms, update,
} from '../controllers/users/users.profile.controller';
import usersSchema from '../models/user.schema';
import * as usersData from '../controllers/users.data.controller';

export default (app) => {
  app.route('/api/users/me')
    .get(passport.authenticate('jwt'), policy.isAllowed, getMe);

  app.route('/api/users/terms')
    .get(passport.authenticate('jwt'), policy.isAllowed, terms);

  app.route('/api/users').all(passport.authenticate('jwt'), policy.isAllowed)
    .put(model.isValid(usersSchema), update)
    .delete(deleteUser);

  app.route('/api/users/password')
    .post(passport.authenticate('jwt'), policy.isAllowed, updatePassword);

  app.route('/api/users/avatar').all(passport.authenticate('jwt'), policy.isAllowed)
    .post(multer.create('img', config.uploads.avatar), updateAvatar)
    .delete(deleteAvatar);

  app.route('/api/users/data').all(passport.authenticate('jwt'), policy.isAllowed)
    .get(usersData.getAnyUser)
    .delete(usersData.deleteUser);

  app.route('/api/users/data/mail').all(passport.authenticate('jwt'), policy.isAllowed)
    .get(usersData.getMail);
};
