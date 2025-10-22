const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const options = {
  definition: { openapi: '3.0.0', info: { title: 'dbg' } },
  apis: ['../**/*.js', '!../**/node_modules/**', '!./**/*']
};
try {
  const specs = swaggerJsdoc(options);
  console.log('ok', Object.keys(specs));
} catch (err) {
  console.error('ERROR', err && err.message);
  // attempt to list the matching files using glob
  const glob = require('glob');
  const matches = glob.sync(options.apis.join(','), { cwd: __dirname, absolute: true, dot: true, nodir: false });
  console.log('glob matches (including dirs):', matches.slice(0,50));
  // show types
  matches.slice(0,50).forEach((p) => {
    try { const fs = require('fs'); const s = fs.statSync(p); console.log(p, s.isDirectory() ? 'DIR' : 'FILE'); } catch(e){ console.log(p, 'ERR');}
  });
}
