const axios = require('axios').default;
const fs = require('fs');
const express = require('express');

const app = express();
const session = require('express-session');
const credentials = require('../config/spotify/credentials');

const { configs } = credentials;

app.use(express.json());
app.use(session({
  secret: configs.sess,
  saveUninitialized: true,
  cookie: { maxAge: 60000 },
  resave: false,
}));
// eslint-disable-next-line no-unused-vars
const auth = async (req, res, next) => {
  try {
    const { spotifyKeys } = credentials;
    const { client_id } = spotifyKeys;
    const redirect_uri = 'http://localhost:8888/callback';
    // eslint-disable-next-line global-require
    const { generateRandomString } = require('../config/spotify/utils');

    const state = generateRandomString(16);
    const scope = 'user-read-private user-read-email';

    const query = new URLSearchParams({
      response_type: 'code',
      client_id,
      scope,
      redirect_uri,
      state,
    });

    const url = `https://accounts.spotify.com/authorize?${query}`;

    const response = await axios.get(url);
    const { data } = response;

    fs.writeFile('index.html', data, (err) => {
      if (err) {
        console.log(err);
      }
      console.log('Arquivo Criado');
    });

    req.spotify_auth_state = state;
  } catch (e) {
    console.log(e);
  }
  next();
};
module.exports = {
  auth,
};
