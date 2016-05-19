  return gulp.src(conf.path.src('**/*.<%- framework === 'react' ? 'tsx' : 'ts' %>'))
    .pipe(tslint())
    .pipe(tslint.report('verbose'))
