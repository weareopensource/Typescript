"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const users_data_controller_1 = require("./users.data.controller");
const users_images_controller_1 = require("./users/users.images.controller");
const users_profile_controller_1 = require("./users/users.profile.controller");
/**
 * Extend user's controller
 */
exports.default = {
    userInfo: users_profile_controller_1.userInfo, terms: users_profile_controller_1.terms, deleteProfileUser: users_profile_controller_1.deleteUser, deleteDataUser: users_data_controller_1.deleteUser, update: users_profile_controller_1.update, deleteAvatar: users_images_controller_1.deleteAvatar, updateAvatar: users_images_controller_1.updateAvatar, get: users_data_controller_1.get, getMail: users_data_controller_1.getMail,
};
//# sourceMappingURL=users.controller.js.map