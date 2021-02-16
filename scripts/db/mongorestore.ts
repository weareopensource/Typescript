/**
 * Module dependencies
 */
import { deserializeStream } from 'bson';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import * as mongooseService from '../../lib/services/mongoose';
import config from '../../config';

const fsPromises = fs.promises;

/**
 * Work
 */

const listDir = async (database) => {
  try {
    return await fsPromises.readdir(path.resolve(`./scripts/db/dump/${database}`));
  } catch (err) {
    console.error('Error occured while reading directory dump! ./scripts/db/dump/', err);
  }
};

const importFile = async (database, collection) => {
  try {
    return await fsPromises.readFile(path.resolve(`./scripts/db/dump/${database}/${collection}.bson`));
  } catch (err) {
    console.error('Error occured while reading directory dump! ./scripts/db/dump/', err);
  }
};

const seedData = async () => {
  try {
    console.log(chalk.bold.green('Start Seed Dump by update items if differents'));

    // connect to mongo
    await mongooseService.connect();
    await mongooseService.loadModels();

    let database = config.db.uri.split('/')[config.db.uri.split('/').length - 1];
    database = database.split('?')[0];
    console.log(chalk.bold.green(`database selected: ${database}`));

    const files = await listDir(database);

    for (const file of files) {
      if (file.slice(-4) === 'bson' && !config.db.restoreExceptions.includes(file.split('.')[0])) {
        const collection = file.slice(0, -5);

        // read file
        const buffer = await importFile(database, collection);
        let bfIdx = 0;
        const items = [];
        while (bfIdx < buffer.length) bfIdx = deserializeStream(buffer, bfIdx, 1, items, items.length, undefined);

        // insert
        if (collection.split('.')[0] === 'uploads') {
          const Service = require(path.resolve(`./modules/${collection.split('.')[0]}/services/${collection.split('.')[0]}.data.service`));
          await Service.import(items, ['_id'], collection);
        } else {
          const Service = require(path.resolve(`./modules/${collection}/services/${collection}.data.service`));
          await Service.import(items, ['_id']);
        }

        console.log(chalk.blue(`Database Seeding ${collection} : ${items.length}`));
      }
    }
  } catch (err) {
    console.log(chalk.bold.red(`Error ${err}`));
  }

  setTimeout(() => {
    console.log(chalk.bold.green('Finish adding items to mongoDB'));
    process.exit(0);
  }, 5000);
};

seedData();
