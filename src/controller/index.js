// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config;

module.exports = {

  // eslint-disable-next-line consistent-return
  // async store(req, res) {
  //   try {
  //     const { authorization } = req.headers;

  //     if (!authorization) {
  //       return res.status(401).json({
  //         error: ['not authorized to proceed.'],
  //       });
  //     }

  //     const endpoint = 'https://api.spotify.com';
  //     const settings = {
  //       method: 'GET',
  //       headers: { Authorization: `Bearer ${authorization}` },
  //     };
  //     const trackId = '0TnOYISbd1XYRBk9myaseg';

  //     const response = await axios(`${endpoint}/v1/artists/${trackId}`, settings);
  //     const { data } = response;

  //     return res.json({ response: data });
  //   } catch (e) {
  //     if (e.response.statusText === 'Unauthorized') {
  //       return res.status(401).json({
  //         error: 'token not authorized to proceed.',
  //       });
  //     }
  //   }
  // },
  async store(req, res) {
    return res.json({
      response: req.response,
    });
  },

  async show(req, res) {
    res.send('ok');
  },

};
