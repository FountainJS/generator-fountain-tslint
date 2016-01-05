<% if (full) { -%>
const gulp = require('gulp');
const tslint = require('gulp-tslint');

const conf = require('../conf/gulp.conf');

gulp.task('scripts', scripts);

function scripts() {
<% } -%>
  return gulp.src(conf.path.src('**/*.<%- framework === 'react' ? 'tsx' : 'ts' %>'))
    .pipe(tslint({ configuration: 'conf/tslint.conf.json' }))
    .pipe(tslint.report('verbose'))<% if (full) { %>;<% } %>
<% if (full) { -%>
}
<% } -%>
