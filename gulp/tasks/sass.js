import gulp from 'gulp';
import sass from 'gulp-sass';
import del from 'del';

const localConfig = {
  src: `./src/*.scss`,
  dest: './build/css/'
};

gulp.task('sass', () => {
  return gulp.src(localConfig.src)
    .pipe(sass({}))
    .pipe(gulp.dest(localConfig.dest));
});
