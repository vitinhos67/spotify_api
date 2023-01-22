const request = require('supertest');
const app = require('../../../app');
const { deleteUsersAfterTest } = require('../../../src/database/query/UserQuery');
const User = require('../../../src/service/user.service');

describe('Check Routes relational with  the users', () => {
  afterAll(async () => {
    await deleteUsersAfterTest();
  });

  it('should return 200  for /user', async () => {
    const result = await request(app)
      .get('/user');

    expect(result.statusCode).toBe(200);
  });

  it('should return 201 fot route /user method POST', async () => {
    const body = {
      username: 'Lady Gaga',
      password: 'pokerface123',
      email: 'momomo2234@email.com',
    };

    const result = await request(app)
      .post('/user')
      .send(body);
    expect(result.statusCode).toBe(201);
    expect(typeof result.body).toBe('object');
  });

  it('should update email of users with statusCode 202', async () => {
    const userModel = new User('mr_bean', 'salsicha124@email.com', 'mrbean1223');
    const user = await userModel.create();
    const email = 'scooby@email.com';

    const result = await request(app)
      .put('/user/update/email')
      .set('Authorization', `Bearer ${user.access_token}`)
      .set('reflesh_token', user.reflesh_token)
      .send({ email });
    expect(result.statusCode).toBe(202);
  });

  it('should update password of users with statusCode 202', async () => {
    const password = 'fred1223';
    const new_password = 'fred123';
    const confirm_password = new_password;

    const userModel = new User('mr_bean', 'salsicha32@email.com', password);
    const user = await userModel.create();

    const result = await request(app)
      .put('/user/update/password')
      .set('Authorization', `Bearer ${user.access_token}`)
      .set('reflesh_token', user.reflesh_token)
      .send({
        password, new_password, confirm_password,
      });
    expect(result.statusCode).toBe(202);
  });

  it('should update username of users with statusCode 202', async () => {
    const userModel = new User('mr_bean', 'salsicha12@email.com', 'mrbean1223');
    const user = await userModel.create();

    const result = await request(app)
      .put('/user/update/username')
      .set('Authorization', `Bearer ${user.access_token}`)
      .set('reflesh_token', user.reflesh_token)
      .send({ username: 'fatinha' });
    expect(result.statusCode).toBe(202);
  });
});
