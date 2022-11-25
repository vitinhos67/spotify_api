/**
* @param {string} tracks
 To receive track as parameter and ident ony necessarity dates
*/

const func = (tracks) => {
  const data = [];
  tracks.forEach((value) => {
    data.push({
      album: {
        external_urls: value.album.external_urls,
        href: value.album.href,
        id_album: value.album.id,
        images: value.album.images,
        name: value.album.name,
        total_tracks: value.album.total_tracks,
      },
      artists: value.artists,
      external_ids: value.external_ids,
      external_urls: value.external_urls,
      id_track: value.id,
      name: value.name,
      preview_url: value.preview_url,
    });
  });

  return data;
};

module.exports = func;
