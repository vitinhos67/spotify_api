const credentials = require('../config/credentials');

const { spotifyURL } = credentials;
const { endpoint } = spotifyURL;
const ident_track = require('../../functions/ident-track');

const spotify = require('../../functions/spotify-connetion');
const TracksQuery = require('../database/query/TracksQuery');
const Tracks = require('../model/Tracks');

const {
  InvalidArgumentError,
  ValueAlreadyExists,
  InternalServerError,
  ValueNotFound,
} = require('../model/errors');

module.exports = {

  async findTrack(req, res) {
    try {
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

      const response = await spotify.request(`${endpoint}/v1/search?q=${q}&type=track&limit=10`);

      return res.json({
        response,

      });
    } catch (e) {
      return res.status(401).json({
        error: e.message,
      });
    }
  },

  async playlistCreate(req, res) {
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

  async addSongsInTracksLiked(req, res) {
    try {
      const { user, track_id } = req;

      const verify = await Tracks.verify(user.id, track_id);

      if (verify) {
        throw new ValueAlreadyExists('Track already added');
      }

      const track = await TracksQuery.addTrackInList({
        id: user.id,
        track_id,
      });

      if (!track) {
        throw new InvalidArgumentError('Track dont add');
      }

      return res.status(200).json(track);
    } catch (e) {
      const objError = {
        e,
        error_message: e.message,
      };

      if (e instanceof InternalServerError) {
        return res.status(400).json(objError);
      }

      if (e instanceof InvalidArgumentError) {
        return res.status(403).json(objError);
      }

      if (e instanceof ValueAlreadyExists) {
        return res.status(401).json({
          message: e.message,
        });
      }
      if (e instanceof ValueNotFound) {
        return res.status(404).json({
          message: e.message,
        });
      }
      if (e) {
        return res.status(500).json(objError);
      }
    }
  },

  async removeTrack(req, res) {
    try {
      const { user, track_id } = req;

      const find_track = await spotify.request(`${endpoint}/v1/tracks/${track_id}`);

      if (!find_track) {
        throw new InvalidArgumentError('track not find');
      }

      const removedTrack = await TracksQuery.removeTrackInList({
        id: user.id,
        track_id,
      });

      if (!removedTrack) {
        throw new InvalidArgumentError("Track don't removed");
      }

      res.status(201).json({
        message: 'track removed successfully',
      });
    } catch (e) {
      if (e instanceof InvalidArgumentError) {
        return res.status(403).json({
          error_message: e.message,
          e,
        });
      }
    }
  },
};
