
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { Header } from '@/components/layout/Header';
import { LeadsPage } from '@/pages/LeadsPage';
import { AppointmentsPage } from '@/pages/AppointmentsPage';
import { FeedbackPage } from '@/pages/FeedbackPage';
import { AuditLogsPage } from '@/pages/AuditLogsPage';
import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard';
import { ResumeManagementPage } from '@/pages/ResumeManagementPage';
import { BillingPage } from '@/pages/BillingPage';
import { AutomationPage } from '@/pages/AutomationPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { getCurrentUser, initializeDemoUsers, hasPermission, AUTH_ROLES, logout as authLogout } from '@/lib/auth';
import { initializeDemoData } from '@/lib/db/init';
import { Sidebar } from '@/components/layout/Sidebar';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient'; // Import Supabase client

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authMode, setAuthMode] = useState('login');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { toast } = useToast();

  useEffect(() => {
    initializeDemoUsers();
    initializeDemoData();
    
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setCurrentPage('dashboard');
    }
    setIsLoading(false);

    // Example: Check Supabase connection (optional, for testing)
    const checkSupabase = async () => {
      try {
        // This is a simple check. In a real app, you might fetch initial user data from Supabase if logged in.
        const { data, error } = await supabase.from('users').select('id').limit(1); // Assuming you have a 'users' table
        if (error && error.message !== 'relation "users" does not exist') { // Ignore if table doesn't exist yet
          console.error('Supabase connection error:', error);
          toast({
            title: "Supabase Connection Issue",
            description: "Could not connect to the database. Some features might not work.",
            variant: "destructive",
          });
        } else if (!error) {
          console.log('Supabase connected successfully.');
        }
      } catch (e) {
        console.error('Supabase client error:', e);
      }
    };
    checkSupabase();

  }, [toast]);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    authLogout();
    setUser(null);
    setCurrentPage('dashboard'); 
    toast({ title: "Logged out successfully!" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 gradient-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {authMode === 'login' ? (
              <LoginForm
                key="login"
                onSuccess={handleAuthSuccess}
                onToggleMode={() => setAuthMode('signup')}
              />
            ) : (
              <SignupForm
                key="signup"
                onSuccess={handleAuthSuccess}
                onToggleMode={() => setAuthMode('login')}
                isAdminSignup={true}
              />
            )}
          </AnimatePresence>
        </div>
        <Toaster />
      </div>
    );
  }

  const renderPage = () => {
    if (!user) return null; 
    switch (currentPage) {
      case 'dashboard':
        return <AnalyticsDashboard user={user} />;
      case 'leads':
        return <LeadsPage user={user} />;
      case 'appointments':
        return <AppointmentsPage user={user} />;
      case 'feedback':
        return <FeedbackPage user={user} />;
      case 'resumes':
        return hasPermission(user.role, [AUTH_ROLES.HR, AUTH_ROLES.ADMIN]) ? 
          <ResumeManagementPage user={user} /> : <AccessDenied />;
      case 'automation':
        return hasPermission(user.role, [AUTH_ROLES.ADMIN, AUTH_ROLES.TEAM_MANAGER]) ?
          <AutomationPage user={user} /> : <AccessDenied />;
      case 'billing':
        return hasPermission(user.role, AUTH_ROLES.ADMIN) ?
          <BillingPage user={user} /> : <AccessDenied />;
      case 'settings':
        return hasPermission(user.role, AUTH_ROLES.ADMIN) ?
          <SettingsPage user={user} /> : <AccessDenied />;
      case 'audit':
        return hasPermission(user.role, AUTH_ROLES.ADMIN) ? 
          <AuditLogsPage /> : <AccessDenied />;
      default:
        return <AnalyticsDashboard user={user} />;
    }
  };
  
  const AccessDenied = () => (
    <div className="text-center py-8">
      <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
      <p className="text-muted-foreground">You do not have permission to view this page.</p>
    </div>
  );


  return (
    <div className="min-h-screen bg-slate-900 gradient-bg">
      <Header user={user} onLogout={handleLogout} />
      
      <div className="flex">
        <Sidebar 
          user={user} 
          currentPage={currentPage} 
          onPageChange={setCurrentPage} 
        />
        
        <main className="flex-1 p-6 overflow-auto h-[calc(100vh-80px)] scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      
      <Toaster />
    </div>
  );
}

export default App;
