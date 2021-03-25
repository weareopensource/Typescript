"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prod = exports.debug = exports.drop = exports.seedUser = exports.seed = exports.testCoverage = exports.testWatch = exports.test = exports.dropDB = exports.dropMongo = exports.jestCoverage = exports.jestWatch = exports.jest = exports.watch = exports.nodemonDebug = exports.nodemon = void 0;
const tslib_1 = require("tslib");
/**
 * Module dependencies.
 */
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const gulp_1 = tslib_1.__importDefault(require("gulp"));
const gulp_load_plugins_1 = tslib_1.__importDefault(require("gulp-load-plugins"));
const core_1 = require("@jest/core");
const inquirer_1 = tslib_1.__importDefault(require("inquirer"));
const assets_1 = tslib_1.__importDefault(require("./config/assets"));
const config_1 = tslib_1.__importDefault(require("./config"));
const mongooseService = tslib_1.__importStar(require("./lib/services/mongoose"));
const seedService = tslib_1.__importStar(require("./lib/services/seed"));
const plugins = gulp_load_plugins_1.default();
// default node env if not define
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
// Nodemon
const nodemon = (done) => {
    nodemon({
        script: 'server.js',
        nodeArgs: ['--harmony'],
        ext: 'js,html',
        verbose: true,
        watch: lodash_1.default.union(assets_1.default.views, assets_1.default.config),
    });
    done();
};
exports.nodemon = nodemon;
// Nodemon (task without verbosity or debugging)
const nodemonDebug = (done) => {
    nodemon({
        script: 'server.js',
        nodeArgs: ['--harmony', '--debug', '--inspect'],
        ext: 'js,html',
        watch: lodash_1.default.union(assets_1.default.views, assets_1.default.config),
    });
    done();
};
exports.nodemonDebug = nodemonDebug;
// Watch (files For Changes)
const watch = (done) => {
    // Start livereload
    plugins.refresh.listen();
    // Add watch rules
    gulp_1.default.watch(assets_1.default.views).on('change', plugins.refresh.changed);
    // gulp.watch(defaultAssets.allJS).on('change', plugins.refresh.changed);
    gulp_1.default.watch(assets_1.default.gulpConfig);
    done();
};
exports.watch = watch;
// Jest UT
const jest = (done) => {
    core_1.runCLI({}, ['.'])
        .then((result) => {
        if (result.results && result.results.numFailedTests > 0)
            process.exit();
        done();
    })
        .catch((e) => {
        console.log(e);
    });
};
exports.jest = jest;
// Jest Watch
const jestWatch = (done) => {
    core_1.runCLI({ watch: true }, ['.']);
    done();
};
exports.jestWatch = jestWatch;
// Jest UT
const jestCoverage = (done) => {
    core_1.runCLI({
        collectCoverage: true,
        collectCoverageFrom: assets_1.default.allJS,
        coverageDirectory: 'coverage',
        coverageReporters: ['json', 'lcov', 'text'],
    }, ['.'])
        .then((result) => {
        if (result.results && result.results.numFailedTests > 0)
            process.exit();
        done();
    })
        .catch((e) => {
        console.log(e);
    });
};
exports.jestCoverage = jestCoverage;
// Drops the MongoDB database, used in e2e testing by security
const dropMongo = async () => {
    const db = await mongooseService.connect();
    await db.connection.dropDatabase();
    await mongooseService.disconnect();
};
exports.dropMongo = dropMongo;
// Drop database after confirmation, depends of ENV
const dropDB = async () => {
    if (process.env.NODE_ENV !== 'test') {
        const question = [
            {
                type: 'confirm',
                name: 'continue',
                message: `Do you want really want to dropDB in ${process.env.NODE_ENV} ENV ?(no)`,
                default: false,
            },
        ];
        const answer = await inquirer_1.default.prompt(question);
        if (!answer.continue)
            return process.exit(2);
        await dropMongo();
    }
    else
        await dropMongo();
};
exports.dropDB = dropDB;
// Connects to Mongoose based on environment settings and seeds the database
const seedMongoose = async () => {
    try {
        await mongooseService.connect();
        await seedService
            .start({
            logResults: true,
        })
            .catch((e) => {
            console.log(e);
        });
        await mongooseService.disconnect();
    }
    catch (err) {
        console.log(err);
    }
};
// Connects to Mongoose based on environment settings and seeds the database
const seedMongooseUser = async () => {
    try {
        await mongooseService.connect();
        await mongooseService.loadModels();
        await seedService.userSeed(config_1.default.seedDB.options.seedUser).catch((e) => {
            console.log(e);
        });
        await mongooseService.disconnect();
    }
    catch (err) {
        console.log(err);
    }
};
// Connects to an SQL database, drop and re-create the schemas
// gulp.task('seed:sequelize', (done) => {
//   const sequelize = require('./lib/services/sequelize');
//   sequelize.seed()
//     .then(() => {
//       sequelize.sequelize.close();
//       done();
//     });
// });
// Run project tests
const test = gulp_1.default.series(dropDB, jest);
exports.test = test;
// Run project tests with coverage
const testWatch = gulp_1.default.series(dropDB, jestWatch);
exports.testWatch = testWatch;
// Run project tests with coverage
const testCoverage = gulp_1.default.series(dropDB, jestCoverage);
exports.testCoverage = testCoverage;
// Run Mongoose Seed
const seed = gulp_1.default.series(dropDB, seedMongoose);
exports.seed = seed;
// Run Mongoose Seed
const seedUser = gulp_1.default.series(seedMongooseUser);
exports.seedUser = seedUser;
// Run Mongoose drop
const drop = gulp_1.default.series(dropDB);
exports.drop = drop;
// Run project in development mode
const dev = gulp_1.default.series(gulp_1.default.parallel(nodemon, watch));
exports.default = dev;
// Run project in debug mode
const debug = gulp_1.default.series(gulp_1.default.parallel(nodemonDebug, watch));
exports.debug = debug;
// Run project in production mode
const prod = gulp_1.default.series(gulp_1.default.parallel(nodemonDebug, watch));
exports.prod = prod;
/**
 * Examples for Mocha TODO : switch in readme
 */
// Example Mocha example
// const changedTestFiles = [];
// const mocha = () => {
//   const testSuites = changedTestFiles.length ? changedTestFiles : defaultAssets.tests;
//   return gulp.src(testSuites)
//     .pipe(plugins.mocha({
//       reporter: 'spec',
//       timeout: 10000,
//     }))
//     .on('error', (err) => {
//     // If an error occurs, save it
//       console.log(err);
//     });
// };
// exports.mocha = mocha;
// Example Watch server test files
// const watchMocha = (done) => {
//   // Start livereload
//   plugins.refresh.listen();
//   // Add Server Test file rules
//   gulp.watch(_.union(defaultAssets.tests, defaultAssets.allJS), gulp.series(mocha)).on('change', plugins.refresh.changed);
//   done();
// };
// exports.watchMocha = watchMocha;
// Example Bootstrap the server instance
// Common use case is to run API tests on real instantiated models and db
// const bootstrap = (done) => {
//   const app = require('./lib/app');
//   app.start().then(() => {
//     done();
//   });
// };
// exports.bootstrap = bootstrap;
//# sourceMappingURL=gulpfile.js.map