import request from 'supertest';
import server from './server';

test('should return Hello World!', (done) => {
  request(server)
    .get('/')
    .expect(200, 'Hello World!')
    .end((err) => {
      if (err) {
        return done(err);
      }
      done();
    });
});
