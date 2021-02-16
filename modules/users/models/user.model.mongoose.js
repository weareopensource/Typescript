"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
mongoose_1.default.Promise = Promise;
/**
 * User Schema
 */
const UserMongoose = new mongoose_1.default.Schema({
    firstName: String,
    lastName: String,
    bio: String,
    position: String,
    email: {
        type: String,
        unique: 'Email already exists',
    },
    avatar: String,
    roles: [String],
    /* Provider */
    provider: String,
    providerData: {},
    additionalProvidersData: {},
    /* Password */
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    // startup requirement
    terms: Date,
    // other
    complementary: {},
}, {
    timestamps: true,
});
function addID() {
    return this._id.toHexString();
}
UserMongoose.virtual('id').get(addID);
// Ensure virtual fields are serialised.
UserMongoose.set('toJSON', {
    virtuals: true,
});
/**
 * Create instance method for authenticating user
 */
// UserMongoose.methods.authenticate = password => this.password === this.hashPassword(password);
// UserMongoose.static('findOneOrCreate', async (condition, doc) => {
//   const one = await this.findOne(condition);
//   return one || this.create(doc).then((document) => {
//     console.log('docteur', document);
//     return document;
//   }).catch((err) => {
//     console.log(err);
//     return Promise.resolve(doc);
//   });
// });
exports.default = mongoose_1.default.model('User', UserMongoose);
//# sourceMappingURL=user.model.mongoose.js.map