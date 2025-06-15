import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Upload, User, Briefcase, Phone, Mail, Users as TeamIcon, Info, Tag, Workflow, Activity, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/components/ui/use-toast';
import { createLead } from '@/lib/db/leads';
import { LEAD_SOURCES, LEAD_STATUS } from '@/lib/constants';
import { AUTH_ROLES } from '@/lib/auth';
import confetti from 'canvas-confetti';

export function CreateLeadModal({ isOpen, onClose, onLeadCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    businessType: '',
    leadSource: Object.values(LEAD_SOURCES)[0],
    status: Object.values(LEAD_STATUS)[0],
    priority: 'Medium', // Default priority
    engagementNotes: '',
    assignedTo: '', 
    formSubmittedWithin60s: false,
    appointmentScheduled: false,
    respondedToFollowup: false,
    noResponse3Days: false,
    companySize: 'Small', // Default company size
    contactFrequency: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      // Fetch users who can be assigned leads (Sales Agents, Managers, Admins)
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const assignableUsers = allUsers.filter(u => 
        [AUTH_ROLES.SALES_AGENT, AUTH_ROLES.TEAM_MANAGER, AUTH_ROLES.ADMIN].includes(u.role)
      );
      setUsers(assignableUsers);
      
      // Reset form on open
      setFormData({
        name: '', email: '', phone: '', company: '', businessType: '',
        leadSource: Object.values(LEAD_SOURCES)[0], status: Object.values(LEAD_STATUS)[0], priority: 'Medium',
        engagementNotes: '', assignedTo: '', formSubmittedWithin60s: false,
        appointmentScheduled: false, respondedToFollowup: false, noResponse3Days: false,
        companySize: 'Small', contactFrequency: 0
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newLead = createLead(formData);
      
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 }, zIndex: 9999 });

      toast({
        title: "Lead Created Successfully! 🎉",
        description: `${newLead.name} from ${newLead.company} is now in the pipeline.`,
        className: "bg-green-600 text-white border-green-700",
      });

      onLeadCreated(newLead);
      onClose();
    } catch (error) {
      toast({
        title: "Error Creating Lead",
        description: error.message || "Failed to create lead. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Mock file upload: in a real app, this would upload to Supabase Storage or similar
      const resumeUrl = `mock-resume-${Date.now()}-${file.name}`; 
      setFormData(prev => ({ ...prev, resumeUrl }));
      toast({
        title: "Resume 'Uploaded'",
        description: `${file.name} is ready (mock). Integrate storage for real uploads.`,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[95vh] glass-card border-slate-700/50 overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <Plus className="h-7 w-7 mr-3 text-blue-400" />
            Create New Lead
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Basic Info */}
            <div className="md:col-span-2 font-semibold text-lg text-blue-300 border-b border-slate-700 pb-2 mb-2 flex items-center"><Info size={20} className="mr-2"/>Basic Information</div>
            <div className="space-y-1.5">
              <Label htmlFor="name" className="flex items-center"><User size={14} className="mr-1.5"/>Full Name *</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter full name" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="company" className="flex items-center"><Briefcase size={14} className="mr-1.5"/>Company *</Label>
              <Input id="company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} placeholder="Enter company name" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="flex items-center"><Mail size={14} className="mr-1.5"/>Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Enter email address" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="flex items-center"><Phone size={14} className="mr-1.5"/>Phone</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Enter phone number" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="businessType" className="flex items-center"><Briefcase size={14} className="mr-1.5"/>Business Type</Label>
              <Input id="businessType" value={formData.businessType} onChange={(e) => setFormData({ ...formData, businessType: e.target.value })} placeholder="e.g., SaaS, Gym, Agency" />
            </div>
             <div className="space-y-1.5">
              <Label htmlFor="companySize" className="flex items-center"><TeamIcon size={14} className="mr-1.5"/>Company Size</Label>
              <Select value={formData.companySize} onValueChange={(value) => setFormData({ ...formData, companySize: value })}>
                <SelectTrigger><SelectValue placeholder="Select company size" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Small">Small (1-50)</SelectItem>
                  <SelectItem value="Medium">Medium (51-200)</SelectItem>
                  <SelectItem value="Large">Large (201-1000)</SelectItem>
                  <SelectItem value="Enterprise">Enterprise (1000+)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Lead Details */}
            <div className="md:col-span-2 font-semibold text-lg text-purple-300 border-b border-slate-700 pb-2 mb-2 mt-4 flex items-center"><Tag size={20} className="mr-2"/>Lead Details</div>
            <div className="space-y-1.5">
              <Label htmlFor="leadSource" className="flex items-center"><Workflow size={14} className="mr-1.5"/>Lead Source</Label>
              <Select value={formData.leadSource} onValueChange={(value) => setFormData({ ...formData, leadSource: value })}>
                <SelectTrigger><SelectValue placeholder="Select lead source" /></SelectTrigger>
                <SelectContent>{Object.values(LEAD_SOURCES).map((source) => (<SelectItem key={source} value={source}>{source}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="status" className="flex items-center"><Activity size={14} className="mr-1.5"/>Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger><SelectValue placeholder="Select lead status" /></SelectTrigger>
                <SelectContent>{Object.values(LEAD_STATUS).map((status) => (<SelectItem key={status} value={status}>{status}</SelectItem>))}</SelectContent>
              </Select>
            </div>
             <div className="space-y-1.5">
              <Label htmlFor="priority" className="flex items-center"><Info size={14} className="mr-1.5"/>Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="assignedTo" className="flex items-center"><TeamIcon size={14} className="mr-1.5"/>Assign To</Label>
              <Select value={formData.assignedTo} onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}>
                <SelectTrigger><SelectValue placeholder="Assign to a team member" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {users.map(user => (<SelectItem key={user.id} value={user.id}>{user.name} ({user.role})</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-1.5 mt-4">
            <Label htmlFor="engagementNotes" className="flex items-center"><Activity size={14} className="mr-1.5"/>Engagement Notes</Label>
            <Textarea id="engagementNotes" value={formData.engagementNotes} onChange={(e) => setFormData({ ...formData, engagementNotes: e.target.value })} placeholder="Log initial contact, key discussion points, next steps..." rows={3} />
          </div>

          {/* AI Scoring Attributes */}
          <div className="md:col-span-2 font-semibold text-lg text-teal-300 border-b border-slate-700 pb-2 mb-2 mt-4 flex items-center"><Brain size={20} className="mr-2"/>AI Scoring Attributes</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="flex items-center space-x-2">
                <Checkbox id="formSubmittedWithin60s" checked={formData.formSubmittedWithin60s} onCheckedChange={(checked) => setFormData({ ...formData, formSubmittedWithin60s: checked })} />
                <Label htmlFor="formSubmittedWithin60s" className="text-sm font-normal cursor-pointer">Quick Form Submit (within 60s)</Label>
             </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="appointmentScheduled" checked={formData.appointmentScheduled} onCheckedChange={(checked) => setFormData({ ...formData, appointmentScheduled: checked })} />
                <Label htmlFor="appointmentScheduled" className="text-sm font-normal cursor-pointer">Appointment Scheduled</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="respondedToFollowup" checked={formData.respondedToFollowup} onCheckedChange={(checked) => setFormData({ ...formData, respondedToFollowup: checked })} />
                <Label htmlFor="respondedToFollowup" className="text-sm font-normal cursor-pointer">Responded to Follow-up</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="noResponse3Days" checked={formData.noResponse3Days} onCheckedChange={(checked) => setFormData({ ...formData, noResponse3Days: checked })} />
                <Label htmlFor="noResponse3Days" className="text-sm font-normal cursor-pointer">No Response (3+ days)</Label>
            </div>
             <div className="space-y-1.5">
                <Label htmlFor="contactFrequency" className="text-sm font-normal">Contact Frequency (Initial)</Label>
                <Input id="contactFrequency" type="number" value={formData.contactFrequency} onChange={(e) => setFormData({...formData, contactFrequency: parseInt(e.target.value, 10) || 0})} placeholder="e.g. 1" min="0" />
            </div>
          </div>

          <div className="space-y-1.5 mt-4">
            <Label htmlFor="resumeUpload" className="flex items-center"><Upload size={14} className="mr-1.5"/>Resume Upload (Optional)</Label>
            <Input id="resumeUpload" type="file" onChange={handleFileUpload} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            {formData.resumeUrl && <p className="text-xs text-green-400">Mock resume attached: {formData.resumeUrl}</p>}
          </div>

          <DialogFooter className="pt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              {isLoading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <><Plus className="h-4 w-4 mr-2" /> Create Lead</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}