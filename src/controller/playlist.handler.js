const { endpoint } = require('../../config/constants').spotifyURL;

const spotify = require('../../config/spotify/spotify-connetion');
const ident_track = require('../../utils/ident-track');
const playlistService = require('../service/playlist.service');
const { InvalidArgumentError, InternalServerError } = require('../service/errors');

module.exports = {
  async generateRandomPlaylist(req, res, next) {
    try {
      const { artist, limit } = req.query;

      if (!artist) {
        return res.status(403).json({
          message: 'artist not defined',
        });
      }

      const response = await spotify.request(`${endpoint}/v1/recommendations?seed_artists=${artist}&limit=${limit}`);

      const ident = ident_track(response.tracks);

      res.status(200).json(ident);
    } catch (e) {
      if (e) {
        next(e);
      }
    }
  },

  async storePlaylists(req, res, next) {
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

      const playlist = new playlistService(obj);
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

      const add = await playlistService.addSong(name, author_id, tracks);

      if (add instanceof InvalidArgumentError) {
        throw new InvalidArgumentError('That playlistService not exists');
      }

      res.status(200).json(add);
    } catch (err) {
      if (err instanceof InvalidArgumentError) {
        if (err.message === 'That playlistService not exists') {
          return res.status(404).json({
            error: err.message,
          });
        }

        next(err);
      }
    }
  },

  async getAllPlaylists(req, res, next) {
    try {
      const response = await playlistService.getAllPlaylists();

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
};
