const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../../logs/audit.log');

const auditLog = (action, user, details) => {
  const entry = {
    timestamp: new Date().toISOString(),
    action,
    user: user?.email || 'sistema',
    userId: user?.id || 'system',
    details,
  };
  const logLine = JSON.stringify(entry) + '\n';
  // Em produção, enviar para um sistema de logs, mas por enquanto escrevemos no arquivo
  try {
    fs.appendFileSync(logFile, logLine);
  } catch (err) {
    console.error('Erro ao escrever log de auditoria:', err);
  }
};

module.exports = { auditLog };