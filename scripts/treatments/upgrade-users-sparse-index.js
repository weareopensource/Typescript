"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// Set the Node ENV
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const mongooseService = tslib_1.__importStar(require("../../lib/services/mongoose"));
process.env.NODE_ENV = 'development';
mongooseService.loadModels();
// eslint-disable-next-line @typescript-eslint/naming-convention
const _indexToRemove = 'email_1';
const errors = [];
function reportAndExit(message) {
    if (errors.length) {
        console.log(chalk_1.default.red(message));
        console.log();
        console.log(chalk_1.default.yellow('Errors:'));
        errors.forEach((err, index) => {
            console.log(chalk_1.default.red(err));
            if (index === (errors.length - 1)) {
                process.exit(0);
            }
        });
    }
    else {
        console.log(chalk_1.default.green(message));
        console.log(chalk_1.default.green(`${'The next time your application starts, '
            + 'Mongoose will rebuild the index "'}${_indexToRemove}".`));
        process.exit(0);
    }
}
async function start() {
    await mongooseService.connect();
    await mongooseService.loadModels();
    // get a reference to the User collection
    const User = mongoose_1.default.model('User');
    console.log();
    console.log(chalk_1.default.yellow(`Removing index "${_indexToRemove}" from the User collection.`));
    console.log();
    // Remove the index
    User.collection.dropIndex(_indexToRemove, (err) => {
        let message = `Successfully removed the index "${_indexToRemove}".`;
        if (err) {
            errors.push(err);
            message = `An error occured while removing the index "${_indexToRemove}".`;
            if (err.message.indexOf('index not found with name') !== -1) {
                message = `Index "${_indexToRemove}" could not be found.`
                    + '\r\nPlease double check the index name in your '
                    + 'mongodb User collection.';
            }
            reportAndExit(message);
        }
        else {
            reportAndExit(message);
        }
    });
}
start();
//# sourceMappingURL=upgrade-users-sparse-index.js.map