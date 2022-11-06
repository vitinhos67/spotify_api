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

};

/* const response = await spotify.request(`${endpoint}/v1/tracks/${id_track}`);

      const ident = ident_track(response.tracks);

      console.log(ident);
      if (!response) {
        throw new InvalidArgumentError('Invalid id_track');
      }

      const obj = {
        name,
        author: user.username,
        author_id: user.id,
        tracks: {
          name: ident.name,
          artists: ident.artists,
          id_track: ident.id_track,
          preview_url: ident.preview_url,
          external_urls: ident.external_urls,
        },
      }; */
