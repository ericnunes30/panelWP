// Configuração do logger
// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.combine(
//     winston.format.timestamp({
//       format: 'YYYY-MM-DD HH:mm:ss'
//     }),
//     winston.format.errors({ stack: true }),
//     winston.format.splat(),
//     winston.format.json()
//   ),
//   transports: [
//     new winston.transports.Console({
//       format: winston.format.combine(
//         winston.format.colorize(),
//         winston.format.simple()
//       )
//     })
//   ],
//   exitOnError: false
// });

// Função de log centralizada
class Logger {
  static info(message, meta = {}) {
    console.log(`[INFO] ${message}`, meta);
  }

  static error(message, error = null, meta = {}) {
    if (error instanceof Error) {
      console.error(`[ERROR] ${message}`, {
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack,
        ...meta
      });
    } else {
      console.error(`[ERROR] ${message}`, meta);
    }
  }

  static warn(message, meta = {}) {
    console.warn(`[WARN] ${message}`, meta);
  }

  static debug(message, meta = {}) {
    console.debug(`[DEBUG] ${message}`, meta);
  }
}

export default Logger;
