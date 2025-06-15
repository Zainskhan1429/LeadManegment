import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, ShieldCheck, DollarSign, TrendingUp, AlertTriangle, ShoppingCart, ListChecks, History } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/components/ui/use-toast";

export function BillingPage({ user }) {
  const { toast } = useToast();
  const currentPlan = "Pro"; // Mock data
  const plans = [
    { name: "Free", price: "$0/mo", features: ["100 Leads", "Basic AI Scoring", "1 User"], icon: ShoppingCart, popular: false },
    { name: "Pro", price: "$49/mo", features: ["1000 Leads", "Advanced AI Scoring", "5 Users", "Automation Workflows"], icon: TrendingUp, popular: true },
    { name: "Enterprise", price: "Custom", features: ["Unlimited Leads", "Predictive AI Engine", "Unlimited Users", "Dedicated Support", "SLA"], icon: ListChecks, popular: false },
  ];

  const handlePlanAction = (planName) => {
    if (planName === currentPlan) {
        toast({ title: "Current Plan", description: `You are already on the ${planName} plan.` });
    } else {
        toast({
            title: `Stripe Integration Needed for ${planName} Plan`,
            description: "🚧 This feature requires Stripe integration. You can request it in your next prompt! 🚀"
        });
    }
  };

  const handleViewPaymentHistory = () => {
     toast({
        title: "Payment History",
        description: "🚧 This feature requires Stripe integration to show actual payment history. You can request it in your next prompt! 🚀"
    });
  }

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3"
      >
        <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
            <CreditCard className="h-7 w-7 text-white" />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Billing & Subscriptions</h1>
            <p className="text-muted-foreground text-lg">Manage your LeadAI plan and payment details.</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass-card border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
                <DollarSign className="h-5 w-5 mr-2 text-green-400" /> Current Plan: <span className="text-green-400 ml-2">{currentPlan}</span>
            </CardTitle>
            <CardDescription>Your current subscription details. Next billing date: July 14, 2025.</CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground">
                Your <span className="font-semibold text-green-400">{currentPlan}</span> plan gives you access to advanced features to supercharge your sales.
             </p>
          </CardContent>
          <CardFooter className="border-t border-slate-700/50 pt-4 flex justify-between items-center">
            <Button variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/10 hover:text-green-300" onClick={() => handlePlanAction("Manage Plan")}>
                Manage Subscription
            </Button>
            <Button variant="ghost" className="text-slate-400 hover:text-slate-200" onClick={handleViewPaymentHistory}>
                <History className="h-4 w-4 mr-2" /> View Payment History
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <div className="text-center mt-10">
        <h2 className="text-2xl font-semibold mb-2">Choose Your Plan</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Select the plan that best fits your business needs. All plans come with a 14-day free trial.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="h-full"
          >
            <Card className={`glass-card border-slate-700/50 flex flex-col h-full ${plan.popular ? 'border-green-500 shadow-xl shadow-green-500/20' : 'hover:border-slate-600'}`}>
              {plan.popular && <Badge variant="default" className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 text-xs">Most Popular</Badge>}
              <CardHeader className="text-center pb-4">
                <div className={`mx-auto p-3 rounded-full w-fit mb-3 ${ plan.popular ? 'bg-green-500/20' : 'bg-slate-700/50'}`}>
                    <plan.icon className={`h-7 w-7 ${ plan.popular ? 'text-green-400' : 'text-slate-400'}`} />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-3xl font-bold text-slate-100">{plan.price}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 flex-grow">
                {plan.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-slate-300">{feature}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="mt-auto pt-6 border-t border-slate-700/50">
                <Button 
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' : 'bg-slate-700 hover:bg-slate-600'}`}
                    onClick={() => handlePlanAction(plan.name)}
                    disabled={plan.name === currentPlan}
                >
                  {plan.name === currentPlan ? "Current Plan" : (plan.price === "Custom" ? "Contact Sales" : "Choose Plan")}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
       <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-10 p-6 glass-card rounded-xl border border-slate-700/50 flex items-center justify-between"
      >
        <div className="flex items-center">
            <ShieldCheck className="h-8 w-8 text-green-400 mr-4" />
            <div>
                <h3 className="text-lg font-semibold">Secure Payments by Stripe</h3>
                <p className="text-sm text-muted-foreground">We partner with Stripe for simplified, secure, and PCI-compliant billing.</p>
            </div>
        </div>
        <Button variant="link" onClick={() => window.open("https://stripe.com", "_blank")} className="text-sm text-blue-400 hover:text-blue-300">
            Learn more about Stripe
        </Button>
      </motion.div>
    </div>
  );
}