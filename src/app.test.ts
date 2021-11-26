import request from 'supertest';

import server from './server';

test('should return Base Path', (done) => {
  request(server)
    .get('/')
    .expect(200, { message: 'base path' })
    .end((err) => {
      if (err) {
        return done(err);
      }
      done();
    });
});
