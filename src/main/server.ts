import './config/module-alias';
import { mongoUrl, portServer } from '@/main/config/env';
import { MongoHelper } from '@/infrastructure/db';
MongoHelper.connect(mongoUrl)
  .then(async () => {
    const { setupApp } = await import('@/main/config/app');
    const { httpServer } = await setupApp();
    httpServer.listen(portServer, () => {
      console.log(`🚀Server running at http://localhost:${portServer}`);
      console.log(`🚀Server running at http://localhost:${portServer}/graphql`);
    });
  })
  .catch(console.error);
