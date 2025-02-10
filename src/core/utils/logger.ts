import { createLogger, format, transports } from "winston";

const { combine, timestamp, json } = format;

const logger = createLogger({
  level: "info",
  format: combine(timestamp(), json()),
  defaultMeta: { service: "video-consumer" },
  transports: [new transports.Console()],
});

export { logger };
