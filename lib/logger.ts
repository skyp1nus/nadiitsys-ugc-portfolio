type LogArgs = readonly unknown[];

function fmt(scope: string, args: LogArgs): LogArgs {
  return [`[${scope}]`, ...args];
}

export const logger = {
  error(scope: string, ...args: LogArgs): void {
    console.error(...fmt(scope, args));
  },
  warn(scope: string, ...args: LogArgs): void {
    console.warn(...fmt(scope, args));
  },
  info(scope: string, ...args: LogArgs): void {
    if (process.env.NODE_ENV !== "production") {
      console.info(...fmt(scope, args));
    }
  },
};
