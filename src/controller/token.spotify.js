// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config({
  path: '../../.env',
});
const request = require('request');
const { generateRandomString } = require('../../config/spotify/utils');

const redirect_uri = 'http://localhost:3003/callback';

const stateKey = 'spotify_auth_state';
module.exports = {
  async redirectToAuthorizedURI(req, res) {
    try {
      const state = generateRandomString(16);
      const scope = 'user-read-private user-read-email';

      const query = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.CLIENT_ID,
        scope,
        redirect_uri,
        state,
      });

      res.cookie(stateKey, state);

      const url = `https://accounts.spotify.com/authorize?${query}`;
      res.redirect(url);
    } catch (e) {
      console.log(e);
    }
  },
  async tokenStore(req, res) {
    try {
      const code = req.query.code || null;
      const state = req.query.state || null;
      // eslint-disable-next-line security/detect-object-injection
      const storedState = req.cookies ? req.cookies[stateKey] : null;

      if (state === null && state !== storedState) {
        return res.status(401).json({
          error: 'state',
        });
      }
      res.clearCookie(stateKey);

      const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code,
          redirect_uri,
          grant_type: 'client_credentials',
          'content-type': 'application/x-www-form-urlencoded',
        },
        headers: {
          Authorization: `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString(
            'base64'
          )}`,
        },
        json: true,
      };

      request.post(authOptions, async (err, response, body) => {
        if (err || response.statusCode !== 200) {
          return res.json({
            e: err,
          });
        }
        const { access_token } = body;
        res.cookie('token', access_token);

        return res.redirect('back');
      });
    } catch (e) {
      console.log(e);
    }
  },
};
