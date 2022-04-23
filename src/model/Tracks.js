const tracksQuery = require('../database/query/TracksQuery');

class Tracks {
  constructor(track) {
    this.track = track;
  }

  /**
*
* @param {string} user
* @param {string} track
*
* Check if track exists in your profile;
*/
  static async verify(id, track) {
    try {
      const trackExists = await tracksQuery.findTrack(id, track);
      if (trackExists) {
        return Boolean(1);
      }

      return Boolean(0);
    } catch (e) {
      console.log(e.message);
    }
  }
}

module.exports = Tracks;
