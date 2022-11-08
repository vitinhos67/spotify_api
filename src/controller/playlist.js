const credentials = require('../config/credentials');

const { spotifyURL } = credentials;
const { endpoint } = spotifyURL;
const spotify = require('../../functions/spotify-connetion');
const ident_track = require('../../functions/ident-track');
const Playlist = require('../model/Playlist');
const { InvalidArgumentError, InternalServerError } = require('../model/errors');

module.exports = {
  async generateRandom(req, res) {
    try {
      const { artist } = req.query;

      if (!artist) {
        return res.status(403).json({
          message: 'artist not defined',
        });
      }

      const response = await spotify.request(`${endpoint}/v1/recommendations?seed_artists=${artist}&limit=1`);

      const ident = ident_track(response.tracks);

      res.status(200).json(ident);
    } catch (e) {
      if (e) {
        res.status(400).json({ e: e.message });
      }
    }
  },

  async store(req, res) {
    try {
      const { user } = req;
      const { name } = req.body;

      if (!user) {
        throw new InternalServerError('Not Authorized');
      }

      const obj = {
        name,
        author: user.username,
        author_id: user.id,

      };

      const playlist = new Playlist(obj);
      const create_playlist = await playlist.create();

      res.status(200).json(create_playlist);
    } catch (e) {
      if (e instanceof InternalServerError) {
        return res.status(401).json({
          e,
          error_message: e.message,
          statusCode: 401,
        });
      }

      if (e instanceof InvalidArgumentError) {
        return res.status(401).json({
          e,
          error_message: e.message,
          statusCode: 401,

        });
      }
    }
  },
  async addTrack(req, res) {
    try {
      const { user } = req;
      const { track_id, name } = req.body;
      if (!track_id || !name) {
        throw new InvalidArgumentError('body not valid');
      }

      const response = await spotify.request(`${endpoint}/v1/tracks/${track_id}`);
      const ident = ident_track([response]);

      const author_id = user.id;
      const tracks = {
        id: ident[0].id_track,
        name: ident[0].name,
        artists: ident[0].artists[0].name,
        preview_url: ident[0].preview_url,
      };

      const add = await Playlist.addSong(name, author_id, tracks);

      res.status(200).json(add);
    } catch (error) {
      if (error.statusCode === 400 || error.statusCode === 404) {
        return res.status(401).json({
          error: error.message,
          statusCode: error.statusCode,
        });
      }

      if (error instanceof InvalidArgumentError) {
        return res.status(401).json({
          error: error.message,
          body: ['name', 'track_id'],
        });
      }

      if (error) {
        console.log(error);

        return res.status(500).json({
          error,
          error_message: error.message,
        });
      }
    }
  },
};
