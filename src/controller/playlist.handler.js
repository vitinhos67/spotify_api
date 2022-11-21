const credentials = require('../config/credentials');

const { spotifyURL } = credentials;
const { endpoint } = spotifyURL;
const spotify = require('../config/spotify/spotify-connetion');
const ident_track = require('../../functions/ident-track');
const Playlist = require('../model/Playlist');
const { InvalidArgumentError, InternalServerError } = require('../model/errors');

module.exports = {
  async generateRandom(req, res, next) {
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
        next(e);
      }
    }
  },

  async store(req, res, next) {
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
      next(e);
    }
  },
  async addTrack(req, res, next) {
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

      if (add instanceof InvalidArgumentError) {
        throw new InvalidArgumentError('That playlist not exists');
      }

      res.status(200).json(add);
    } catch (err) {
      if (err instanceof InvalidArgumentError) {
        if (err.message === 'That playlist not exists') {
          return res.status(404).json({
            error: err.message,

          });
        }

        next(err);
      }
    }
  },
};
