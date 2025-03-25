const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  level: "verbose",
  format: format.combine(format.timestamp(), format.json()),
  transports: [new transports.File({ filename: "log/info.log" })],
});

module.exports = logger;
