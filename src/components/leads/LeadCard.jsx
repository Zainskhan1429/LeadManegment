
import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit, Trash2, Zap, Mail, Phone, Building, UserCircle, Tag, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { LEAD_SCORES } from '@/lib/constants';

export function LeadCard({ lead, onView, onEdit, onDelete, onScore, index, assignableUsers = [] }) {
  const { toast } = useToast();

  const getBadgeVariant = (score) => {
    switch (score) {
      case LEAD_SCORES.HOT: return 'hot';
      case LEAD_SCORES.WARM: return 'warm';
      case LEAD_SCORES.COLD: return 'cold';
      default: return 'secondary';
    }
  };
  
  const getStatusColor = (status) => {
    // Example, expand this based on your LEAD_STATUS
    if (status === 'Closed Won') return 'text-green-400';
    if (status === 'Closed Lost') return 'text-red-400';
    if (status === 'Proposal Sent' || status === 'Negotiation') return 'text-blue-400';
    return 'text-slate-400';
  };

  const handleAction = (action, actionName) => {
    if (action) {
      action(lead);
    } else {
      toast({
        title: `"${actionName}" Action`,
        description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
      });
    }
  };
  
  const assignedUser = assignableUsers.find(u => u.id === lead.assignedTo);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.03, y: -4, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
      className="h-full flex flex-col"
    >
      <Card className="glass-card border-slate-700/50 h-full flex flex-col hover:border-blue-500/70 transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold text-slate-100">{lead.name}</CardTitle>
              <CardDescription className="flex items-center text-sm text-slate-400">
                <Building className="h-4 w-4 mr-1.5" />
                {lead.company}
              </CardDescription>
            </div>
            <Badge variant={getBadgeVariant(lead.leadScore)} className="px-2.5 py-1 text-xs shadow-md">
              {lead.leadScore}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3 flex-grow">
          {lead.email && (
            <div className="flex items-center space-x-2 text-sm text-slate-300">
              <Mail className="h-4 w-4 text-slate-500" />
              <span className="truncate hover:underline cursor-pointer" onClick={() => window.location.href = `mailto:${lead.email}`}>{lead.email}</span>
            </div>
          )}
          {lead.phone && (
            <div className="flex items-center space-x-2 text-sm text-slate-300">
              <Phone className="h-4 w-4 text-slate-500" />
              <span className="hover:underline cursor-pointer" onClick={() => window.location.href = `tel:${lead.phone}`}>{lead.phone}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2 text-sm">
            <Tag className="h-4 w-4 text-slate-500" />
            <span className="text-slate-300">{lead.leadSource}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
             <Activity className="h-4 w-4 text-slate-500" />
             <span className={`${getStatusColor(lead.status)} font-medium`}>{lead.status}</span>
          </div>

          {assignedUser && (
             <div className="flex items-center space-x-2 text-sm">
                <UserCircle className="h-4 w-4 text-slate-500" />
                <span className="text-slate-300">Assigned to: {assignedUser.name}</span>
            </div>
          )}

          {lead.engagementNotes && (
            <div className="pt-2">
              <p className="text-xs text-slate-500 mb-0.5">Last Note:</p>
              <p className="text-sm text-slate-300 line-clamp-2">{lead.engagementNotes}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex items-center justify-between pt-3 mt-auto border-t border-slate-700/50">
            <div className="flex space-x-1">
              <Button variant="ghost" size="icon" onClick={() => handleAction(onView, 'View Lead')} className="h-8 w-8 hover:bg-blue-500/10 hover:text-blue-400"><Eye className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleAction(onEdit, 'Edit Lead')} className="h-8 w-8 hover:bg-green-500/10 hover:text-green-400"><Edit className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleAction(onDelete, 'Delete Lead')} className="h-8 w-8 hover:bg-red-500/10 hover:text-red-400"><Trash2 className="h-4 w-4" /></Button>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleAction(onScore, 'Score Lead')} className="text-xs hover:bg-purple-500/10 hover:text-purple-400 border-purple-500/50 text-purple-400">
              <Zap className="h-3.5 w-3.5 mr-1.5" /> AI Score
            </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
