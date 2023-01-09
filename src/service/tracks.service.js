const tracksQuery = require('../database/query/TracksQuery');
const { endpoint } = require('../../config/constants').spotifyURL;
const spotify = require('../../config/spotify/spotify-connetion');

/**
   *
   * @typedef {Object} Track
   * @property {string} track
   *
   * The class responsible for manipulating track data
*/

class Tracks {
  constructor(track) {
    this.track = track;
  }

  static async verify(id, track) {
    try {
      await spotify.request(`${endpoint}/v1/tracks/${track}`);

      const trackExists = await tracksQuery.findTrack(id, track);

      if (trackExists) {
        return Boolean(1);
      }

      return Boolean(0);
    } catch (e) {
      if (e.statusCode >= 400 && e.statusCode <= 499) {
        console.log(e.message);

        throw new Error('ID INVALID OR TRACK INEXIST');
      }

      if (e) {
        throw new Error(e);
      }
    }
  }
}

module.exports = Tracks;
