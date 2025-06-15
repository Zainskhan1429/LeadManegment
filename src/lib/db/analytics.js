import { getLeads } from '@/lib/db/leads';
import { getAppointments } from '@/lib/db/appointments';
import { getFeedback } from '@/lib/db/feedback';
import { LEAD_SCORES } from '@/lib/constants';

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
        : "N/A",
      totalFeedback: feedback.length
    }
  };
};