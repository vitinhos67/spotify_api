const request = require('supertest');
const app = require('../../app');
const { deleteUser, deleteUserByEmail } = require('../../src/database/query/UserQuery');
const User = require('../../src/model/User');
const jwt = require('../../functions/jwt');

describe('Check Routes relational with  the users', () => {
  it('should return 200 for /user and too object', async () => {
    const result = await request(app)
      .get('/user');

    expect(result.statusCode).toBe(200);
  });

  it('should create user e return your value and status 204', async () => {
    const body = {
      username: 'Lady Gaga',
      password: 'pokerface123',
      email: 'momomomo2234@email.com',
    };

    const result = await request(app)
      .post('/user')
      .send(body);

    expect(result.statusCode).toBe(204);
    expect(typeof result.body).toBe('object');

    await deleteUserByEmail(body.email);
  });

  it('should update email of users with statusCode 202', async () => {
    const userModel = new User('mr_bean', 'salsicha@email.com', 'mrbean1223');
    const user = await userModel.create();

    const access_token = jwt.sign_access_token({ id: user.id });
    const reflesh_token = jwt.sign_reflesh_token({ id: user.id });
    const email = 'scooby@email.com';

    const result = await request(app)
      .post('/user/update/email')
      .set('Authorization', `Bearer ${access_token}`)
      .send({ email, reflesh_token });
    await deleteUser(user.id);
    expect(result.statusCode).toBe(202);
  });

  it('should update password of users with statusCode 202', async () => {
    const password = 'fred1223';
    const new_password = 'fred123';
    const confirm_password = new_password;

    const userModel = new User('mr_bean', 'salsicha@email.com', password);
    const user = await userModel.create();

    const access_token = jwt.sign_access_token({ id: user.id });
    const reflesh_token = jwt.sign_reflesh_token({ id: user.id });

    const result = await request(app)
      .post('/user/update/password')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        password, new_password, confirm_password, reflesh_token,
      });
    await deleteUser(user.id);
    expect(result.statusCode).toBe(202);
  });

  it('should update username of users with statusCode 202', async () => {
    const userModel = new User('mr_bean', 'salsicha@email.com', 'mrbean1223');
    const user = await userModel.create();

    const access_token = jwt.sign_access_token({ id: user.id });
    const reflesh_token = jwt.sign_reflesh_token({ id: user.id });

    const result = await request(app)
      .post('/user/update/username')
      .set('Authorization', `Bearer ${access_token}`)
      .send({ username: 'fatinha', reflesh_token });
    await deleteUser(user.id);
    expect(result.statusCode).toBe(202);
  });
});
