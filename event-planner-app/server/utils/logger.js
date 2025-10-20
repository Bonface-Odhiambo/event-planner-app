const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const getTimestamp = () => {
  return new Date().toISOString();
};

const formatLogMessage = (level, message, meta = {}) => {
  return JSON.stringify({
    timestamp: getTimestamp(),
    level,
    message,
    ...meta
  }) + '\n';
};

const writeToFile = (filename, content) => {
  const filePath = path.join(logsDir, filename);
  fs.appendFileSync(filePath, content);
};

const logger = {
  info: (message, meta = {}) => {
    const logMessage = formatLogMessage('INFO', message, meta);
    console.log(`[INFO] ${message}`, meta);
    writeToFile('app.log', logMessage);
  },

  error: (message, meta = {}) => {
    const logMessage = formatLogMessage('ERROR', message, meta);
    console.error(`[ERROR] ${message}`, meta);
    writeToFile('error.log', logMessage);
    writeToFile('app.log', logMessage);
  },

  warn: (message, meta = {}) => {
    const logMessage = formatLogMessage('WARN', message, meta);
    console.warn(`[WARN] ${message}`, meta);
    writeToFile('app.log', logMessage);
  },

  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV === 'development') {
      const logMessage = formatLogMessage('DEBUG', message, meta);
      console.log(`[DEBUG] ${message}`, meta);
      writeToFile('debug.log', logMessage);
    }
  },

  http: (req, res, responseTime) => {
    const logData = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    };
    
    const message = `${req.method} ${req.url} ${res.statusCode} - ${responseTime}ms`;
    const logMessage = formatLogMessage('HTTP', message, logData);
    
    console.log(`[HTTP] ${message}`);
    writeToFile('access.log', logMessage);
  }
};

module.exports = logger;
