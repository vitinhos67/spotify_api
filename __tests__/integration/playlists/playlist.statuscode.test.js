const request = require('supertest');
const app = require('../../../app');
const { clearPlaylistsAfterTest } = require('../../../src/database/query/PlaylistQuery');

describe('Check routes relational with playlist', () => {
  beforeEach(async () => {
    await clearPlaylistsAfterTest();
  });

  it('Should create a playlist with status 200', async () => {
    const user = await request(app)
      .post('/user')
      .send({
        email: 'admin@email.com',
        password: 'admin',
        username: 'admin',
      });

    const result = await request(app)
      .post('/playlist')
      .set('Authorization', `Bearer ${user.body.access_token}`)
      .set('reflesh_token', user.body.reflesh_token)
      .send({
        name: 'Lady gaga so as melhores 2000',
      });
    expect(result.statusCode).toBe(200);
  });

  it('Should return all playlist with status 200', async () => {
    const response = await request(app)
      .get('/playlist');

    expect(response.statusCode).toBe(200);
  });
});
