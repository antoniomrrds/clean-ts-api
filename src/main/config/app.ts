import express from 'express';
import setupMiddlewares from '@/main/config/middlewares';
import setupSwagger from '@/main/config/config-swagger';
import setupRoutes from '@/main/config/routes';
const app = express();
setupSwagger(app);
setupMiddlewares(app);
setupRoutes(app);
export { app };
