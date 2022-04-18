// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config({
  path: '../../.env',
});

const axios = require('axios');
const credentials = require('../config/spotify/credentials');

const { spotifyURL } = credentials;
const { endpoint } = spotifyURL;

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
        url: `https://api.spotify.com/v1/search?q=${track}&type=track,artist&limit=15`,
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
