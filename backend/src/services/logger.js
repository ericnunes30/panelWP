class Logger {
  static info(message, meta = {}) {
    console.log(`[INFO] ${message}`, meta);
  }

  static error(message, meta = {}) {
    console.error(`[ERROR] ${message}`, meta);
  }

  static debug(message, meta = {}) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${message}`, meta);
    }
  }

  static warn(message, meta = {}) {
    console.warn(`[WARN] ${message}`, meta);
  }
}

module.exports = Logger;
