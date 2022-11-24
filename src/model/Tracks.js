const tracksQuery = require('../database/query/TracksQuery');
const { spotifyURL } = require('../../config/credentials');
const spotify = require('../../config/spotify/spotify-connetion');

const { endpoint } = spotifyURL;

class Tracks {
  constructor(track) {
    this.track = track;
  }

  /**
*
* @param {string} user
* @param {string} track
*
* Check if track exists in your profile and spotify;
*/
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
