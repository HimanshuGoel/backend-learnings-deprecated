import request from 'supertest';

import server from './server';

afterEach(() => {
  server.close();
});

test('should return Base Path', (done) => {
  request(server)
    .get('/')
    .expect(200, { message: 'base path' })
    .end((err) => {
      if (err) {
        return done(err);
      }
      return done();
    });
});

test('should return correct Book as per its id', (done) => {
  request(server)
    .get('/api/books/1')
    .expect(200, { message: 'base path' })
    .end((err) => {
      if (err) {
        return done(err);
      }
      return done();
    });
});
