"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const bson_1 = require("bson");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const path_1 = tslib_1.__importDefault(require("path"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const mongooseService = tslib_1.__importStar(require("../../lib/services/mongoose"));
const config_1 = tslib_1.__importDefault(require("../../config"));
const fsPromises = fs_1.default.promises;
/**
 * Work
 */
const listDir = async (database) => {
    try {
        return await fsPromises.readdir(path_1.default.resolve(`./scripts/db/dump/${database}`));
    }
    catch (err) {
        console.error('Error occured while reading directory dump! ./scripts/db/dump/', err);
    }
};
const importFile = async (database, collection) => {
    try {
        return await fsPromises.readFile(path_1.default.resolve(`./scripts/db/dump/${database}/${collection}.bson`));
    }
    catch (err) {
        console.error('Error occured while reading directory dump! ./scripts/db/dump/', err);
    }
};
const seedData = async () => {
    try {
        console.log(chalk_1.default.bold.green('Start Seed Dump by update items if differents'));
        // connect to mongo
        await mongooseService.connect();
        await mongooseService.loadModels();
        let database = config_1.default.db.uri.split('/')[config_1.default.db.uri.split('/').length - 1];
        database = database.split('?')[0];
        console.log(chalk_1.default.bold.green(`database selected: ${database}`));
        const files = await listDir(database);
        for (const file of files) {
            if (file.slice(-4) === 'bson' && !config_1.default.db.restoreExceptions.includes(file.split('.')[0])) {
                const collection = file.slice(0, -5);
                // read file
                const buffer = await importFile(database, collection);
                let bfIdx = 0;
                const items = [];
                while (bfIdx < buffer.length)
                    bfIdx = bson_1.deserializeStream(buffer, bfIdx, 1, items, items.length, undefined);
                // insert
                if (collection.split('.')[0] === 'uploads') {
                    const Service = require(path_1.default.resolve(`./modules/${collection.split('.')[0]}/services/${collection.split('.')[0]}.data.service`));
                    await Service.import(items, ['_id'], collection);
                }
                else {
                    const Service = require(path_1.default.resolve(`./modules/${collection}/services/${collection}.data.service`));
                    await Service.import(items, ['_id']);
                }
                console.log(chalk_1.default.blue(`Database Seeding ${collection} : ${items.length}`));
            }
        }
    }
    catch (err) {
        console.log(chalk_1.default.bold.red(`Error ${err}`));
    }
    setTimeout(() => {
        console.log(chalk_1.default.bold.green('Finish adding items to mongoDB'));
        process.exit(0);
    }, 5000);
};
seedData();
//# sourceMappingURL=mongorestore.js.map