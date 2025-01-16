const app = require("./app");
const logger = require("./utils/logger");
const { PORT } = require("./utils/config");
app.listen(PORT, () => {
  logger.info(`The application is running on ${PORT}`);
});
