"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// Set the Node ENV
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const mongooseService = tslib_1.__importStar(require("../../lib/services/mongoose"));
process.env.NODE_ENV = 'development';
mongooseService.loadModels();
const _indexToRemove = 'email_1';
const errors = [];
const processedCount = 0;
mongooseService.connect((db) => {
    // get a reference to the User collection
    const userCollection = db.connections[0].collections.users;
    console.log();
    console.log(chalk_1.default.yellow(`Removing index "${_indexToRemove}" from the User collection.`));
    console.log();
    // Remove the index
    userCollection.dropIndex(_indexToRemove, (err, result) => {
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
});
function reportAndExit(message) {
    if (errors.length) {
        console.log(chalk_1.default.red(message));
        console.log();
        console.log(chalk_1.default.yellow('Errors:'));
        for (const i = 0; i < errors.length; i++) {
            console.log(chalk_1.default.red(errors[i]));
            if (i === (errors.length - 1)) {
                process.exit(0);
            }
        }
    }
    else {
        console.log(chalk_1.default.green(message));
        console.log(chalk_1.default.green(`${'The next time your application starts, '
            + 'Mongoose will rebuild the index "'}${_indexToRemove}".`));
        process.exit(0);
    }
}
//# sourceMappingURL=upgrade-users-sparse-index.js.map