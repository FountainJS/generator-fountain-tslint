  return gulp.src(conf.path.src('**/*.<%- framework === 'react' ? 'tsx' : 'ts' %>'))
      .pipe(tslint({
        formatter: 'verbose'
      }))
      .pipe(tslint.report())
