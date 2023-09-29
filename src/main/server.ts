import './config/module-alias';
import { mongoUrl, portServer } from '@/shared/infrastructure/env-config';
import { MongoHelper } from '@/infrastructure/db/mongodb/helpers';

console.log('mongo ' + MongoHelper);
MongoHelper.connect(mongoUrl)
  .then(async () => {
    const app = (await import('@/main/config')).app;
    app.listen(portServer, () =>
      console.log(`Server running at http://localhost:${portServer}`),
    );
  })
  .catch(console.error);
