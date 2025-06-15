
import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageSquare, 
  FileText as AuditIcon,
  FileText as ResumeIcon, 
  Brain,
  Zap,
  DollarSign,
  Settings,
  ChevronRight,
  Users2,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { hasPermission, AUTH_ROLES } from '@/lib/auth';

export function Sidebar({ user, currentPage, onPageChange }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, requiredRole: AUTH_ROLES.SALES_AGENT },
    { id: 'leads', label: 'Leads', icon: Users, requiredRole: AUTH_ROLES.SALES_AGENT },
    { id: 'appointments', label: 'Appointments', icon: Calendar, requiredRole: AUTH_ROLES.SALES_AGENT },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, requiredRole: AUTH_ROLES.SALES_AGENT },
    { id: 'resumes', label: 'Resumes', icon: ResumeIcon, requiredRole: AUTH_ROLES.HR },
    { id: 'automation', label: 'Automation', icon: Zap, requiredRole: AUTH_ROLES.TEAM_MANAGER },
    { id: 'billing', label: 'Billing', icon: DollarSign, requiredRole: AUTH_ROLES.ADMIN },
    { id: 'settings', label: 'Settings', icon: Settings, requiredRole: AUTH_ROLES.ADMIN },
    { id: 'audit', label: 'Audit Logs', icon: AuditIcon, requiredRole: AUTH_ROLES.ADMIN },
  ];

  const visibleItems = menuItems.filter(item => 
    hasPermission(user.role, item.requiredRole)
  );

  const containerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { staggerChildren: 0.07, delayChildren: 0.2, type: "spring", stiffness: 120 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.aside
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-64 glass-card border-r border-slate-700/50 min-h-[calc(100vh-80px)] flex flex-col justify-between" // Adjusted height
    >
      <div className="p-4">
        <motion.div className="space-y-1.5" variants={containerVariants}>
          {visibleItems.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <Button
                variant={currentPage === item.id ? 'default' : 'ghost'}
                className={`w-full justify-start text-sm py-2.5 px-3 rounded-lg ${
                  currentPage === item.id 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:from-blue-700 hover:to-purple-700' 
                    : 'hover:bg-slate-700/50 text-slate-300 hover:text-white'
                }`}
                onClick={() => onPageChange(item.id)}
              >
                <item.icon className={`h-5 w-5 mr-3 ${currentPage === item.id ? '' : 'text-slate-400'}`} />
                {item.label}
                {currentPage === item.id && (
                  <motion.div layoutId="activeIndicator" className="ml-auto">
                     <ChevronRight className="h-4 w-4" />
                  </motion.div>
                )}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div 
        className="p-4 mt-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: visibleItems.length * 0.07 + 0.3 }}
      >
        <div className="p-4 glass-card rounded-lg border border-slate-700/60">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-1.5 bg-gradient-to-br from-purple-600 to-pink-600 rounded-md">
                <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-sm text-slate-100">AI Enhanced CRM</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Leverage AI for smarter lead scoring, predictive analytics, and workflow automation.
          </p>
        </div>
      </motion.div>
    </motion.aside>
  );
}
