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
        console.log(e.message);
      }
    }
  },
};
