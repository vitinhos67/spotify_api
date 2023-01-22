const crypto = require('crypto');

const PlaylistQuery = require('../database/query/PlaylistQuery');
const playlistQuery = require('../database/query/PlaylistQuery');
const { InvalidArgumentError } = require('./errors');

class Playlist {
  constructor({
    name, author, author_id, tracks,
  }) {
    this._id = crypto.randomUUID();
    this._name = name;
    this._author = author;
    this._author_id = author_id;
    this._tracks = !tracks ? [] : tracks;
  }

  async create() {
    try {
      const playlist = await playlistQuery.create({
        _id: this._id,
        name: this._name,
        author: this._author,
        author_id: this._author_id,
        tracks: this._tracks,
      });

      return playlist;
    } catch (e) {
      return e;
    }
  }

  static async getAllPlaylists() {
    try {
      const playlists = await PlaylistQuery.allPlaylist();

      return playlists;
    } catch (error) {
      return error;
    }
  }

  static async addSong(name, author_id, tracks) {
    try {
      const playlist = await playlistQuery.findPlaylist({
        name,
        author_id,
      });

      if (!playlist) {
        throw new InvalidArgumentError('Playlist not find');
      }

      const addTrack = await playlistQuery.addTrack(
        {
          name: playlist.name,
          id: playlist.id,
        },
        tracks,
      );

      return addTrack;
    } catch (e) {
      return e;
    }
  }
}

module.exports = Playlist;
