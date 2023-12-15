import request from 'supertest';
import { setupExpress } from '@/main/config';
import { Express } from 'express';

describe('Body Parser Middleware', () => {
  let app: Express;
  beforeAll(async () => {
    app = await setupExpress();
  });
  it('Should parse body as json', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body);
    });
    await request(app)
      .post('/test_body_parser')
      .send({ name: 'any_name' })
      .expect({ name: 'any_name' });
  });
});
