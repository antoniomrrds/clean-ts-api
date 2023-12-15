import request from 'supertest';
import { setupExpress } from '@/main/config';
import { Express } from 'express';

describe('Cors Middleware', () => {
  let app: Express;
  beforeAll(async () => {
    app = await setupExpress();
  });
  it('Should enable cors', async () => {
    app.get('/test_cors', (req, res) => {
      res.send();
    });
    await request(app)
      .get('/test_cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*');
  });
});
