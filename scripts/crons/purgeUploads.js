"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/**
 * Module dependencies
 */
const chalk_1 = (0, tslib_1.__importDefault)(require("chalk"));
const mongooseService = (0, tslib_1.__importStar)(require("../../lib/services/mongoose"));
/**
 * Work
 */
const purge = async () => {
    try {
        await mongooseService.connect();
        await mongooseService.loadModels();
        const uploadRepository = await Promise.resolve().then(() => (0, tslib_1.__importStar)(require('../../modules/uploads/repositories/uploads.repository')));
        const result = await uploadRepository.purge('avatar', 'users', 'avatar');
        console.log(chalk_1.default.bold.blue(`Uploads purged ${result.deletedCount} avatar`));
    }
    catch (err) {
        console.log(chalk_1.default.bold.red(`Error ${err}`));
    }
    setTimeout(() => {
        console.log(chalk_1.default.green('Finish purge of uploads in mongoDB'));
        process.exit(0);
    }, 1000);
};
purge();
//# sourceMappingURL=purgeUploads.js.map