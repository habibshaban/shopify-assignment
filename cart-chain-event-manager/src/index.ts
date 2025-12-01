import { greet } from "./modules/greeter.js";
import { logger } from "./utils/logger.js";
import { config } from "./config/index.js";

function main(): void {
  logger.info(`Application starting in ${config.environment} mode`);

  const message = greet(config.appName);
  logger.info(message);

  logger.info("Application initialized successfully");
}

main();
