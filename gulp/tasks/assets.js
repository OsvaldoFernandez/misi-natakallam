import gulp from 'gulp';
import gulpif from 'gulp-if';
import del from 'del';

const localConfig = {
  src: [`./src/assets/**/*`],
  dest: './build/assets',
  cleanSrc: './build/assets'
};

gulp.task('clean:assets', () => del([localConfig.cleanSrc]));

gulp.task('assets', ['clean:assets'], () => {
  return gulp.src(localConfig.src)
    .pipe(gulp.dest(localConfig.dest));
});
