/**
 * React Starter Kit for Firebase
 * https://github.com/kriasoft/react-firebase-starter
 * Copyright (c) 2015-present Kriasoft | MIT License
 */

const fs = require('fs');
const dotenv = require('dotenv');
const express = require('express');
const firebase = require('firebase-admin');
const functions = require('firebase-functions');

if (process.env.NODE_ENV === 'production') {
  process.env.APP_VERSION = fs.readFileSync('./VERSION', 'utf8').trim();

  // Load API keys, secrets etc. from Firebase environment
  // https://firebase.google.com/docs/functions/config-env
  const { app: config } = functions.config();
  Object.keys(config).forEach(key => {
    process.env[key.toUpperCase()] =
      typeof config[key] === 'object'
        ? JSON.stringify(config[key])
        : config[key];
  });
}

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

// Configure Firebase Admin SDK
// https://firebase.google.com/docs/admin/setup
if (!firebase.apps.length) {
  firebase.initializeApp({
    credential: firebase.credential.cert(
      JSON.parse(process.env.GCP_SERVICE_KEY),
    ),
  });
}

// USE firebase cloud functions 
if (process.env.NODE_ENV === 'production') {
  // Server environment
    // this is where we define function called 'app' via exports.app = functions()
    // define it as the app.js file we have which is a Router object from express;
  exports.app = functions
    .runWith({ memory: '2GB' })
    .https.onRequest(require('./app').default);
} else {
  // Local/dev environment
// IF DEV ENVIRONMENT - USE NODE
  const app = express();
  const db = require('./db').default;
  app.use(require('./app').default);
  module.exports.default = app;
  module.exports.dispose = () => db.destroy();
}
