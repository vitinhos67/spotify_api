const axios = require('axios');
const Spotify = require('node-spotify-api');

const jwt = require('../../functions/jwt');
const credentials = require('../config/credentials');

const { spotifyURL, spotifyKeys } = credentials;
const { endpoint } = spotifyURL;

const spotify = new Spotify({
  id: spotifyKeys.client_id,
  secret: spotifyKeys.client_secret,
});

const TracksQuery = require('../database/TracksQuery');
const UserQuery = require('../database/UserQuery');
const { InvalidArgumentError } = require('../model/errors');

module.exports = {

  async findTrack(req, res) {
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

    const response = await spotify.request(`https://api.spotify.com/v1/search?q=${q}&type=track`);

    res.status(200).json({
      data: response,
    });
  },

  async playlistTestCreate(req, res) {
    try {
      const { artist } = req.params;

      if (!artist) {
        return res.status(403).json({
          message: 'artist not defined',
        });
      }

      const { genres } = await spotify.request(`${endpoint}/v1/artists/${artist}`);

      // const search_request = await spotify.request(`${endpoint}/v1/recommendations?${query}`);

      const search_request = await spotify.request(`${endpoint}/v1/search?q=${genres.join(',').replace(/\s/g, '+')}&type=track`);

      res.status(200).json({ search_request });
    } catch (e) {
      if (e) {
        res.status(400).json({ e: e.message });
      }
    }
  },

  async testRoute(req, res) {
    try {
      const { authorization } = req.headers;
      const { id_track } = req.query;
      const [, token] = authorization.split(' ');

      if (!token) {
        throw new InvalidArgumentError('Token not provided');
      }
      const payload = jwt.verify(token);

      const user = await UserQuery.findUserById(payload.id);

      if (!user) {
        throw new InvalidArgumentError('User not find.');
      }
      const find_track = await spotify.request(`${endpoint}/v1/tracks/${id_track}`);

      if (!find_track) {
        throw new InvalidArgumentError('track not find');
      }

      const track = await TracksQuery.addTrackInList({
        id_user: user.id,
        track_id: id_track,
      }, res);

      return res.status(200).json(track);
    } catch (e) {
      if (e.statusCode === 404) {
        return res.status(404).json({
          e: 'track not find',
        });
      }

      return res.status(500).json({
        e: e.message,
      });
    }
  },
};
