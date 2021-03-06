/**
 * Module dependencies.
 */
import chalk from 'chalk';
import fs from 'fs';
import glob from 'glob';
import _ from 'lodash';
import objectPath from 'object-path';
import path from 'path';
import assets from './assets';
import { IConfig } from './defaults/development';

/**
 * Get files by glob patterns
 */
const getGlobbedPaths = (globPatterns: any, excludes?: any) => {
  // URL paths regex
  /* eslint no-useless-escape:0 */
  const urlRegex = new RegExp('^(?:[a-z]+:)?//', 'i');
  let output: any[] = [];
  // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach((globPattern) => {
      output = _.union(output, getGlobbedPaths(globPattern, excludes));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      let files = glob.sync(globPatterns);
      if (excludes) {
        files = files.map((file) => {
          if (_.isArray(excludes)) {
            // @ts-ignore
            excludes((exlude: any) => {
              file = file.replace(exlude, '');
            });
          } else {
            file = file.replace(excludes, '');
          }
          return file;
        });
      }
      output = _.union(output, files);
    }
  }
  return output;
};

/** Validate config.domain is set
 */
const validateDomainIsSet = (config: any) => {
  if (!config.domain) {
    console.log(chalk.red('+ Important warning: config.domain is empty. It should be set to the fully qualified domain of the app.'));
  }
};

/**
 * validate secure parameters and create credentials in consequence value for ssl
 * @param config
 */
const initSecureMode = (config: any) => {
  if (!config.secure || config.secure.ssl !== true) return true;

  const key = fs.existsSync(path.resolve(config.secure.key));
  const cert = fs.existsSync(path.resolve(config.secure.cert));

  if (!key || !cert) {
    console.log(chalk.red('+ Error: Certificate file or key file is missing, falling back to non-SSL mode'));
    console.log(chalk.red('  To create them, simply run the following from your shell: sh ./scripts/generate-ssl-certs.sh'));
    console.log();
    config.secure.ssl = false;
  } else {
    config.secure.credentials = {
      key: fs.readFileSync(path.resolve(config.secure.key)),
      cert: fs.readFileSync(path.resolve(config.secure.cert)),
    };
  }
};

/**
 * Initialize global configuration files
 */
const initGlobalConfigFiles = (config: any, assetsConfig: any) => {
  config.files = {}; // Appending files
  config.files.mongooseModels = getGlobbedPaths(assetsConfig.mongooseModels); // Setting Globbed mongoose model files
  config.files.sequelizeModels = getGlobbedPaths(assetsConfig.sequelizeModels); // Setting Globbed sequelize model files
  config.files.routes = getGlobbedPaths(assetsConfig.routes); // Setting Globbed route files
  config.files.configs = getGlobbedPaths(assetsConfig.config); // Setting Globbed config files
  // config.files.sockets = getGlobbedPaths(assets.sockets); // Setting Globbed socket files
  config.files.policies = getGlobbedPaths(assetsConfig.policies); // Setting Globbed policies files
};

/**
 * Initialize global configuration
 */

const initGlobalConfig: () => IConfig = () => {
  const pathConfig = path.join(process.cwd(), './config', 'defaults', process.env.NODE_ENV || 'development');

  let defaultConfig;
  if (fs.existsSync(`${pathConfig}.js`)) {
    defaultConfig = require(pathConfig);
  } else {
    console.error(chalk.red(`+ Error: No configuration file found for "${process.env.NODE_ENV}" environment using development instead`));
    defaultConfig = require(path.join(process.cwd(), './config', 'defaults', 'development'));
  }

  // Get the config from  process.env.WAOS_NODE_*
  let environmentVars: any = _.mapKeys(
    _.pickBy(process.env, (_value, key) => key.startsWith('WAOS_NODE_')),
    (_v, k) => k.split('_').slice(2).join('.'),
  );

  // convert string array from sys  to real array
  environmentVars = _.mapValues(environmentVars, (v) => (v[0] === '[' && v[v.length - 1] === ']' ? v.replace(/'/g, '').slice(1, -1).split(',') : v));
  const environmentConfigVars = {};
  _.forEach(environmentVars, (v, k) => {
    let value = v;
    if (value === 'true') value = true;
    if (value === 'false') value = false;
    return objectPath.set(environmentConfigVars, k, value);
  });
  // Merge config files
  const config = _.merge(defaultConfig.default, environmentConfigVars);
  // read package.json for MEAN.JS project information
  // config.package = require(path.resolve('./../../package.json'));
  // Initialize global globbed files
  initGlobalConfigFiles(config, assets);
  // Init Secure SSL if can be used
  initSecureMode(config);
  // Print a warning if config.domain is not set
  validateDomainIsSet(config);
  // Expose configuration utilities
  config.utils = {
    getGlobbedPaths,
  };
  return config;
};

/**
 * Set configuration object
 */
export default initGlobalConfig();
