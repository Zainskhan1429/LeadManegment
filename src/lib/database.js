// Mock database operations using localStorage
export const LEAD_SCORES = {
  HOT: 'Hot',
  WARM: 'Warm',
  COLD: 'Cold'
};

export const LEAD_SOURCES = {
  WEBSITE: 'Website',
  REFERRAL: 'Referral',
  INSTAGRAM_DM: 'Instagram DM',
  FACEBOOK: 'Facebook',
  GOOGLE_ADS: 'Google Ads',
  OTHER: 'Other'
};

export const APPOINTMENT_STATUS = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  RESCHEDULED: 'Rescheduled'
};

export const NOTIFICATION_TYPES = {
  SYSTEM: 'System',
  TASK: 'Task',
  REMINDER: 'Reminder',
  AI_UPDATE: 'AI Update'
};

// Lead operations
export const getLeads = () => {
  return JSON.parse(localStorage.getItem('leads') || '[]');
};

export const createLead = (leadData) => {
  const leads = getLeads();
  const newLead = {
    id: Date.now().toString(),
    ...leadData,
    leadScore: LEAD_SCORES.COLD,
    aiExplanation: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  leads.push(newLead);
  localStorage.setItem('leads', JSON.stringify(leads));
  
  // Log audit
  logAudit('CREATE_LEAD', `Created lead: ${newLead.name}`);
  
  return newLead;
};

export const updateLead = (id, updates) => {
  const leads = getLeads();
  const index = leads.findIndex(lead => lead.id === id);
  
  if (index !== -1) {
    leads[index] = {
      ...leads[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('leads', JSON.stringify(leads));
    
    // Log audit
    logAudit('UPDATE_LEAD', `Updated lead: ${leads[index].name}`);
    
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
    logAudit('DELETE_LEAD', `Deleted lead: ${leadToDelete.name}`);
  }
  
  return true;
};

// AI Scoring Logic
export const scoreLeadWithAI = (leadId) => {
  const leads = getLeads();
  const lead = leads.find(l => l.id === leadId);
  
  if (!lead) return null;
  
  let score = 0;
  const reasons = [];
  
  // Scoring rules
  if (lead.formSubmittedWithin60s) {
    score += 3;
    reasons.push('+3: Quick form submission (within 60s)');
  }
  
  if (lead.engagementNotes && lead.engagementNotes.split(' ').length > 20) {
    score += 2;
    reasons.push('+2: Detailed engagement notes');
  }
  
  if (['gym', 'salon', 'clinic'].some(type => 
    lead.businessType?.toLowerCase().includes(type))) {
    score += 2;
    reasons.push('+2: High-value business type');
  }
  
  if ([LEAD_SOURCES.REFERRAL, LEAD_SOURCES.INSTAGRAM_DM].includes(lead.leadSource)) {
    score += 1;
    reasons.push('+1: Quality lead source');
  }
  
  if (lead.appointmentScheduled) {
    score += 1;
    reasons.push('+1: Appointment scheduled');
  }
  
  if (lead.respondedToFollowup) {
    score += 1;
    reasons.push('+1: Responded to follow-up');
  }
  
  if (lead.noResponse3Days) {
    score -= 2;
    reasons.push('-2: No response for 3+ days');
  }
  
  if (!lead.phone || !lead.email) {
    score -= 1;
    reasons.push('-1: Missing contact information');
  }
  
  // Determine lead score
  let leadScore;
  if (score >= 5) leadScore = LEAD_SCORES.HOT;
  else if (score >= 2) leadScore = LEAD_SCORES.WARM;
  else leadScore = LEAD_SCORES.COLD;
  
  const aiExplanation = `AI Score: ${score}/10\n\nFactors considered:\n${reasons.join('\n')}`;
  
  // Update lead with new score
  const updatedLead = updateLead(leadId, {
    leadScore,
    aiExplanation,
    lastScoredAt: new Date().toISOString()
  });
  
  // Create notification
  createNotification({
    type: NOTIFICATION_TYPES.AI_UPDATE,
    title: 'Lead Scored',
    message: `${lead.name} scored as ${leadScore}`,
    leadId
  });
  
  return updatedLead;
};

// Appointment operations
export const getAppointments = () => {
  return JSON.parse(localStorage.getItem('appointments') || '[]');
};

export const createAppointment = (appointmentData) => {
  const appointments = getAppointments();
  const newAppointment = {
    id: Date.now().toString(),
    ...appointmentData,
    status: APPOINTMENT_STATUS.PENDING,
    createdAt: new Date().toISOString()
  };
  
  appointments.push(newAppointment);
  localStorage.setItem('appointments', JSON.stringify(appointments));
  
  logAudit('CREATE_APPOINTMENT', `Created appointment for ${appointmentData.leadName}`);
  
  return newAppointment;
};

export const updateAppointment = (id, updates) => {
  const appointments = getAppointments();
  const index = appointments.findIndex(apt => apt.id === id);
  
  if (index !== -1) {
    appointments[index] = {
      ...appointments[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    logAudit('UPDATE_APPOINTMENT', `Updated appointment status to ${updates.status}`);
    
    return appointments[index];
  }
  
  return null;
};

// Feedback operations
export const getFeedback = () => {
  return JSON.parse(localStorage.getItem('feedback') || '[]');
};

export const createFeedback = (feedbackData) => {
  const feedback = getFeedback();
  const newFeedback = {
    id: Date.now().toString(),
    ...feedbackData,
    createdAt: new Date().toISOString()
  };
  
  feedback.push(newFeedback);
  localStorage.setItem('feedback', JSON.stringify(feedback));
  
  logAudit('CREATE_FEEDBACK', `Added feedback for lead ${feedbackData.leadId}`);
  
  return newFeedback;
};

// Notification operations
export const getNotifications = () => {
  return JSON.parse(localStorage.getItem('notifications') || '[]');
};

export const createNotification = (notificationData) => {
  const notifications = getNotifications();
  const newNotification = {
    id: Date.now().toString(),
    ...notificationData,
    read: false,
    createdAt: new Date().toISOString()
  };
  
  notifications.unshift(newNotification); // Add to beginning
  localStorage.setItem('notifications', JSON.stringify(notifications));
  
  return newNotification;
};

export const markNotificationAsRead = (id) => {
  const notifications = getNotifications();
  const index = notifications.findIndex(n => n.id === id);
  
  if (index !== -1) {
    notifications[index].read = true;
    localStorage.setItem('notifications', JSON.stringify(notifications));
    return notifications[index];
  }
  
  return null;
};

// Audit log operations
export const getAuditLogs = () => {
  return JSON.parse(localStorage.getItem('auditLogs') || '[]');
};

export const logAudit = (action, description, userId = null) => {
  const auditLogs = getAuditLogs();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  const newLog = {
    id: Date.now().toString(),
    actionPerformed: action,
    description,
    performedBy: userId || currentUser.id || 'system',
    performedByName: currentUser.name || 'System',
    timestamp: new Date().toISOString()
  };
  
  auditLogs.unshift(newLog); // Add to beginning
  localStorage.setItem('auditLogs', JSON.stringify(auditLogs));
  
  return newLog;
};

// Analytics operations
export const getAnalytics = () => {
  const leads = getLeads();
  const appointments = getAppointments();
  const feedback = getFeedback();
  
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  return {
    leadCounts: {
      hot: leads.filter(l => l.leadScore === LEAD_SCORES.HOT).length,
      warm: leads.filter(l => l.leadScore === LEAD_SCORES.WARM).length,
      cold: leads.filter(l => l.leadScore === LEAD_SCORES.COLD).length,
      total: leads.length
    },
    appointmentCounts: {
      thisWeek: appointments.filter(a => new Date(a.createdAt) >= weekAgo).length,
      thisMonth: appointments.filter(a => new Date(a.createdAt) >= monthAgo).length,
      total: appointments.length
    },
    feedbackStats: {
      averageRating: feedback.length > 0 
        ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
        : 0,
      totalFeedback: feedback.length
    }
  };
};

// Initialize demo data
export const initializeDemoData = () => {
  const existingLeads = localStorage.getItem('leads');
  if (!existingLeads) {
    const demoLeads = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+1-555-0123',
        company: 'FitLife Gym',
        businessType: 'gym',
        leadSource: LEAD_SOURCES.REFERRAL,
        engagementNotes: 'Very interested in our premium package. Asked detailed questions about pricing and implementation timeline. Seems ready to move forward.',
        leadScore: LEAD_SCORES.HOT,
        aiExplanation: 'AI Score: 7/10\n\nFactors considered:\n+2: High-value business type\n+1: Quality lead source\n+2: Detailed engagement notes\n+1: Responded to follow-up\n+1: Appointment scheduled',
        formSubmittedWithin60s: false,
        appointmentScheduled: true,
        respondedToFollowup: true,
        noResponse3Days: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Mike Chen',
        email: 'mike@techstartup.com',
        phone: '+1-555-0124',
        company: 'TechStartup Inc',
        businessType: 'technology',
        leadSource: LEAD_SOURCES.WEBSITE,
        engagementNotes: 'Interested but needs to discuss with team first.',
        leadScore: LEAD_SCORES.WARM,
        aiExplanation: 'AI Score: 3/10\n\nFactors considered:\n+2: Detailed engagement notes\n+1: Responded to follow-up',
        formSubmittedWithin60s: false,
        appointmentScheduled: false,
        respondedToFollowup: true,
        noResponse3Days: false,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Emma Davis',
        email: 'emma@beautysalon.com',
        phone: '',
        company: 'Luxe Beauty Salon',
        businessType: 'salon',
        leadSource: LEAD_SOURCES.INSTAGRAM_DM,
        engagementNotes: 'Initial inquiry about services.',
        leadScore: LEAD_SCORES.COLD,
        aiExplanation: 'AI Score: 2/10\n\nFactors considered:\n+2: High-value business type\n+1: Quality lead source\n-1: Missing contact information',
        formSubmittedWithin60s: false,
        appointmentScheduled: false,
        respondedToFollowup: false,
        noResponse3Days: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('leads', JSON.stringify(demoLeads));
  }
  
  const existingAppointments = localStorage.getItem('appointments');
  if (!existingAppointments) {
    const demoAppointments = [
      {
        id: '1',
        leadId: '1',
        leadName: 'Sarah Johnson',
        title: 'Product Demo',
        datetime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: APPOINTMENT_STATUS.PENDING,
        notes: 'Demo of premium features',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('appointments', JSON.stringify(demoAppointments));
  }
  
  const existingNotifications = localStorage.getItem('notifications');
  if (!existingNotifications) {
    const demoNotifications = [
      {
        id: '1',
        type: NOTIFICATION_TYPES.AI_UPDATE,
        title: 'Lead Scored',
        message: 'Sarah Johnson scored as Hot',
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        type: NOTIFICATION_TYPES.REMINDER,
        title: 'Appointment Reminder',
        message: 'Product demo with Sarah Johnson tomorrow',
        read: false,
        createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
      }
    ];
    localStorage.setItem('notifications', JSON.stringify(demoNotifications));
  }
};