const User = require('../schemas/User');

// $in - Search for items that have
// $nin - Search for items that dont have

module.exports = {

  async addTrackInList({ id, track_id }) {
    try {
      const add_track = await User.updateOne(
        { id },
        { $push: { tracks_liked: track_id } },
      );

      return add_track;
    } catch (e) {
      console.log(e);
    }
  },
  async removeTrackInList({ id, track_id }) {
    try {
      const remove_track = await User.updateOne(
        { id },
        { $pull: { tracks_liked: track_id } },
      );
      if (!remove_track) {
        return Boolean(0);
      }

      return Boolean(1);
    } catch (e) {
      console.log(e.message);
    }
  },

  async findTrack(id, track_id) {
    try {
      const track = await User.findOne({ id, tracks_liked: { $in: [track_id] } });
      console.log(track);
      return track;
    } catch (e) {
      console.log(e.message);
    }
  },

};
