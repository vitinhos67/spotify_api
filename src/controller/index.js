// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config({
  path: '../../.env',
});

const axios = require('axios');

const credentials = require('../config/credentials');

const { spotifyURL } = credentials;
const { endpoint } = spotifyURL;

module.exports = {

  async findTrackOrArtist(req, res) {
    try {
      const token = req.cookies.token || null;

      if (!token) {
        return res.redirect('/token');
      }

      const { searchTrack } = req.body;
      const { q } = req.query;

      if (!searchTrack && searchTrack == null) {
        if (!q) {
          return res.status(401).json({
            error: {
              message: 'no_query',
            },
          });
        }
      }

      const response = await axios({
        method: 'GET',
        url: `${endpoint}/v1/search?q=${q}&type=track&limit=1`,
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
        response: data.tracks,

      });
    } catch (e) {
      return res.status(401).json({
        error: e,
      });
    }
  },

};
