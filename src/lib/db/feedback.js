import { logAudit } from '@/lib/db/auditLogs';
import { AUDIT_ACTIONS } from '@/lib/constants';

export const getFeedback = () => {
  return JSON.parse(localStorage.getItem('feedback') || '[]');
};

export const createFeedback = (feedbackData) => {
  const feedbackList = getFeedback();
  const newFeedback = {
    id: Date.now().toString(),
    ...feedbackData,
    createdAt: new Date().toISOString()
  };
  
  feedbackList.push(newFeedback);
  localStorage.setItem('feedback', JSON.stringify(feedbackList));
  
  logAudit(AUDIT_ACTIONS.CREATE_FEEDBACK, `Added feedback for lead ${feedbackData.leadId}`);
  
  return newFeedback;
};