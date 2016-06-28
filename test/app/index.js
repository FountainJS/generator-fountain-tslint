const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies);
const _ = require('lodash');
const test = require('ava');
const TestUtils = require('fountain-generator').TestUtils;

let context;
const pkg = {
  devDependencies: {
    tslint: '^3.2.1',
    typescript: '^1.7.5',
    typings: '^1.0.4'
  }
};

test.before(() => {
  context = TestUtils.mock('app');
  require('../../generators/app/index');
  process.chdir('../../');
});

test.beforeEach(() => {
  context.mergeJson['package.json'] = null;
  context.copyTemplate['package.json'] = null;
  context.copyTemplate['conf/ts.conf.json'] = null;
  context.copyTemplate['typings.json'] = null;
  context.copyTemplate['gulp_tasks/scripts.js'] = null;
});

test('Configure package.json when modules is webpack', t => {
  const expected = _.merge({}, pkg, {devDependencies: {'tslint-loader': '^2.1.0'}});
  TestUtils.call(context, 'configuring.pkg', {modules: 'webpack'});
  t.deepEqual(context.mergeJson['package.json'], expected);
});

test('Configure package.json when modules is systmejs', t => {
  const expected = _.merge({}, pkg, {devDependencies: {'gulp-tslint': '^4.2.2'}});
  TestUtils.call(context, 'configuring.pkg', {modules: 'systemjs'});
  t.deepEqual(context.mergeJson['package.json'], expected);
});

test('Copy tslint.json', t => {
  TestUtils.call(context, 'configuring.tslint');
  t.true(context.copyTemplate['tslint.json'].length > 0);
});

test('wireing(): call replaceInFileWithTemplate twice when modules is webpack', () => {
  context.replaceInFileWithTemplate = () => {};
  const spy = chai.spy.on(context, 'replaceInFileWithTemplate');
  TestUtils.call(context, 'writing.wireing', {modules: 'webpack'});
  expect(spy).to.have.been.called.with('conf/webpack.conf.js', 'conf/webpack.conf.js');
  expect(spy).to.have.been.called.with('conf/webpack.conf.js', 'conf/webpack-test.conf.js');
});

test('wireing(): call copyTemplate twice when modules is systemjs', t => {
  const spy = chai.spy.on(context, 'copyTemplate');
  TestUtils.call(context, 'writing.wireing', {modules: 'systemjs'});
  expect(spy).to.have.been.called.with('gulp_tasks/scripts-full.js', 'gulp_tasks/scripts.js');
  t.true(context.copyTemplate['gulp_tasks/scripts.js'].length > 0);
});

test('wireing(): call replaceInFileWithTemplate twice when modules is inject', () => {
  context.replaceInFileWithTemplate = () => {};
  const spy = chai.spy.on(context, 'replaceInFileWithTemplate');
  TestUtils.call(context, 'writing.wireing', {modules: 'inject'});
  expect(spy).to.have.been.called.with('gulp_tasks/scripts-require.js', 'gulp_tasks/scripts.js');
  expect(spy).to.have.been.called.with('gulp_tasks/scripts-stream.js', 'gulp_tasks/scripts.js');
});

test(`wireing(): copy 'gulp_tasks/scripts.js' when modules is webpack`, t => {
  TestUtils.call(context, 'writing.wireing', {modules: 'systemjs'});
  t.true(context.copyTemplate['gulp_tasks/scripts.js'].length > 0);
});

test(`copy 'conf/ts.conf.json' when modules is webpack`, t => {
  TestUtils.call(context, 'writing.tsConf', {modules: 'webpack'});
  t.true(context.copyTemplate['conf/ts.conf.json'].length > 0);
});

test(`copy 'conf/ts.conf.json' when modules is systemhs`, t => {
  TestUtils.call(context, 'writing.tsConf', {modules: 'systemjs'});
  t.is(context.copyTemplate['conf/ts.conf.json'], null);
});

test(`copy 'typings.json'`, t => {
  TestUtils.call(context, 'writing.typings');
  t.true(context.copyTemplate['typings.json'].length > 0);
});

test('Call runInstall', () => {
  context.runInstall = () => {};
  const spy = chai.spy.on(context, 'runInstall');
  TestUtils.call(context, 'install');
  expect(spy).to.have.been.called.with('./node_modules/.bin/typings');
});
