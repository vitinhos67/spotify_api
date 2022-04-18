// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config({
  path: '../../.env',
});
const request = require('request');
const axios = require('axios');
const credentials = require('../config/spotify/credentials');

const { spotifyURL } = credentials;
const { endpoint } = spotifyURL;
const { generateRandomString } = require('../config/spotify/utils');

const redirect_uri = 'http://localhost:3003/callback';

const stateKey = 'spotify_auth_state';
module.exports = {

  async home(req, res) {
    try {
      const token = req.cookies.token || null;

      if (!token) {
        return res.redirect('/token');
      }

      const artists = {
        palace: '48vDIufGC8ujPuBiTxY8dm',
        slaquem: '11dFghVXANMlKmJXsNCbNl',
      };

      const response = await axios({
        url: `${endpoint}/v1/artists/${artists.palace}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { data } = response;

      if (data.status === '404') {
        return res.json({
          message: 'Result not found.',
        });
      }

      return res.json({
        response: data,
      });
    } catch (e) {
      return res.status(401).json({
        error: e,
      });
    }
  },
  /// ////////////////

  async storeToken(req, res) {
    try {
      const state = generateRandomString(16);
      const scope = 'user-read-private user-read-email';

      const query = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.CLIENT_ID,
        scope,
        redirect_uri,
        state,
      });

      res.cookie(stateKey, state);

      const url = `https://accounts.spotify.com/authorize?${query}`;

      res.redirect(url);
    } catch (e) {
      console.log(e);
    }
  },

  /// ///////////////////
  async tokenValidate(req, res) {
    try {
      const code = req.query.code || null;
      const state = req.query.state || null;
      const storedState = req.cookies ? req.cookies[stateKey] : null;

      if (state === null && state !== storedState) {
        return res.status(401).json({
          error: 'state',
        });
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
        if (err || response.statusCode !== 200) {
          return res.json({
            e: err,
          });
        }
        const { access_token } = body;
        res.cookie('token', access_token);
        return res.redirect('back');
      });
    } catch (e) {
      console.log(e);
    }
  },

  async search(req, res) {
    try {
      const token = req.cookies.token || null;

      if (!token) {
        return res.redirect('/token');
      }

      const { track } = req.query;

      if (!track) {
        res.status(401).json({
          e: 'Pass a query',
        });
      }

      const response = await axios({
        url: `https://api.spotify.com/v1/search?q=${track}&type=track&limit=10`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.json({
        response: response.data,

      });
    } catch (e) {
      return res.status(401).json({
        e,
      });
    }
  },
};
