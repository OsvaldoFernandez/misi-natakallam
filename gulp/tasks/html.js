import gulp from 'gulp';
import del from 'del';
import { errorHandler, getSecretKeys } from '../config';
import preprocess from 'gulp-preprocess';

const localConfig = {
  src: `./src/*.html`,
  dest: './build',
  cleanSrc: './build/*.html'
};

gulp.task('clean:html', () => {
  return del([localConfig.cleanSrc]);
});

gulp.task('html', ['clean:html'], () => {
  return gulp.src(localConfig.src)
  .pipe(preprocess({ context: getSecretKeys() }))
  .pipe(gulp.dest(localConfig.dest));
});
