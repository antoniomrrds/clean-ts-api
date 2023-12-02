import './config/module-alias';
import { mongoUrl, portServer } from '@/main/config/env';
import { MongoHelper } from '@/infrastructure/db';
MongoHelper.connect(mongoUrl)
  .then(async () => {
    const app = (await import('@/main/config')).app;
    app.listen(portServer, () =>
      console.log(`Server running at http://localhost:${portServer}`),
    );
  })
  .catch(console.error);
