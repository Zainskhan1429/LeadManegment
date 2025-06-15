
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, User, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAuditLogs } from '@/lib/db/auditLogs'; // Updated import path

export function AuditLogsPage() {
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = () => {
    const logs = getAuditLogs();
    setAuditLogs(logs);
  };

  const getActionColor = (action) => {
    if (action.includes('CREATE')) return 'text-green-400';
    if (action.includes('UPDATE')) return 'text-yellow-400';
    if (action.includes('DELETE')) return 'text-red-400';
    return 'text-blue-400';
  };

  const getActionBadge = (action) => {
    if (action.includes('CREATE')) return 'default';
    if (action.includes('UPDATE')) return 'secondary';
    if (action.includes('DELETE')) return 'destructive';
    return 'outline';
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3"
      >
        <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Audit Logs</h1>
          <p className="text-muted-foreground">Track all system activities and changes</p>
        </div>
      </motion.div>

      {auditLogs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center py-12"
        >
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No audit logs yet</h3>
          <p className="text-muted-foreground">
            System activities will appear here as they occur
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {auditLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="glass-card border-slate-700/50 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-2 bg-slate-800 rounded-lg">
                        <Activity className={`h-4 w-4 ${getActionColor(log.actionPerformed)}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant={getActionBadge(log.actionPerformed)}>
                            {log.actionPerformed}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            by {log.performedByName}
                          </span>
                        </div>
                        
                        <p className="text-sm font-medium mb-1">{log.description}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(log.timestamp).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>ID: {log.performedBy}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
