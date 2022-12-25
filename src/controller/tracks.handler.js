const credentials = require('../../config/credentials');

const { spotifyURL } = credentials;
const { endpoint } = spotifyURL;
const ident_track = require('../../functions/ident-track');
const spotify = require('../../config/spotify/spotify-connetion');
const TracksQuery = require('../database/query/TracksQuery');
const Tracks = require('../service/tracks.service');

const { InvalidArgumentError, ValueAlreadyExists } = require('../service/errors');

module.exports = {
  async findTrack(req, res, next) {
    try {
      const { searchTrack } = req.body;
      const { q } = req.query;

      if (!searchTrack && searchTrack == null) {
        if (!q) {
          throw new InvalidArgumentError('no_query');
        }
      }
      const response = await spotify.request(`${endpoint}/v1/search?q=${q}&type=track&limit=10`);

      const ident = ident_track(response.tracks.items);
      return res.json(ident);
    } catch (e) {
      next(e);
    }
  },
  async addSongsInTracksLiked(req, res, next) {
    try {
      const { user } = req;

      const { track_id } = req.query;

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
      next(e);
    }
  },

  async removeTrack(req, res, next) {
    try {
      const { user } = req;
      const { track_id } = req.query;

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
      next(e);
    }
  },
};
