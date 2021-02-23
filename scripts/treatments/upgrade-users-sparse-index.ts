// Set the Node ENV
import chalk from 'chalk';
import mongoose from 'mongoose';
import * as mongooseService from '../../lib/services/mongoose';

process.env.NODE_ENV = 'development';
mongooseService.loadModels();

// eslint-disable-next-line @typescript-eslint/naming-convention
const _indexToRemove = 'email_1';
const errors: any[] = [];

function reportAndExit(message) {
  if (errors.length) {
    console.log(chalk.red(message));
    console.log();

    console.log(chalk.yellow('Errors:'));
    errors.forEach((err, index) => {
      console.log(chalk.red(err));

      if (index === (errors.length - 1)) {
        process.exit(0);
      }
    });
  } else {
    console.log(chalk.green(message));
    console.log(chalk.green(`${'The next time your application starts, '
    + 'Mongoose will rebuild the index "'}${_indexToRemove}".`));
    process.exit(0);
  }
}

async function start() {
  await mongooseService.connect();
  await mongooseService.loadModels();
  // get a reference to the User collection
  const User = mongoose.model('User');

  console.log();
  console.log(chalk.yellow(`Removing index "${
    _indexToRemove}" from the User collection.`));
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
    } else {
      reportAndExit(message);
    }
  });
}

start();
