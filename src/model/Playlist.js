const playlistQuery = require('../database/query/PlaylistQuery');

class Playlist {
  constructor({
    name, author, author_id, tracks,
  }) {
    this._name = name;
    this._author = author;
    this._author_id = author_id;
    this._tracks = !tracks ? [] : tracks;
  }

  async create() {
    try {
      const playlist = await playlistQuery.create({
        name: this._name,
        author: this._author,
        author_id: this._author_id,
        tracks: this._tracks,
      });

      return playlist;
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Playlist;
