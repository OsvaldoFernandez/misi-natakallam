import gulp from 'gulp';
import cached from 'gulp-cached';
import gulpif from 'gulp-if';
import preprocess from 'gulp-preprocess';
import { getSecretKeys } from '../config';

const localConfig = {
  src () {
    return [`./src/*.js`, './vendor/*.js'];
  },
  dest () {
    return './build/js/';
  },
  buildFileName: 'all.js'
};

gulp.task('scripts', () => {
  return gulp.src(localConfig.src())
    .pipe(cached('scripts'))
    .pipe(preprocess({ context: getSecretKeys() }))
    .pipe(gulp.dest(localConfig.dest()));
});
