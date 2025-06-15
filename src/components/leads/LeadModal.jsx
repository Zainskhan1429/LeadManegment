import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Mail, Phone, Building, Calendar, FileText, Brain, UserCircle, Tag, Activity, Info, Users as TeamIcon, Edit, FileUp, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';
import { scoreLeadWithAI } from '@/lib/db/leads'; 
import { LEAD_SCORES, LEAD_STATUS } from '@/lib/constants';


export function LeadModal({ lead, isOpen, onClose, onLeadUpdate, assignableUsers = [] }) {
  const [isScoring, setIsScoring] = useState(false);
  const { toast } = useToast();

  if (!lead) return null;

  const getBadgeVariant = (score) => {
    switch (score) {
      case LEAD_SCORES.HOT: return 'hot';
      case LEAD_SCORES.WARM: return 'warm';
      case LEAD_SCORES.COLD: return 'cold';
      default: return 'secondary';
    }
  };
  
  const getStatusColor = (status) => {
    if (status === LEAD_STATUS.CLOSED_WON) return 'text-green-400';
    if (status === LEAD_STATUS.CLOSED_LOST) return 'text-red-400';
    return 'text-slate-400';
  };

  const handleRescore = async () => {
    setIsScoring(true);
    try {
      const updatedLead = scoreLeadWithAI(lead.id);
      if (updatedLead) {
        toast({ title: "Lead Rescored!", description: `${lead.name} is now ${updatedLead.leadScore}.` });
        onLeadUpdate(updatedLead);
      }
    } catch (error) {
      toast({ title: "Error Rescoring", description: "Failed to rescore lead.", variant: "destructive" });
    } finally {
      setIsScoring(false);
    }
  };
  
  const assignedUser = assignableUsers.find(u => u.id === lead.assignedTo);

  const DetailItem = ({ icon: Icon, label, value, href, colorClass = "text-slate-100" }) => (
    <div className="flex items-start space-x-3 py-2">
      <Icon className={`h-5 w-5 mt-0.5 ${colorClass || "text-slate-400"}`} />
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        {href ? (
          <a href={href} className={`text-sm font-medium text-blue-400 hover:underline ${colorClass}`}>{value}</a>
        ) : (
          <p className={`text-sm font-medium ${colorClass}`}>{value || 'N/A'}</p>
        )}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] glass-card border-slate-700/50 overflow-y-auto scrollbar-hide p-0">
        <DialogHeader className="p-6 pb-4 border-b border-slate-700/50 sticky top-0 bg-slate-900/80 backdrop-blur-sm z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-slate-100">{lead.name}</DialogTitle>
            <Badge variant={getBadgeVariant(lead.leadScore)} className="px-3 py-1 text-sm shadow-lg">{lead.leadScore}</Badge>
          </div>
          <p className="text-sm text-slate-400 flex items-center"><Building className="h-4 w-4 mr-2"/>{lead.company}</p>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 gap-2 p-2 sticky top-[calc(theme(spacing.24)+1px)] bg-slate-900/80 backdrop-blur-sm z-10 border-b border-slate-700/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ai_insights">AI Insights</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          <div className="p-6">
            <TabsContent value="overview" className="mt-0">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="space-y-1">
                  <DetailItem icon={Mail} label="Email" value={lead.email} href={`mailto:${lead.email}`} />
                  <DetailItem icon={Phone} label="Phone" value={lead.phone} href={`tel:${lead.phone}`} />
                  <DetailItem icon={Tag} label="Lead Source" value={lead.leadSource} colorClass="text-purple-300"/>
                  <DetailItem icon={Activity} label="Status" value={lead.status} colorClass={getStatusColor(lead.status)} />
                  <DetailItem icon={Info} label="Priority" value={lead.priority} />
                </div>
                <div className="space-y-1">
                  <DetailItem icon={Briefcase} label="Business Type" value={lead.businessType} />
                  <DetailItem icon={TeamIcon} label="Company Size" value={lead.companySize} />
                  {assignedUser && <DetailItem icon={UserCircle} label="Assigned To" value={assignedUser.name} colorClass="text-green-300" />}
                  <DetailItem icon={Calendar} label="Created On" value={new Date(lead.createdAt).toLocaleDateString()} />
                  <DetailItem icon={Calendar} label="Last Updated" value={new Date(lead.updatedAt).toLocaleDateString()} />
                </div>
                
                {lead.engagementNotes && (
                  <div className="md:col-span-2 mt-3 pt-3 border-t border-slate-700/50">
                    <h4 className="text-sm font-semibold text-slate-300 mb-1.5 flex items-center"><FileText className="h-4 w-4 mr-2"/>Engagement Notes</h4>
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{lead.engagementNotes}</p>
                  </div>
                )}

                {lead.resumeUrl && (
                  <div className="md:col-span-2 mt-3 pt-3 border-t border-slate-700/50">
                    <h4 className="text-sm font-semibold text-slate-300 mb-1.5 flex items-center"><FileUp className="h-4 w-4 mr-2"/>Resume</h4>
                    <a href={lead.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">
                        View Resume ({lead.resumeUrl.substring(lead.resumeUrl.lastIndexOf('-') + 1)})
                    </a>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="ai_insights" className="mt-0">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                 <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold flex items-center text-purple-300">
                      <Brain className="h-6 w-6 mr-2" />
                      AI Scoring & Attributes
                    </h3>
                    <Button onClick={handleRescore} disabled={isScoring} size="sm" className="bg-purple-600 hover:bg-purple-700">
                      {isScoring ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"/> : <><Zap className="h-4 w-4 mr-2"/>Re-score</>}
                    </Button>
                  </div>

                {lead.aiExplanation ? (
                  <div className="bg-slate-800/70 rounded-lg p-4 shadow-inner">
                    <pre className="text-sm whitespace-pre-wrap font-mono text-slate-200">{lead.aiExplanation}</pre>
                    {lead.lastScoredAt && <p className="text-xs text-slate-400 mt-3">Last scored: {new Date(lead.lastScoredAt).toLocaleString()}</p>}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">This lead hasn't been scored by AI yet.</div>
                )}
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded"><span className="text-slate-300">Quick Form Submit:</span> <Badge variant={lead.formSubmittedWithin60s ? 'default' : 'secondary'}>{lead.formSubmittedWithin60s ? 'Yes' : 'No'}</Badge></div>
                    <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded"><span className="text-slate-300">Appointment Scheduled:</span> <Badge variant={lead.appointmentScheduled ? 'default' : 'secondary'}>{lead.appointmentScheduled ? 'Yes' : 'No'}</Badge></div>
                    <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded"><span className="text-slate-300">Responded to Follow-up:</span> <Badge variant={lead.respondedToFollowup ? 'default' : 'secondary'}>{lead.respondedToFollowup ? 'Yes' : 'No'}</Badge></div>
                    <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded"><span className="text-slate-300">No Response (3+ days):</span> <Badge variant={lead.noResponse3Days ? 'destructive' : 'default'}>{lead.noResponse3Days ? 'Yes' : 'No'}</Badge></div>
                    <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded"><span className="text-slate-300">Contact Frequency:</span> <Badge variant="secondary">{lead.contactFrequency || 0}</Badge></div>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="activity" className="mt-0">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <h3 className="text-xl font-semibold text-blue-300 mb-3">Activity Timeline</h3>
                    {(lead.activityTimeline && lead.activityTimeline.length > 0) ? (
                        lead.activityTimeline.slice().reverse().map((activity, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 bg-slate-800/50 rounded-md">
                                <div className="mt-1 p-1.5 bg-slate-700 rounded-full">
                                    <Activity size={16} className="text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-200 font-medium">{activity.action}</p>
                                    <p className="text-xs text-slate-400">By {activity.user} on {new Date(activity.timestamp).toLocaleString()}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-400 text-center py-4">No activity recorded yet.</p>
                    )}
                </motion.div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}