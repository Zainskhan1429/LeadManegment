import { logAudit } from '@/lib/db/auditLogs';
import { APPOINTMENT_STATUS, AUDIT_ACTIONS } from '@/lib/constants';

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
  
  logAudit(AUDIT_ACTIONS.CREATE_APPOINTMENT, `Created appointment for ${appointmentData.leadName}`);
  
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
    
    logAudit(AUDIT_ACTIONS.UPDATE_APPOINTMENT, `Updated appointment ${id} status to ${updates.status}`);
    
    return appointments[index];
  }
  
  return null;
};