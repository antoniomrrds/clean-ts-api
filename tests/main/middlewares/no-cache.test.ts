import { setupExpress } from '@/main/config';
import { noCahe } from '@/main/middlewares';
import { Express } from 'express';
import request from 'supertest';

describe('No Cache Middleware', () => {
  let app: Express;
  beforeAll(async () => {
    app = await setupExpress();
  });
  test('Should disable cache', async () => {
    app.get('/test_no_cache', noCahe, (req, res) => {
      res.send();
    });
    await request(app)
      .get('/test_no_cache')
      .expect(
        'cache-control',
        'no-store, no-cache, must-revalidate, proxy-revalidate',
      )
      .expect('pragma', 'no-cache')
      .expect('expires', '0')
      .expect('surrogate-control', 'no-store');
  });
});
