
const cp = require('child_process');
let status

(async () => {
  // Install Node.js dependencies
  ({ status } = cp.spawnSync('yarn', ['install'], { stdio: 'inherit' }));
  if (status !== 0) process.exit(status);

  // Pre-compile GraphQL queries
  ({ status } = cp.spawnSync('yarn', ['relay'], { stdio: 'inherit' }));
  if (status !== 0) process.exit(status);
})().catch(async err => {
  console.error(err);
  process.exit(1);
});
