import { getLeads } from '@/lib/db/leads';
import { getAppointments } from '@/lib/db/appointments';
import { getNotifications } from '@/lib/db/notifications';
import { LEAD_SOURCES, LEAD_SCORES, APPOINTMENT_STATUS, NOTIFICATION_TYPES } from '@/lib/constants';

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
        assignedTo: '3', 
        resumeUrl: null,
        activityTimeline: [{ action: 'Lead Created', timestamp: new Date().toISOString(), user: 'System' }],
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
        assignedTo: '3',
        resumeUrl: null,
        activityTimeline: [{ action: 'Lead Created', timestamp: new Date().toISOString(), user: 'System' }],
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
        assignedTo: null,
        resumeUrl: null,
        activityTimeline: [{ action: 'Lead Created', timestamp: new Date().toISOString(), user: 'System' }],
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
        assignedTo: '3',
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