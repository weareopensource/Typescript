/**
 * Module dependencies
 */
import { get, getMail, deleteUser as deleteDataUser } from './users.data.controller';
import { deleteAvatar, updateAvatar } from './users/users.images.controller';
import {
  userInfo, deleteUser as deleteProfileUser, terms, update,
} from './users/users.profile.controller';

/**
 * Extend user's controller
 */
export default {
  userInfo, terms, deleteProfileUser, deleteDataUser, update, deleteAvatar, updateAvatar, get, getMail,
};
