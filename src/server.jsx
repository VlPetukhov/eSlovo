import express  from 'express';
import React    from 'react';
import ReactDom from 'react-dom/server';
import App      from './components/App';
const path = require('path');

const app = express();
const localConfig = require('../config.json');
const assetUrl = localConfig.staticContentUrl;
const inProduction = process.env.NODE_ENV === 'production';

if (!inProduction) {
  // log requests to console
  app.use((req, res, next) => {
    console.log('Request: ', req.url);
    next();
  });
  // in development mode use express as static content server
  app.use(assetUrl, express.static(path.join(__dirname, `../${assetUrl}`)));
}

let urlSelector = !inProduction ? new RegExp(`(?!(${assetUrl})).*`) : '/';

app.use(urlSelector, (req, res) => {
  const componentHTML = ReactDom.renderToString(< App />);
  return res.end(renderHTML(componentHTML));
});


function renderHTML(componentHTML) {
  return `
    <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Hello React</title>
          <link rel="stylesheet" href="${assetUrl}/styles.css">
      </head>
      <body>
        <div id="react-view">${componentHTML}</div>
        <script type="application/javascript" src="${assetUrl}/bundle.js"></script>
      </body>
    </html>
  `;
}

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on: ${PORT}`);
});
