const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function(...args) {
    const responseTime = Date.now() - start;
    logger.http(req, res, responseTime);
    originalEnd.apply(this, args);
  };

  next();
};

module.exports = requestLogger;
