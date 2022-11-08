const Playlist = require('../schemas/Playlist');

module.exports = {
  async create({
    name, author, author_id, tracks,
  }) {
    console.log(name, author, author_id, tracks);
    try {
      const playlist = await Playlist.create({
        name,
        author,
        author_id,
        tracks,
      });

      return playlist;
    } catch (e) {
      if (e) {
        return e;
      }
    }
  },

  async findPlaylist({ author_id, name }) {
    try {
      const playlist = await Playlist.findOne({
        author_id,
        name,
      });

      if (!playlist) {
        return Boolean(0);
      }

      return playlist;
    } catch (e) {
      if (e) {
        return e;
      }
    }
  },
  async addTrack({ name, id }, tracks) {
    try {
      const add = await Playlist.updateOne(
        {
          name,
          id,
        },
        { $push: { tracks } },
      );

      return add;
    } catch (e) {
      if (e) {
        return e;
      }
    }
  },

};
