export interface Logger {
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
  debug: (message: string) => void;
}

const formatMessage = (level: string, message: string): string => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
};

export const logger: Logger = {
  info: (message: string): void => {
    console.log(formatMessage("info", message));
  },
  warn: (message: string): void => {
    console.warn(formatMessage("warn", message));
  },
  error: (message: string): void => {
    console.error(formatMessage("error", message));
  },
  debug: (message: string): void => {
    console.debug(formatMessage("debug", message));
  },
};
