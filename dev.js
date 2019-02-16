// Simple build script for development.
const chokidar = require('chokidar');
const spawn = require('cross-spawn');

function run (script) {
  spawn('npm', ['run', script], { stdio: 'inherit' });
}

run('dev');
run('rollup');
run('css');
run('pug');

chokidar.watch('src', {ignored: /(^|[\/\\])\../}).on('all', (event, path) => {
  if (event === 'change') {
    console.log(event, path);
    if (path.endsWith('.js')) {
      run('rollup');
    }

    if (path.endsWith('.styl')) {
      run('css');
    }

    if (path.endsWith('.pug')) {
      run('pug');
    }
  }
});
