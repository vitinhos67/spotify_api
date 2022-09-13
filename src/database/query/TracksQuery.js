const { InvalidArgumentError } = require('../../model/errors');

const User = require('../schemas/User');

module.exports = {

  async addTrackInList({ id, track_id }) {
    try {
      const add_track = await User.updateOne(
        { id },
        { $push: { tracks_liked: track_id } },
      );
      return add_track;
    } catch (e) {
      if (e) {
        console.log(e);
        throw new InvalidArgumentError('internal error');
      }
    }
  },
  async removeTrackInList({ id, track_id }) {
    try {
      const remove_track = await User.updateOne(
        { id },
        { $pull: { tracks_liked: track_id } },
      );
      if (!remove_track) {
        throw new InvalidArgumentError('track not find');
      }

      return remove_track;
    } catch (e) {
      if (e instanceof InvalidArgumentError) {
        console.log(e);
      }
    }
  },

};
