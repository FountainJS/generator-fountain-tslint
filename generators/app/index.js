const _ = require('lodash');
const fountain = require('fountain-generator');

module.exports = fountain.Base.extend({
  configuring: {
    pkg() {
      const pkg = {
        devDependencies: {
          'tslint': '^4.4.2',
          'typescript': '^2.1.0',
          '@types/node': '^7.0.5',
          '@types/es6-shim': '^0.31.32',
          '@types/jasmine': '^2.5.43'
        }
      };

      if (this.options.modules === 'webpack') {
        _.merge(pkg, {devDependencies: {'tslint-loader': '^3.4.2'}});
      } else {
        _.merge(pkg, {devDependencies: {'gulp-tslint': '^7.1.0'}});
      }

      // if (this.options.framework === 'angular2') {
      //   _.merge(pkg, {devDependencies: {codelyzer: '^2.0.0-beta.1'}});
      // }

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
    }
  }
});
