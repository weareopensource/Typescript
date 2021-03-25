interface IAssets {
  gulpConfig: string[];
  allJS: string[];
  allTS: string[];
  mongooseModels: string;
  sequelizeModels: string;
  routes: string[];
  // sockets: 'modules/*/sockets/*.js',
  config: string[];
  policies: string;
  tests: string[];
  views: string[];
}

const assets: IAssets = {
  gulpConfig: ['gulpfile.js'],
  allJS: ['server.js', 'config/**/*.js', 'lib/**/*.js', 'modules/*/**/*.js'],
  allTS: ['server.ts', 'config/**/*.ts', 'lib/**/*.ts', 'modules/*/**/*.ts'],
  mongooseModels: 'modules/*/models/*.mongoose.js',
  sequelizeModels: 'modules/*/models/*.sequelize.js',
  routes: ['modules/!(core)/routes/*.js', 'modules/core/routes/*.js'],
  // sockets: 'modules/*/sockets/*.js',
  config: ['modules/*/config/*.js'],
  policies: 'modules/*/policies/*.js',
  tests: ['modules/*/tests/**/*.js'],
  views: ['modules/*/views/*.html'],
};

export default assets;
