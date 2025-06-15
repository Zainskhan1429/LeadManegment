import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, UserCog, FolderCog as BellCog, ShieldCheck, Palette, CreditCard as CreditCardCog, DatabaseZap, Users2, HelpCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch'; // Assuming you'll create this
import { useToast } from "@/components/ui/use-toast";

export function SettingsPage({ user }) {
  const { toast } = useToast();
  const [userSettings, setUserSettings] = useState({
    name: user.name,
    email: user.email,
    enableEmailNotifications: true,
    enableSystemNotifications: true,
    darkMode: true, // Assuming dark mode is default from project requirements
  });
  
  // Mock component for Switch if not created. You should create src/components/ui/switch.jsx
  const MockSwitch = ({checked, onCheckedChange, id}) => (
    <button 
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={`${checked ? 'bg-blue-600' : 'bg-slate-700'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2`}
      >
        <span className={`${checked ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}/>
      </button>
  );
  const ActualSwitch = Switch || MockSwitch;


  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUserSettings(prev => ({ ...prev, [id]: value }));
  };

  const handleSwitchChange = (id, checked) => {
    setUserSettings(prev => ({ ...prev, [id]: checked }));
  };

  const handleSaveSettings = (section) => {
    toast({
      title: `Settings Update (${section})`,
      description: "🚧 This feature requires backend integration to persist settings. You can request it in your next prompt! 🚀"
    });
    // Example: console.log("Saving settings:", section, userSettings);
  };

  const settingSections = [
    { 
      id: "profile", title: "User Profile", icon: UserCog, description: "Manage your personal information.",
      fields: [
        { id: "name", label: "Full Name", type: "text" },
        { id: "email", label: "Email Address", type: "email" },
        { id: "changePassword", label: "Change Password", type: "button", action: () => handleSaveSettings("Password Change") },
      ]
    },
    { 
      id: "notifications", title: "Notification Preferences", icon: BellCog, description: "Control how you receive alerts.",
      fields: [
        { id: "enableEmailNotifications", label: "Email Notifications", type: "switch" },
        { id: "enableSystemNotifications", label: "In-App System Alerts", type: "switch" },
      ]
    },
    {
      id: "appearance", title: "Appearance & Theme", icon: Palette, description: "Customize the look and feel of LeadAI.",
      fields: [
        { id: "darkMode", label: "Dark Mode", type: "switch", disabled: true }, // True as per project spec
        { id: "themeColor", label: "Primary Theme Color", type: "color_picker_mock" },
      ]
    },
     { 
      id: "security", title: "Security Settings", icon: ShieldCheck, description: "Manage account security options.",
      fields: [
        { id: "twoFactorAuth", label: "Two-Factor Authentication (2FA)", type: "button", action: () => handleSaveSettings("2FA Setup") },
        { id: "loginHistory", label: "View Login History", type: "button", action: () => handleSaveSettings("Login History View") },
      ]
    },
    { 
      id: "billingAdmin", title: "Billing & Subscription (Admin)", icon: CreditCardCog, description: "Manage organization's billing (Admin only).",
      adminOnly: true,
      fields: [
        { id: "manageSubscription", label: "Manage Subscription Plan", type: "button", action: () => handleSaveSettings("Subscription Management") },
        { id: "paymentMethods", label: "Update Payment Methods", type: "button", action: () => handleSaveSettings("Payment Methods Update") },
      ]
    },
    { 
      id: "dataAdmin", title: "Data Management (Admin)", icon: DatabaseZap, description: "Data import/export and backup settings (Admin only).",
      adminOnly: true,
      fields: [
        { id: "exportData", label: "Export All CRM Data", type: "button", action: () => handleSaveSettings("Data Export") },
        { id: "importData", label: "Import Data from CSV", type: "button", action: () => handleSaveSettings("Data Import") },
      ]
    },
    { 
      id: "usersAdmin", title: "User Management (Admin)", icon: Users2, description: "Invite, remove, and manage user roles (Admin only).",
      adminOnly: true,
      fields: [
        { id: "inviteUser", label: "Invite New User", type: "button", action: () => handleSaveSettings("User Invitation") },
        { id: "viewAllUsers", label: "View & Manage All Users", type: "button", action: () => handleSaveSettings("User List View") },
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3"
      >
        <div className="p-3 bg-gradient-to-br from-slate-500 to-gray-600 rounded-xl shadow-lg">
            <Settings className="h-7 w-7 text-white" />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
            <p className="text-muted-foreground text-lg">Configure LeadAI to fit your preferences and workflow.</p>
        </div>
      </motion.div>

      {settingSections.filter(section => !section.adminOnly || (section.adminOnly && user.role === 'Admin')).map((section, index) => (
        <motion.div
          key={section.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + index * 0.08 }}
        >
          <Card className="glass-card border-slate-700/50">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-slate-700/60 rounded-lg"><section.icon className="h-5 w-5 text-slate-300" /></div>
                <CardTitle className="text-xl text-slate-100">{section.title}</CardTitle>
              </div>
              <CardDescription className="text-sm text-slate-400 pt-1 pl-10">{section.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pl-10">
              {section.fields.map(field => (
                <div key={field.id} className={`flex items-center ${field.type === 'switch' ? 'justify-between' : 'flex-col sm:flex-row sm:items-center'} gap-2`}>
                  <Label htmlFor={field.id} className="text-sm text-slate-300 mb-1 sm:mb-0 sm:min-w-[200px]">{field.label}</Label>
                  {field.type === "text" || field.type === "email" ? (
                    <Input 
                      id={field.id} 
                      type={field.type} 
                      value={userSettings[field.id]} 
                      onChange={handleInputChange}
                      className="max-w-sm"
                    />
                  ) : field.type === "switch" ? (
                     <ActualSwitch // Use the actual Switch or MockSwitch
                        id={field.id}
                        checked={userSettings[field.id]}
                        onCheckedChange={(checked) => handleSwitchChange(field.id, checked)}
                        disabled={field.disabled}
                    />
                  ) : field.type === "button" ? (
                    <Button variant="outline" size="sm" onClick={field.action} className="w-full sm:w-auto">
                      {field.label}
                    </Button>
                  ) : field.type === "color_picker_mock" ? (
                     <div className="flex items-center space-x-2 p-2 border border-slate-700 rounded-md bg-slate-800 max-w-sm w-full">
                        <div className="w-6 h-6 rounded-sm bg-blue-500 border border-slate-600"></div>
                        <span className="text-sm text-slate-400">#3B82F6 (Mock)</span>
                        <Button variant="ghost" size="sm" onClick={() => toast({title: "Color Picker", description: "🚧 Feature not implemented."})}>Change</Button>
                    </div>
                  ) : null}
                </div>
              ))}
            </CardContent>
            <CardFooter className="border-t border-slate-700/50 pt-4 flex justify-end pl-10">
              <Button onClick={() => handleSaveSettings(section.title)} className="bg-blue-600 hover:bg-blue-700">
                Save {section.title.split(' ')[0]} Settings
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 + settingSections.length * 0.08 }}
        className="mt-8 p-5 glass-card rounded-xl border border-slate-700/50 flex items-start justify-between"
      >
        <div className="flex items-center">
            <HelpCircle className="h-7 w-7 text-blue-400 mr-4 flex-shrink-0" />
            <div>
                <h3 className="text-lg font-semibold">Need Help?</h3>
                <p className="text-sm text-muted-foreground">Visit our support center or contact us for assistance.</p>
            </div>
        </div>
        <Button variant="outline" onClick={() => toast({title: "Support Center", description:"🚧 Feature not implemented."})}>
            Go to Support
        </Button>
      </motion.div>
    </div>
  );
}