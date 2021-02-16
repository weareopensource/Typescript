"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oauthCallback = exports.oauthCall = exports.buildToken = exports.signin = exports.signup = exports.checkOAuthUserProfile = void 0;
const tslib_1 = require("tslib");
const passport_1 = tslib_1.__importDefault(require("passport"));
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const AppError_1 = tslib_1.__importDefault(require("../../../../lib/helpers/AppError"));
const errors_1 = tslib_1.__importDefault(require("../../../../lib/helpers/errors"));
const responses_1 = require("../../../../lib/helpers/responses");
const model_1 = require("../../../../lib/middlewares/model");
const UserService = tslib_1.__importStar(require("../../../users/services/user.service"));
const user_schema_1 = tslib_1.__importDefault(require("../../../users/models/user.schema"));
const config_1 = tslib_1.__importDefault(require("../../../../config"));
async function checkOAuthUserProfile(profil, key, provider, res) {
    // check if user exist
    try {
        const query = { provider: undefined };
        query[`providerData.${key}`] = profil.providerData[key];
        query.provider = provider;
        const search = await UserService.search(query);
        if (search.length === 1)
            return search[0];
    }
    catch (err) {
        throw new AppError_1.default('oAuth, find user failed', { code: 'SERVICE_ERROR', details: err });
    }
    // if no, generate
    try {
        const user = {
            firstName: profil.firstName,
            lastName: profil.lastName,
            email: profil.email,
            avatar: profil.avatar || '',
            provider,
            providerData: profil.providerData || null,
        };
        const result = model_1.getResultFromJoi(user, user_schema_1.default, lodash_1.default.clone(config_1.default.joi.validationOptions));
        // check error
        const errorDetail = model_1.checkError(result);
        if (errorDetail)
            return responses_1.error(res, 422, 'Schema validation error', errorDetail)(result.error);
        // else return req.body with the data after Joi validation
        return await UserService.create(result.value);
    }
    catch (err) {
        throw new AppError_1.default('oAuth', { code: 'CONTROLLER_ERROR', details: err.details || err });
    }
}
exports.checkOAuthUserProfile = checkOAuthUserProfile;
/**
 * @desc Endpoint to ask the service to create a user
 */
async function signup(req, res) {
    try {
        if (!config_1.default.sign.up) {
            return responses_1.error(res, 404, 'Error', 'Sign Up actually disabled')();
        }
        const user = await UserService.create(req.body);
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, config_1.default.jwt.secret, {
            expiresIn: config_1.default.jwt.expiresIn,
        });
        return res
            .status(200)
            .cookie('TOKEN', token, { httpOnly: true })
            .json({
            user,
            tokenExpiresIn: Date.now() + config_1.default.jwt.expiresIn * 1000,
            type: 'sucess',
            message: 'Sign up',
        });
    }
    catch (err) {
        responses_1.error(res, 422, 'Unprocessable Entity', errors_1.default(err))(err);
    }
}
exports.signup = signup;
/**
 * @desc Endpoint to ask the service to connect a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function signin(req, res) {
    if (!config_1.default.sign.in) {
        return responses_1.error(res, 404, 'Error', 'Sign In actually disabled')();
    }
    const user = req.user;
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, config_1.default.jwt.secret, {
        expiresIn: config_1.default.jwt.expiresIn,
    });
    return res
        .status(200)
        .cookie('TOKEN', token, { httpOnly: true })
        .json({
        user,
        tokenExpiresIn: Date.now() + config_1.default.jwt.expiresIn * 1000,
        type: 'sucess',
        message: 'Sign in',
    });
}
exports.signin = signin;
/**
 * @desc Endpoint to get a new token if old is ok
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function buildToken(req, res) {
    let user;
    if (req.user) {
        user = {
            id: req.user.id,
            provider: escape(req.user.provider),
            roles: req.user.roles,
            avatar: req.user.avatar,
            email: escape(req.user.email),
            lastName: escape(req.user.lastName),
            firstName: escape(req.user.firstName),
            additionalProvidersData: req.user.additionalProvidersData,
        };
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, config_1.default.jwt.secret, {
        expiresIn: config_1.default.jwt.expiresIn,
    });
    return res
        .status(200)
        .cookie('TOKEN', token, { httpOnly: true })
        .json({ user, tokenExpiresIn: Date.now() + config_1.default.jwt.expiresIn * 1000 });
}
exports.buildToken = buildToken;
/**
 * @desc Endpoint for oautCall
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function oauthCall(req, res, next) {
    const strategy = req.params.strategy;
    passport_1.default.authenticate(strategy)(req, res, next);
}
exports.oauthCall = oauthCall;
/**
 * @desc Endpoint for oautCallCallBack
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
async function oauthCallback(req, res, next) {
    const strategy = req.params.strategy;
    // app Auth with Strategy managed on client side
    if (req.body.strategy === false && req.body.key) {
        try {
            let user = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                providerData: {},
            };
            user.providerData[req.body.key] = req.body.value;
            user = await checkOAuthUserProfile(user, req.body.key, strategy, res);
            // @ts-ignore
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, config_1.default.jwt.secret, {
                expiresIn: config_1.default.jwt.expiresIn,
            });
            return res
                .status(200)
                .cookie('TOKEN', token, { httpOnly: true })
                .json({
                user, tokenExpiresIn: Date.now() + config_1.default.jwt.expiresIn * 1000, type: 'sucess', message: 'oAuth Ok',
            });
        }
        catch (err) {
            return responses_1.error(res, 422, 'Unprocessable Entity', errors_1.default(err.details || err))(err);
        }
    }
    // classic web oAuth
    passport_1.default.authenticate(strategy, (err, user) => {
        const url = config_1.default.cors.origin[0];
        if (err) {
            res.redirect(302, `${url}/token?message=Unprocessable%20Entity&error=${JSON.stringify(err)}`);
        }
        else if (!user) {
            res.redirect(302, `${url}/token?message=Could%20not%20define%20user%20in%20oAuth&error=${JSON.stringify(err)}`);
        }
        else {
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, config_1.default.jwt.secret, {
                expiresIn: config_1.default.jwt.expiresIn,
            });
            res.cookie('TOKEN', token, { httpOnly: true });
            res.redirect(302, `${config_1.default.cors.origin[0]}/token`);
        }
    })(req, res, next);
}
exports.oauthCallback = oauthCallback;
//# sourceMappingURL=auth.authentication.controller.js.map