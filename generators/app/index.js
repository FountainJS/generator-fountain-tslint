const _ = require('lodash');
const fountain = require('fountain-generator');

module.exports = fountain.Base.extend({
  configuring: {
    pkg() {
      const pkg = {
        devDependencies: {
          tslint: '^3.2.1',
          typescript: '^2.0.2',
          typings: '^1.0.4'
        }
      };

      if (this.options.modules === 'webpack') {
        _.merge(pkg, {devDependencies: {'tslint-loader': '^2.1.0'}});
      } else {
        _.merge(pkg, {devDependencies: {'gulp-tslint': '^4.2.2'}});
      }

      if (this.options.framework === 'angular2') {
        _.merge(pkg, {devDependencies: {codelyzer: '^0.0.25'}});
      }

      this.mergeJson('package.json', pkg);
    },

    tslint() {
      this.copyTemplate('conf/tslint.conf.json', 'tslint.json');
    }
  },

  writing: {
    wireing() {
      if (this.options.modules === 'systemjs') {
        this.copyTemplate(
          'gulp_tasks/scripts-full.js',
          'gulp_tasks/scripts.js'
        );
      } else if (this.options.modules === 'inject') {
        this.replaceInFileWithTemplate(
          'gulp_tasks/scripts-require.js',
          'gulp_tasks/scripts.js',
          /const gulp = require\('gulp'\);/
        );
        this.replaceInFileWithTemplate(
          'gulp_tasks/scripts-stream.js',
          'gulp_tasks/scripts.js',
          / {2}return gulp\.src[^\n]*/
        );
      }
    },

    tsConf() {
      this.copyTemplate(
        'conf/ts.conf.json',
        'tsconfig.json'
      );
    },

    typings() {
      this.copyTemplate('typings.json', 'typings.json');
    }
  },

  install() {
    this.runInstall('./node_modules/.bin/typings');
  }
});
