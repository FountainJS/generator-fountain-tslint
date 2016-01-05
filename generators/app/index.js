const _ = require('lodash');
const fountain = require('fountain-generator');

module.exports = fountain.Base.extend({
  prompting() {
    this.fountainPrompting();
  },

  configuring: {
    pkg() {
      var pkg = {
        devDependencies: {
          tslint: '^3.2.1',
          typescript: '^1.7.5'
        }
      };

      if (this.props.modules === 'webpack') {
        _.merge(pkg, { devDependencies: { 'tslint-loader': '^2.1.0' } });
      } else {
        _.merge(pkg, { devDependencies: { 'gulp-tslint': '^4.2.2' } });
      }

      this.mergeJson('package.json', pkg);
    },

    tslint() {
      this.copyTemplate('conf/tslint.conf.json', 'conf/tslint.conf.json');
    }
  },

  writing: {
    wireing() {
      if (this.props.modules === 'webpack') {
        this.replaceInFile(
          'conf/webpack.conf.js',
          'conf/webpack.conf.js',
          / {2}module: \{/
        );
        this.replaceInFile(
          'conf/webpack.conf.js',
          'conf/webpack-test.conf.js',
          / {2}module: \{/
        );
      } else if (this.props.modules === 'systemjs') {
        this.copyTemplate(
          'gulp_tasks/scripts.js',
          'gulp_tasks/scripts.js',
          { full: true }
        );
      } else if (this.props.modules === 'inject') {
        this.replaceInFile(
          'gulp_tasks/scripts.js',
          / {2}return gulp\.src[^\n]*/,
          { full: false }
        );
      }
    },

    tsd() {
      this.copyTemplate('tsd.json', 'tsd.json');
    }
  },

  installing() {
    this.runInstall('tsd');
  }
});
