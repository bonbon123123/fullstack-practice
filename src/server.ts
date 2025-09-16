import express from "express";
import cors from "cors";
import { buildRouter } from "app/api/controllers/router";
import { buildAppServices } from "app/app-services";
import logger from "app/utils/logger";
import 'dotenv/config';

async function main() {
  const httpPort = 8082;
  const appServices = await buildAppServices();
  const router = await buildRouter(appServices);

  const app = express();

  app.use(cors());

  app.use(router);

  app.listen(httpPort, () => {
    logger.info(
      `Server is running at http://localhost:${httpPort} in ${appServices.appConfig.environment} mode`
    );
  });
}

main()
  .then(() => logger.info("Server running"))
  .catch(err => {
    logger.error("Server failed", err);
    process.exit(1);
  });
