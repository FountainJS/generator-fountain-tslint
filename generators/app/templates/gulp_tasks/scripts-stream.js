  return gulp.src(conf.path.src('**/*.<%- framework === 'react' ? 'tsx' : 'ts' %>'))
    .pipe(tslint({configuration: 'conf/tslint.conf.json'}))
    .pipe(tslint.report('verbose'))
