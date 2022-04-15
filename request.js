const request = require('request'); // "Request" library

const client_id = process.env.CLIENT_ID; // Your client id
const client_secret = process.CLIENT_SECRET; // Your secret

// your application requests authorization
const authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
  },
  form: {
    grant_type: 'client_credentials',
  },
  json: true,
};

request.post(authOptions, (error, response, body) => {
  if (!error && response.statusCode === 200) {
    // use the access token to access the Spotify Web API
    const token = body.access_token;

    const options = {
      url: 'https://api.spotify.com/v1/users/jmperezperez',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      json: true,
    };
    // eslint-disable-next-line no-shadow
    request.get(options, (error, response, body) => {
      console.log(body);
    });
  }
});
