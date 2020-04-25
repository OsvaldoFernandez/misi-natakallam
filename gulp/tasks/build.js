import gulp from 'gulp';
import runSequence from 'run-sequence';
import { getConfigKeys } from '../config';

const config = getConfigKeys();

gulp.task('build', (cb) => {
  const defaultBuildTasks = ['assets', 'html', 'css', 'sass', 'scripts', cb];
  runSequence(...defaultBuildTasks);
});
