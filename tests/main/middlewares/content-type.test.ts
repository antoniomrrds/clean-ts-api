import request from 'supertest';
import { setupExpress } from '@/main/config';
import { Express } from 'express';

describe('Content Type Middleware', () => {
  let app: Express;
  beforeAll(async () => {
    app = await setupExpress();
  });
  it('Should return default content type as json', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send();
    });
    await request(app).get('/test_content_type').expect('content-type', /json/);
  });

  it('Should return xml content type when forced', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml');
      res.send();
    });
    await request(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/);
  });
});
