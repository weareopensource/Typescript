"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Module dependencies.
 */
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const errors_1 = tslib_1.__importDefault(require("../../../lib/helpers/errors"));
// const mock = require('mock-fs');
const multerService = tslib_1.__importStar(require("../../../lib/services/multer"));
const mongooseService = tslib_1.__importStar(require("../../../lib/services/mongoose"));
const seed = tslib_1.__importStar(require("../../../lib/services/seed"));
const config_1 = tslib_1.__importDefault(require("../../../config"));
const logger_1 = tslib_1.__importDefault(require("../../../lib/services/logger"));
/**
 * Unit tests
 */
describe('Configuration Tests:', () => {
    // let AuthService;
    let UserService;
    let TaskService;
    beforeAll(async () => {
        try {
            await mongooseService.connect();
            await multerService.storage();
            await mongooseService.loadModels();
            UserService = await Promise.resolve().then(() => tslib_1.__importStar(require('../../users/services/user.service')));
            TaskService = await Promise.resolve().then(() => tslib_1.__importStar(require('../../tasks/services/tasks.service')));
            // AuthService = await import('../../auth/services/auth.service');
        }
        catch (e) {
            console.log(e);
        }
    });
    let user1;
    let admin1;
    let userFromSeedConfig;
    let adminFromSeedConfig;
    let tasksFromSeedConfig;
    let originalLogConfig;
    describe('Configurations', () => {
        test('should load production configuration in production env', async () => {
            try {
                const defaultConfig = await Promise.resolve().then(() => tslib_1.__importStar(require('../../../config')));
                expect(defaultConfig.default.app.title.split(' - ')[1]).toBe('Test Environment');
            }
            catch (err) {
                console.log(err);
                expect(err).toBeFalsy();
            }
        });
    });
    describe('SeedDB', () => {
        beforeAll((done) => {
            user1 = {
                provider: 'local',
                email: 'user_config_test_@localhost.com',
                firstName: 'User',
                lastName: 'Local',
                roles: ['user'],
            };
            admin1 = {
                provider: 'local',
                email: 'admin_config_test_@localhost.com',
                firstName: 'Admin',
                lastName: 'Local',
                roles: ['user', 'admin'],
            };
            userFromSeedConfig = config_1.default.seedDB.options.seedUser;
            adminFromSeedConfig = config_1.default.seedDB.options.seedAdmin;
            tasksFromSeedConfig = config_1.default.seedDB.options.seedTasks;
            done();
        });
        it('should have seedDB configuration set for user', (done) => {
            expect(userFromSeedConfig).toBeInstanceOf(Object);
            expect(typeof userFromSeedConfig.email).toBe('string');
            done();
        });
        it('should have seedDB configuration set for admin user', (done) => {
            expect(userFromSeedConfig).toBeInstanceOf(Object);
            expect(typeof adminFromSeedConfig.email).toBe('string');
            done();
        });
        it('should have seedDB configuration set for tasks', (done) => {
            expect(tasksFromSeedConfig).toBeInstanceOf(Array);
            expect(typeof tasksFromSeedConfig[0].title).toBe('string');
            expect(typeof tasksFromSeedConfig[1].title).toBe('string');
            done();
        });
        it('should seed ONLY the admin user account when NODE_ENV is set to "production"', async () => {
            const nodeEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'production';
            let result;
            try {
                result = await seed.start({ logResults: false });
                expect(result).toBeInstanceOf(Array);
                expect(result).toHaveLength(1);
            }
            catch (err) {
                console.log(err);
                expect(err).toBeFalsy();
            }
            try {
                await UserService.deleteUser({ id: result[0]._id });
            }
            catch (err) {
                console.log(err);
                expect(err).toBeFalsy();
            }
            process.env.NODE_ENV = nodeEnv;
        });
        it('should seed admin, user accounts when NODE_ENV is set to "test"', async () => {
            const nodeEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'test';
            let result;
            try {
                result = await seed.start({ logResults: false });
                expect(result).toBeInstanceOf(Array);
                expect(result).toHaveLength(2);
            }
            catch (err) {
                console.log(err);
                expect(err).toBeFalsy();
            }
            try {
                await UserService.deleteUser({ id: result[0]._id });
                await UserService.deleteUser({ id: result[1]._id });
            }
            catch (err) {
                console.log(err);
                expect(err).toBeFalsy();
            }
            process.env.NODE_ENV = nodeEnv;
        });
        it('should seed admin, user accounts  and tasks when NODE_ENV is set to "development"', async () => {
            const nodeEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'development';
            let result;
            try {
                result = await seed.start({ logResults: false });
                expect(result).toBeInstanceOf(Array);
                expect(result).toHaveLength(4);
            }
            catch (err) {
                console.log(err);
                expect(err).toBeFalsy();
            }
            try {
                await UserService.deleteUser({ id: result[0]._id });
                await UserService.deleteUser({ id: result[1]._id });
                await TaskService.deleteTask({ id: result[2]._id });
                await TaskService.deleteTask({ id: result[3]._id });
            }
            catch (err) {
                console.log(err);
                expect(err).toBeFalsy();
            }
            process.env.NODE_ENV = nodeEnv;
        });
        it('should seed admin, and "regular" user accounts when NODE_ENV is set to "test" when they already exist', async () => {
            const nodeEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'test';
            let _user;
            let _admin;
            let result;
            try {
                _user = await UserService.create(userFromSeedConfig);
                _admin = await UserService.create(adminFromSeedConfig);
                expect(_user).toBeInstanceOf(Object);
                expect(_admin).toBeInstanceOf(Object);
            }
            catch (err) {
                console.log(err);
                expect(err).toBeFalsy();
            }
            try {
                result = await UserService.search({ email: { $in: [adminFromSeedConfig.email, userFromSeedConfig.email] } });
                expect(result).toBeInstanceOf(Array);
                expect(result).toHaveLength(2);
            }
            catch (err) {
                console.log(err);
                expect(err).toBeFalsy();
            }
            try {
                result = await seed.start({ logResults: false });
                expect(result).toBeInstanceOf(Array);
                expect(result).toHaveLength(2);
            }
            catch (err) {
                console.log(err);
                expect(err).toBeFalsy();
            }
            try {
                await UserService.deleteUser({ id: result[0]._id });
                await UserService.deleteUser({ id: result[1]._id });
            }
            catch (err) {
                console.log(err);
                expect(err).toBeFalsy();
            }
            process.env.NODE_ENV = nodeEnv;
        });
        it('should ONLY seed admin user account when NODE_ENV is set to "production" with custom admin', async () => {
            const nodeEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'production';
            let result;
            try {
                result = await seed.start({ logResults: false, seedAdmin: admin1 });
                expect(result).toBeInstanceOf(Array);
                expect(result).toHaveLength(1);
                expect(result[0].email).toBe(admin1.email);
            }
            catch (err) {
                console.log(err);
                expect(err).toBeFalsy();
            }
            try {
                await UserService.deleteUser({ id: result[0]._id });
            }
            catch (err) {
                console.log(err);
                expect(err).toBeFalsy();
            }
            process.env.NODE_ENV = nodeEnv;
        });
        it('should seed admin, and "regular" user accounts when NODE_ENV is set to "test" with custom options', async () => {
            const nodeEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'test';
            let result;
            try {
                result = await seed.start({ logResults: false, seedAdmin: admin1, seedUser: user1 });
                expect(result).toBeInstanceOf(Array);
                expect(result).toHaveLength(2);
                expect(result[0].email).toBe(user1.email);
                expect(result[1].email).toBe(admin1.email);
            }
            catch (err) {
                console.log(err);
                expect(err).toBeFalsy();
            }
            try {
                await UserService.deleteUser({ id: result[0]._id });
                await UserService.deleteUser({ id: result[1]._id });
            }
            catch (err) {
                console.log(err);
                expect(err).toBeFalsy();
            }
            process.env.NODE_ENV = nodeEnv;
        });
        it('should NOT seed admin user account if it already exists when NODE_ENV is set to "production"', async () => {
            const nodeEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'production';
            let _admin;
            let result;
            try {
                _admin = await UserService.create(adminFromSeedConfig);
                expect(_admin).toBeInstanceOf(Object);
            }
            catch (err) {
                console.log(err);
                expect(err).toBeFalsy();
            }
            try {
                result = await seed.start({ logResults: false });
                expect(result[0].details[0].message).toBe('Failed due to local account already exists: seedadmin@localhost.com');
            }
            catch (err) {
                console.log(err);
                expect(err).toBeFalsy();
            }
            process.env.NODE_ENV = nodeEnv;
        });
    });
    describe('Logger', () => {
        beforeEach(() => {
            originalLogConfig = lodash_1.default.clone(config_1.default.log);
            // mock();
        });
        afterEach(() => {
            config_1.default.log = originalLogConfig;
            // mock.restore();
        });
        test('should retrieve the log format from the logger configuration', () => {
            config_1.default.log = {
                fileLogger: {
                    directoryPath: '',
                    fileName: '',
                },
                format: 'tiny',
            };
            const format = logger_1.default.getLogFormat();
            expect(format).toBe('tiny');
        });
        test('should retrieve the log options from the logger configuration for a valid stream object', () => {
            const options = logger_1.default.getMorganOptions();
            expect(options).toBeInstanceOf(Object);
            expect(options.stream).toBeDefined();
        });
        test('should use the default log format of "combined" when an invalid format was provided', async () => {
            const _logger = await Promise.resolve().then(() => tslib_1.__importStar(require('../../../lib/services/logger')));
            // manually set the config log format to be invalid
            config_1.default.log = {
                fileLogger: {
                    directoryPath: '',
                    fileName: '',
                },
                format: '_some_invalid_format_',
            };
            const format = _logger.default.getLogFormat();
            expect(format).toBe('combined');
        });
        test('should verify that a file logger object was created using the logger configuration', () => {
            const _dir = process.cwd();
            const _filename = 'unit-test-access.log';
            config_1.default.log = {
                fileLogger: {
                    directoryPath: _dir,
                    fileName: _filename,
                },
            };
            const fileTransport = logger_1.default.getLogOptions(config_1.default);
            expect(fileTransport).toBeInstanceOf(Object);
            expect(fileTransport.filename).toBe(`${_dir}/${_filename}`);
        });
        test('should not create a file transport object if critical options are missing: filename', () => {
            // manually set the config stream fileName option to an empty string
            config_1.default.log = {
                format: 'combined',
                fileLogger: {
                    directoryPath: '',
                    fileName: '',
                },
                options: {
                    stream: {
                        directoryPath: process.cwd(),
                        fileName: '',
                    },
                },
            };
            const fileTransport = logger_1.default.setupFileLogger(config_1.default);
            expect(fileTransport).toBe(false);
        });
        test('should not create a file transport object if critical options are missing: directory', () => {
            // manually set the config stream fileName option to an empty string
            config_1.default.log = {
                format: 'combined',
                fileLogger: {
                    directoryPath: '',
                    fileName: '',
                },
                options: {
                    stream: {
                        directoryPath: '',
                        fileName: 'app.log',
                    },
                },
            };
            const fileTransport = logger_1.default.setupFileLogger(config_1.default);
            expect(fileTransport).toBe(false);
        });
    });
    describe('Multer', () => {
        test('should be able to get multer avatar configuration', () => {
            const userAvatarConfig = config_1.default.uploads.avatar;
            expect(userAvatarConfig).toBeDefined();
            expect(userAvatarConfig.formats).toBeInstanceOf(Array);
            expect(userAvatarConfig.limits.fileSize).toBe(1048576);
        });
        test('should be able to generate 32 bytes file name', async () => {
            const filename = await multerService.generateFileName('filename.png');
            expect(filename).toHaveLength(68);
        });
    });
    describe('Errors', () => {
        test('should return errors message properly', async () => {
            try {
                const fromCode = errors_1.default({ code: 11001, errmsg: 'test' });
                expect(fromCode).toBe('Test already exists.');
                const fromCode2 = errors_1.default({ code: 11001, errmsg: 'test.$.test' });
                expect(fromCode2).toBe('Test.$ already exists.');
                const fromCodeUnknow = errors_1.default({ code: 'unknow' });
                expect(fromCodeUnknow).toBe('Something went wrong.');
                const fromErrorsArray = errors_1.default({ errors: [{ message: 'error1' }, { message: 'error2' }] });
                expect(fromErrorsArray).toBe('error1 error2 .');
                const fromErrorsObject = errors_1.default({ errors: { one: { message: 'error1' }, two: { message: 'error2' } } });
                expect(fromErrorsObject).toBe('error1 error2 .');
                const fromMessage = errors_1.default({ message: 'error1' });
                expect(fromMessage).toBe('error1.');
                const fromEmpty = errors_1.default({});
                expect(fromEmpty).toBe('error while retrieving the error :o : {}.');
            }
            catch (err) {
                console.log(err);
                expect(err).toBeFalsy();
            }
        });
    });
    // Mongoose disconnect
    afterAll(() => mongooseService.disconnect()
        .catch((e) => {
        console.log(e);
    }));
});
//# sourceMappingURL=core.lib.tests.js.map