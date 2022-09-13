const { InvalidArgumentError } = require('../model/errors');
const tracks_liked = require('./schemas/tracks-liked');

module.exports = {

  async addTrackInList({ id_user, track_id }) {
    try {
      const add_track = await tracks_liked.create({
        id_track: track_id,
        id_user,
      });
      return add_track;
    } catch (e) {
      if (e) {
        console.log(e);
        throw new InvalidArgumentError('internal error');
      }
    }
  },

};
