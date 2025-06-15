
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Calendar, Star, Brain, Target, Clock, Award, Briefcase, FileText as ResumeIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAnalytics } from '@/lib/db/analytics';
import { getLeads } from '@/lib/db/leads'; // For resume count
import { AUTH_ROLES, hasPermission } from '@/lib/auth';

export function AnalyticsDashboard({ user }) {
  const analytics = getAnalytics();
  const allLeads = getLeads();
  const resumeCount = allLeads.filter(lead => lead.resumeUrl).length;


  const statCards = [
    { title: 'Total Leads', value: analytics.leadCounts.total, icon: Users, color: 'text-blue-400', bgColor: 'bg-blue-500/10', requiredRole: AUTH_ROLES.SALES_AGENT },
    { title: 'Hot Leads', value: analytics.leadCounts.hot, icon: Target, color: 'text-red-400', bgColor: 'bg-red-500/10', requiredRole: AUTH_ROLES.SALES_AGENT },
    { title: 'Warm Leads', value: analytics.leadCounts.warm, icon: TrendingUp, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', requiredRole: AUTH_ROLES.SALES_AGENT },
    { title: 'Cold Leads', value: analytics.leadCounts.cold, icon: Clock, color: 'text-sky-400', bgColor: 'bg-sky-500/10', requiredRole: AUTH_ROLES.SALES_AGENT },
    { title: 'Appointments This Week', value: analytics.appointmentCounts.thisWeek, icon: Calendar, color: 'text-green-400', bgColor: 'bg-green-500/10', requiredRole: AUTH_ROLES.SALES_AGENT },
    { title: 'Appointments This Month', value: analytics.appointmentCounts.thisMonth, icon: Calendar, color: 'text-purple-400', bgColor: 'bg-purple-500/10', requiredRole: AUTH_ROLES.SALES_AGENT },
    { title: 'Avg. Feedback Rating', value: analytics.feedbackStats.averageRating, icon: Star, color: 'text-amber-400', bgColor: 'bg-amber-500/10', requiredRole: AUTH_ROLES.SALES_AGENT },
    { title: 'Total Feedback Entries', value: analytics.feedbackStats.totalFeedback, icon: Award, color: 'text-pink-400', bgColor: 'bg-pink-500/10', requiredRole: AUTH_ROLES.SALES_AGENT },
    { title: 'Resumes Collected', value: resumeCount, icon: ResumeIcon, color: 'text-indigo-400', bgColor: 'bg-indigo-500/10', requiredRole: AUTH_ROLES.HR },
  ];

  const visibleStatCards = statCards.filter(card => hasPermission(user.role, card.requiredRole));


  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <Brain className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.name}!</h1>
            <p className="text-muted-foreground text-lg">Here's your LeadAI intelligence overview.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleStatCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05, type: "spring", stiffness: 100 }}
          >
            <Card className="glass-card border-slate-700/50 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2.5 rounded-lg ${stat.bgColor} shadow-md`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="lg:col-span-3"
        >
          <Card className="glass-card border-slate-700/50 h-full">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Target className="h-6 w-6 mr-3 text-red-400" />
                Lead Score Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { score: 'Hot', count: analytics.leadCounts.hot, color: 'bg-red-500', desc: 'High priority, engage immediately.' },
                { score: 'Warm', count: analytics.leadCounts.warm, color: 'bg-yellow-500', desc: 'Good potential, nurture actively.' },
                { score: 'Cold', count: analytics.leadCounts.cold, color: 'bg-blue-500', desc: 'Lower priority, monitor for changes.' },
              ].map(item => (
                <div key={item.score} className="flex items-center">
                  <Badge variant={item.score.toLowerCase()} className={`w-16 justify-center mr-4 py-1 text-xs ${item.color} text-white`}>{item.score}</Badge>
                  <div className="flex-1">
                    <div className="h-3 w-full bg-slate-700 rounded-full">
                       <motion.div 
                        className={`h-3 rounded-full ${item.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.count / Math.max(analytics.leadCounts.total, 1)) * 100}%`}}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                       />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                  <span className="font-semibold w-10 text-right">{item.count}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="lg:col-span-2"
        >
          <Card className="glass-card border-slate-700/50 h-full">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Calendar className="h-6 w-6 mr-3 text-green-400" />
                Appointment Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm">This Week</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-slate-700 rounded-full h-2.5">
                      <motion.div 
                        className="bg-green-500 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((analytics.appointmentCounts.thisWeek / Math.max(analytics.appointmentCounts.thisMonth, 5)) * 100, 100)}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                      />
                    </div>
                    <span className="font-semibold text-lg">{analytics.appointmentCounts.thisWeek}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">This Month</span>
                   <div className="flex items-center space-x-2">
                    <div className="w-24 bg-slate-700 rounded-full h-2.5">
                      <motion.div 
                        className="bg-purple-500 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `100%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                      />
                    </div>
                    <span className="font-semibold text-lg">{analytics.appointmentCounts.thisMonth}</span>
                  </div>
                </div>
                 <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                  <span className="text-sm font-medium">Total Scheduled</span>
                  <span className="font-bold text-xl">{analytics.appointmentCounts.total}</span>
                </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
