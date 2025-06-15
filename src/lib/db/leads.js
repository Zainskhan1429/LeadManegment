import { logAudit } from '@/lib/db/auditLogs';
import { createNotification } from '@/lib/db/notifications';
import { LEAD_SCORES, LEAD_SOURCES, NOTIFICATION_TYPES, AUDIT_ACTIONS } from '@/lib/constants';

export const getLeads = () => {
  return JSON.parse(localStorage.getItem('leads') || '[]');
};

export const getLeadById = (id) => {
  const leads = getLeads();
  return leads.find(lead => lead.id === id) || null;
};

export const createLead = (leadData) => {
  const leads = getLeads();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const newLead = {
    id: Date.now().toString(),
    ...leadData,
    leadScore: LEAD_SCORES.COLD,
    aiExplanation: '',
    assignedTo: leadData.assignedTo || null,
    resumeUrl: null,
    activityTimeline: [{
      action: 'Lead Created',
      timestamp: new Date().toISOString(),
      user: currentUser.name || 'System'
    }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  leads.push(newLead);
  localStorage.setItem('leads', JSON.stringify(leads));
  
  logAudit(AUDIT_ACTIONS.CREATE_LEAD, `Created lead: ${newLead.name}`);
  
  return newLead;
};

export const updateLead = (id, updates) => {
  const leads = getLeads();
  const index = leads.findIndex(lead => lead.id === id);
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  if (index !== -1) {
    const oldLead = { ...leads[index] };
    leads[index] = {
      ...leads[index],
      ...updates,
      activityTimeline: [
        ...(leads[index].activityTimeline || []),
        {
          action: `Lead Updated: ${Object.keys(updates).join(', ')} changed`,
          timestamp: new Date().toISOString(),
          user: currentUser.name || 'System'
        }
      ],
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('leads', JSON.stringify(leads));
    
    logAudit(AUDIT_ACTIONS.UPDATE_LEAD, `Updated lead: ${leads[index].name}`);
    
    return leads[index];
  }
  
  return null;
};

export const deleteLead = (id) => {
  const leads = getLeads();
  const leadToDelete = leads.find(lead => lead.id === id);
  const filteredLeads = leads.filter(lead => lead.id !== id);
  
  localStorage.setItem('leads', JSON.stringify(filteredLeads));
  
  if (leadToDelete) {
    logAudit(AUDIT_ACTIONS.DELETE_LEAD, `Deleted lead: ${leadToDelete.name}`);
  }
  
  return true;
};

export const scoreLeadWithAI = (leadId) => {
  const lead = getLeadById(leadId);
  
  if (!lead) return null;
  
  let score = 0;
  const reasons = [];
  
  if (lead.formSubmittedWithin60s) { score += 3; reasons.push('+3: Quick form submission'); }
  if (lead.engagementNotes && lead.engagementNotes.split(' ').length > 20) { score += 2; reasons.push('+2: Detailed engagement notes'); }
  if (['gym', 'salon', 'clinic'].some(type => lead.businessType?.toLowerCase().includes(type))) { score += 2; reasons.push('+2: High-value business type'); }
  if ([LEAD_SOURCES.REFERRAL, LEAD_SOURCES.INSTAGRAM_DM].includes(lead.leadSource)) { score += 1; reasons.push('+1: Quality lead source'); }
  if (lead.appointmentScheduled) { score += 1; reasons.push('+1: Appointment scheduled'); }
  if (lead.respondedToFollowup) { score += 1; reasons.push('+1: Responded to follow-up'); }
  if (lead.noResponse3Days) { score -= 2; reasons.push('-2: No response (3+ days)'); }
  if (!lead.phone || !lead.email) { score -= 1; reasons.push('-1: Missing contact info'); }

  // Additional scoring logic from prompt
  if (lead.contactFrequency && lead.contactFrequency > 3) { score += 1; reasons.push('+1: High contact frequency'); }
  if (lead.companySize && lead.companySize === 'Enterprise') { score += 2; reasons.push('+2: Enterprise company size'); }
  else if (lead.companySize && lead.companySize === 'Medium') { score += 1; reasons.push('+1: Medium company size'); }


  let leadScore;
  if (score >= 7) leadScore = LEAD_SCORES.HOT;
  else if (score >= 3) leadScore = LEAD_SCORES.WARM;
  else leadScore = LEAD_SCORES.COLD;
  
  const aiExplanation = `AI Score: ${score}/12\n\nFactors considered:\n${reasons.join('\n')}`;
  
  const updatedLead = updateLead(leadId, {
    leadScore,
    aiExplanation,
    lastScoredAt: new Date().toISOString()
  });
  
  createNotification({
    type: NOTIFICATION_TYPES.AI_UPDATE,
    title: 'Lead Scored',
    message: `${lead.name} scored as ${leadScore}`,
    leadId
  });
  logAudit(AUDIT_ACTIONS.SCORE_LEAD, `AI Scored lead ${lead.name} as ${leadScore}`);
  
  return updatedLead;
};

export const uploadResumeForLead = (leadId, resumeUrl) => {
  const lead = getLeadById(leadId);
  if (!lead) return null;

  const updatedLead = updateLead(leadId, { resumeUrl });
  logAudit(AUDIT_ACTIONS.UPLOAD_RESUME, `Uploaded resume for lead ${lead.name}`);
  return updatedLead;
};