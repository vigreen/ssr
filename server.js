//import works only with webpack
import '@babel/polyfill';
import path from 'path';
import fs from 'fs';
import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { StaticRouter } from 'react-router';
import bodyParser from 'body-parser';

import icon from './public/favicon.ico';
import App from './src/App';
import './src/index.css';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join('build')));

function getHashFile(dir, name) {
  let arr = fs.readdirSync(dir);
  return arr.find((filename) => filename.search(name) >= 0);
}

app.get('*', (req, res) => {
  const context = {};

  const content = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );

  const helmet = Helmet.renderStatic();
  const clientBundle = getHashFile(__dirname, 'client_bundle');
  const mainCSS = getHashFile(__dirname, 'main');


  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="shortcut icon" href="${icon}" />
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        <link rel="stylesheet" type="text/css" href="./${mainCSS}">
      </head>
      <body>
        <div id="root">${content}</div>
        <script src="./${clientBundle}"></script>
        <script async src='http://localhost:3001/browser-sync/browser-sync-client.js?v=2.26.3'></script>
      </body>
    </html>
  `;

  res.send(html);
});

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});