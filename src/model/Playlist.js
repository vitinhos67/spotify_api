const playlistQuery = require('../database/query/PlaylistQuery');
const { InvalidArgumentError } = require('./errors');

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

  // eslint-disable-next-line class-methods-use-this
  static async addSong(name, author_id, tracks) {
    try {
      const playlist = await playlistQuery.findPlaylist({
        name,
        author_id,
      });

      if (!playlist) {
        throw new InvalidArgumentError('Playlist nao encontrada');
      }

      const addTrack = await playlistQuery.addTrack({
        name: playlist.name,
        id: playlist.id,
      }, tracks);

      return addTrack;
    } catch (e) {
      return e;
    }
  }
}

module.exports = Playlist;
