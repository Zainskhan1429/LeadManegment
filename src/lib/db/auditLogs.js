export const getAuditLogs = () => {
  return JSON.parse(localStorage.getItem('auditLogs') || '[]');
};

export const logAudit = (action, description, userId = null) => {
  const auditLogs = getAuditLogs();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  const newLog = {
    id: Date.now().toString(),
    actionPerformed: action,
    description,
    performedBy: userId || currentUser.id || 'system',
    performedByName: currentUser.name || 'System',
    timestamp: new Date().toISOString()
  };
  
  auditLogs.unshift(newLog);
  localStorage.setItem('auditLogs', JSON.stringify(auditLogs));
  
  return newLog;
};