"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assets = {
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
exports.default = assets;
//# sourceMappingURL=assets.js.map