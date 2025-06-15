
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, Mail, Lock, ShieldAlert, KeyRound, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { login, AUTH_ROLES } from '@/lib/auth';

export function LoginForm({ onSuccess, onToggleMode }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast({
          title: "Welcome back!",
          description: `Logged in as ${result.user.name} (${result.user.role})`,
        });
        onSuccess(result.user);
      } else {
        toast({
          title: "Login failed",
          description: result.error || "Invalid credentials.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (roleKey) => {
    const demoCredentials = {
      [AUTH_ROLES.ADMIN]: { email: 'admin@leadai.com', password: 'admin123' },
      [AUTH_ROLES.TEAM_MANAGER]: { email: 'manager@leadai.com', password: 'manager123' },
      [AUTH_ROLES.SALES_AGENT]: { email: 'agent@leadai.com', password: 'agent123' },
      [AUTH_ROLES.ANALYST]: { email: 'analyst@leadai.com', password: 'analyst123'},
      [AUTH_ROLES.HR]: { email: 'hr@leadai.com', password: 'hr123'}
    };
    
    const creds = demoCredentials[roleKey];
    if (!creds) {
        toast({ title: "Demo account not found", variant: "destructive" });
        return;
    }
    setFormData(creds); // Pre-fill form for transparency
    
    // Attempt login
    const result = await login(creds.email, creds.password);
    if (result.success) {
      toast({
        title: "Demo login successful!",
        description: `Logged in as ${result.user.role}`,
      });
      onSuccess(result.user);
    } else {
       toast({
        title: "Demo login failed",
        description: result.error || "Could not log in with demo credentials.",
        variant: "destructive",
      });
    }
  };
  
  const handleOAuthLogin = (provider) => {
     toast({
        title: `OAuth with ${provider}`,
        description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
      });
  }

  const handleForgotPassword = () => {
     toast({
        title: "Forgot Password",
        description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
      });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md glass-card border-slate-700/50">
        <CardHeader className="text-center">
           <div className="mx-auto bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full w-fit">
             <KeyRound className="h-8 w-8 text-white" />
           </div>
          <CardTitle className="text-3xl font-bold mt-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            LeadAI CRM Login
          </CardTitle>
          <CardDescription>
            Access your smart lead management platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                 <Button variant="link" type="button" onClick={handleForgotPassword} className="p-0 h-auto text-xs">Forgot password?</Button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In Securely
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => handleOAuthLogin('Google')}>
              <Globe className="mr-2 h-4 w-4" /> Google
            </Button>
            <Button variant="outline" onClick={() => handleOAuthLogin('LinkedIn')}>
              <Globe className="mr-2 h-4 w-4" /> LinkedIn
            </Button>
          </div>
          
           <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or try demo accounts
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2">
            {[AUTH_ROLES.ADMIN, AUTH_ROLES.TEAM_MANAGER, AUTH_ROLES.SALES_AGENT, AUTH_ROLES.ANALYST, AUTH_ROLES.HR].map(role => (
                 <Button
                    key={role}
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin(role)}
                    className="text-xs"
                  >
                    {role.split(' ')[0]} {/* Show first word of role for brevity */}
                  </Button>
            ))}
             <Button
                variant="outline"
                size="sm"
                className="text-xs col-span-3"
                onClick={() => toast({ title: "Read-only Viewer account is for invited users."})}
              >
                Viewer (Invite only)
              </Button>
          </div>

        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
            <Button
              variant="link"
              onClick={onToggleMode}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Don't have an account? Sign up as Admin
            </Button>
            <div className="flex items-center text-xs text-muted-foreground">
                <ShieldAlert className="h-3 w-3 mr-1 text-green-500"/> Secure SSL Connection
            </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
