// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config({
  path: '../../.env',
});
const request = require('request');

const express = require('express');

const app = express();
const cookieParser = require('cookie-parser');
const { generateRandomString } = require('../config/spotify/utils');

const redirect_uri = 'http://localhost:3003/callback';

app.use(cookieParser());
const stateKey = 'spotify_auth_state';
module.exports = {
  async store(req, res) {
    try {
      // eslint-disable-next-line global-require

      const state = generateRandomString(16);

      const scope = 'user-read-private user-read-email';

      const query = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.CLIENT_ID,
        scope,
        redirect_uri,
        state,
      });

      res.cookie(stateKey, stateKey);

      const url = `https://accounts.spotify.com/authorize?${query}`;

      res.redirect(url);
    } catch (e) {
      console.log(e);
    }
  },

  async storeKey(req, res) {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    const queryErrorParam = new URLSearchParams({
      error: 'statemismatch',
    });
    if (state === null && state !== storedState) {
      return res.redirect(`#${queryErrorParam}`);
    }
    res.clearCookie(stateKey);

    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code,
        redirect_uri,
        grant_type: 'client_credentials',
      },
      headers: {
        Authorization: `Basic ${(Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64'))}`,
      },
      json: true,
    };

    request.post(authOptions, (err, response, body) => {
      if (!err && response.statusCode === 200) {
        const { access_token } = body;
        const { refresh_token } = body;
        console.log(body);
        return `${access_token}${refresh_token}`;
      }
    });
  },

};
