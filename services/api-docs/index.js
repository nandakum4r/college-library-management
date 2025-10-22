const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const glob = require('glob');

const app = express();
app.use(cors());

// Build options for swagger-jsdoc. We'll resolve file paths with glob
const baseDir = path.join(__dirname, '..');
// find all .js files under services (absolute paths), ignoring node_modules and this api-docs folder
const files = glob.sync('**/*.js', {
  cwd: baseDir,
  absolute: true,
  nodir: true,
  ignore: ['**/node_modules/**', 'api-docs/**']
});

if (!files.length) {
  console.warn('Warning: no JS files found for API docs. Check the glob path.');
}

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library Management API (Aggregated)',
      version: '1.0.0',
      description: 'Aggregated API documentation for Library Management microservices'
    }
  },
  apis: files
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

const PORT = process.env.API_DOCS_PORT || 5004;

if (require.main === module) {
  app.listen(PORT, '127.0.0.1', () => console.log(`API docs running on http://127.0.0.1:${PORT}/api-docs`));
}

module.exports = app;
