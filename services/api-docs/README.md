# API Docs (Swagger UI)

This small service aggregates JSDoc-style Swagger comments across the `services/` folder and exposes a single `/api-docs` endpoint serving Swagger UI.

Usage

1. From the `services/api-docs` folder install dependencies:

```bash
cd services/api-docs
npm install
```

2. Start the docs server:

```bash
npm start
# or set a custom port
API_DOCS_PORT=5010 npm start
```

3. Open http://127.0.0.1:5004/api-docs in your browser (or the custom port you set).

Notes
- The service scans `services/**/*.js` for JSDoc Swagger comments. Ensure your endpoints include comments in the supported Swagger JSDoc format.
- swagger-jsdoc resolves globs relative to the process.cwd() of the Node process. If you run this server from a different cwd, update the `apis` glob in `index.js` accordingly.
