const logger = require("./utils/logger");
const config = require("./utils/config");
const app = require("./app");
app.listen(config.PORT, () => {
  logger.info(`The server is running on the port ${config.PORT}`);
});
