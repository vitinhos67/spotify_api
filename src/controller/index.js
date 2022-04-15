// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config;
const axios = require('axios').default;

module.exports = {

  // eslint-disable-next-line consistent-return
  async store(req, res) {
    try {
      const endpoint = 'https://api.spotify.com';
      const { authorization } = req.headers;

      if (!authorization) {
        return res.status(401).json({
          error: ['not authorized to proceed.'],
        });
      }

      const settings = {
        method: 'GET',
        headers: { Authorization: `Bearer ${process.env.auth}` },
      };

      const response = await axios(`${endpoint}/v1/users/xks2p753t9nitigxdrui10y8i`, settings);
      const { data } = response;

      return res.json({ response: data });
    } catch (e) {
      return res.status(401).json({
        error: e,
      });
    }
  },

  async show(req, res) {
    res.send('ok');
  },

};
