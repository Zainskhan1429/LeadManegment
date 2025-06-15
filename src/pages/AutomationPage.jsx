import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Workflow, Send, Repeat, Settings2, AlertTriangle, Users, FileText as FileTextIcon, Clock, ArrowRightCircle, Mail as MailIcon } from 'lucide-react'; // Added Users
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

export function AutomationPage({ user }) {
  const { toast } = useToast();

  const automationFeatures = [
    { title: "Auto Lead Assignment", description: "Automatically assign new leads to sales agents using round-robin or workload-based rules.", icon: Users, status: "Configurable" },
    { title: "Follow-up Reminders", description: "Set up automatic reminders for sales agents to follow up on stale or inactive leads.", icon: Clock, status: "Configurable" },
    { title: "Stage Movement Triggers", description: "Define rules to automatically move leads to the next pipeline stage based on specific actions.", icon: ArrowRightCircle, status: "Configurable" },
    { title: "Bulk Email Drip Campaigns", description: "Create and manage automated email sequences for lead nurturing.", icon: MailIcon, status: "Coming Soon" },
    { title: "Email Template System", description: "Design and store reusable email templates for quick communication.", icon: FileTextIcon, status: "Coming Soon" },
    { title: "Workflow Builder", description: "Visually design custom automation workflows with multiple steps and conditions.", icon: Workflow, status: "Advanced Feature" },
  ];
  

  const handleFeatureClick = (feature) => {
    toast({
      title: `Automation: ${feature.title}`,
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  return (
    <div className="space-y-8">
       <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3"
      >
        <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg">
            <Zap className="h-7 w-7 text-white" />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Automation Hub</h1>
            <p className="text-muted-foreground text-lg">Streamline your sales process with intelligent automation.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {automationFeatures.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.07 }}
            whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
          >
            <Card className="glass-card border-slate-700/50 h-full flex flex-col hover:border-teal-500/70 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2.5 rounded-lg bg-teal-500/10 shadow-md`}>
                        <feature.icon className="h-5 w-5 text-teal-400" />
                    </div>
                    <CardTitle className="text-lg text-slate-100">{feature.title}</CardTitle>
                </div>
                <CardDescription className="text-sm text-slate-400 min-h-[40px]">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button 
                    variant="outline" 
                    className="w-full border-teal-500/50 text-teal-400 hover:bg-teal-500/10 hover:text-teal-300"
                    onClick={() => handleFeatureClick(feature)}
                >
                  {feature.status === "Configurable" ? <Settings2 className="mr-2 h-4 w-4"/> : <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />}
                  {feature.status === "Configurable" ? "Configure" : feature.status}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
       <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: automationFeatures.length * 0.07 + 0.2 }}
        className="mt-10 p-6 glass-card rounded-xl border border-slate-700/50 text-center"
      >
        <Workflow className="h-12 w-12 text-teal-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Custom Workflows</h2>
        <p className="text-muted-foreground mb-4 max-w-md mx-auto">
          Need more advanced automation? Our upcoming visual workflow builder will let you connect triggers and actions to automate almost any task in your CRM.
        </p>
        <Button variant="ghost" className="text-teal-400 hover:text-teal-300 hover:bg-teal-500/10" onClick={() => handleFeatureClick({title: "Workflow Builder"})}>
          Learn More About Workflow Builder
        </Button>
      </motion.div>
    </div>
  );
}