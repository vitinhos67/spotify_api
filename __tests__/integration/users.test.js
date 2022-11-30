const request = require('supertest');
const app = require('../../app');
const { deleteUser } = require('../../src/database/query/UserQuery');

describe('Check Routes relational with  the users', () => {
  it('should return 200 for /user and too object', async () => {
    const response = await request(app)
      .get('/user');

    expect(response.statusCode).toBe(200);
  });

  it('should create user e return your value and status 204', async () => {
    const body = {
      username: 'Lady Gaga',
      password: 'pokerface123',
      email: 'momomomo2234@email.com',
    };

    const response = await request(app)
      .post('/user')
      .send(body);

    expect(response.statusCode).toBe(204);
    expect(typeof response.body).toBe('object');

    await deleteUser(body.email);
  });
});
