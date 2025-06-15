
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, LogOut, User, Settings, Brain, Briefcase, Zap, BarChart3, CreditCard, Bot, History, FileText as ResumeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { logout } from '@/lib/auth';
import { getNotifications, markNotificationAsRead } from '@/lib/db/notifications';
import { NOTIFICATION_TYPES } from '@/lib/constants';

export function Header({ user, onLogout }) {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setNotifications(getNotifications());
  }, [showNotifications]); 

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogoutClick = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    onLogout();
  };

  const handleMarkAsRead = (notificationId) => {
    markNotificationAsRead(notificationId);
    setNotifications(getNotifications()); 
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.AI_UPDATE: return <Brain className="h-4 w-4 text-purple-400" />;
      case NOTIFICATION_TYPES.NEW_LEAD: return <User className="h-4 w-4 text-blue-400" />;
      case NOTIFICATION_TYPES.REMINDER: return <Bell className="h-4 w-4 text-yellow-400" />;
      case NOTIFICATION_TYPES.TASK: return <Briefcase className="h-4 w-4 text-green-400" />;
      default: return <Bell className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card border-b border-slate-700/50 p-4 sticky top-0 z-50"
    >
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
        <div className="flex items-center space-x-4">
          <motion.div
            className="flex items-center space-x-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => window.location.reload()} 
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg flex items-center justify-center shadow-md">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              LeadAI
            </span>
          </motion.div>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-5">
          <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-slate-700/50">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md glass-card border-slate-700/50">
              <DialogHeader>
                <DialogTitle>Notifications ({unreadCount} unread)</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto scrollbar-hide pr-2">
                {notifications.length === 0 ? (
                  <p className="text-muted-foreground text-center py-6">
                    No new notifications. You're all caught up!
                  </p>
                ) : (
                  notifications.map((notification) => (
                    <Card
                      key={notification.id}
                      className={`cursor-pointer transition-all duration-200 hover:bg-slate-700/30 ${
                        notification.read ? 'opacity-60 bg-slate-800/30' : 'bg-slate-800/70'
                      }`}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start space-x-3">
                          <div className={`mt-1 p-1.5 rounded-full ${notification.read ? 'bg-slate-700' : 'bg-slate-600'}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold ${notification.read ? 'text-slate-400' : 'text-slate-100'}`}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                          {!notification.read && <div className="h-2 w-2 rounded-full bg-blue-500 mt-1 animate-ping"></div>}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex items-center space-x-2">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-600 to-slate-800 flex items-center justify-center text-sm font-semibold uppercase">
                {user.name ? user.name.substring(0,2) : <User className="h-4 w-4"/>}
            </div>
            <div className="hidden sm:block text-sm">
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.role}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogoutClick}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-full"
            aria-label="Log out"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
