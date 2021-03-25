/**
 * Module dependencies.
 */

import fs from 'fs';
import chalk from 'chalk';
import path from 'path';
import mongoose from 'mongoose';
import config from '../../config';

/**
 * Load all mongoose related models
 */
export async function loadModels(callback?: () => void) {
  // Globbing model files
  await Promise.all(
    config.files.mongooseModels.map(async (modelPath: string) => {
      await import(path.resolve(modelPath));
    }),
  );
  if (callback) callback();
}

/**
 * Connect to the MongoDB server
 */
export const connect = async (): Promise<mongoose.Mongoose> => {
  try {
    // Attach Node.js native Promises library implementation to Mongoose
    mongoose.Promise = Promise;
    // Requires as of 4.11.0 to opt-in to the new connect implementation
    // see: http://mongoosejs.com/docs/connections.html#use-mongo-client
    const mongoOptions = config.db.options;

    if (config.db.sslLocations && config.db.sslLocations.sslCA) mongoOptions.sslCA = [fs.readFileSync(config.db.sslLocations.sslCA)];
    if (config.db.sslLocations && config.db.sslLocations.sslCert) mongoOptions.sslCert = fs.readFileSync(config.db.sslLocations.sslCert);
    if (config.db.sslLocations && config.db.sslLocations.sslKey) mongoOptions.sslKey = fs.readFileSync(config.db.sslLocations.sslKey);

    await mongoose.connect(config.db.uri, mongoOptions);
    mongoose.set('debug', config.db.debug);

    return mongoose;
  } catch (err) {
    // Log Error
    console.error(chalk.red('Could not connect to MongoDB!'));
    console.log(err);
    throw err;
  }
};

/**
 * Disconnect from the MongoDB server
 */
export const disconnect = async () => {
  await mongoose.disconnect();
  console.info(chalk.yellow('Disconnected from MongoDB.'));
};
