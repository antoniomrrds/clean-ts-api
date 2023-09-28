import 'module-alias/register';
import { MongoHelper } from '@/infrastructure/db/mongodb/helpers';
import { mongoUrl, portServer } from '@/shared/infrastructure/env-config';
MongoHelper.connect(mongoUrl)
  .then(async () => {
    const app = (await import('@/main/config')).app;
    app.listen(portServer, () =>
      console.log(`Server running at http://localhost:${portServer}`),
    );
  })
  .catch(console.error);
