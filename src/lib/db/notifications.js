import { NOTIFICATION_TYPES } from '@/lib/constants';

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
  
  notifications.unshift(newNotification);
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