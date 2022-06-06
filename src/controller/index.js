// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config({
  path: '../../.env',
});

const axios = require('axios');

const Spotify = require('node-spotify-api');
const credentials = require('../config/credentials');

const { spotifyURL, spotifyKeys } = credentials;
const { endpoint } = spotifyURL;

const spotify = new Spotify({
  id: spotifyKeys.client_id,
  secret: spotifyKeys.client_secret,
});

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
          return res.status(400).json({
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
          message: 'u not found.',
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

  async createPlaylist(req, res) {
    const { q } = req.query;

    if (!q) {
      return res.status(401).json({
        data: 'not_query',
      });
    }

    spotify.request(`https://api.spotify.com/v1/search?q=${q}&type=album,artist`)
      .then((data) => {
        const results = [];

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < data.albums.items.length; i++) {
          results.push(data.albums.items[i].artists);
        }

        return res.json({
          data: results,
        });
      })
      .catch((err) => {
        console.error(`Error occurred: ${err}`);
      });
  },

};
