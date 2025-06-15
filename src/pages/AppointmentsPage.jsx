
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Clock, User, Briefcase, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { getAppointments, updateAppointment, createAppointment } from '@/lib/db/appointments';
import { APPOINTMENT_STATUS } from '@/lib/constants';
import { getLeads } from '@/lib/db/leads'; 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AUTH_ROLES } from '@/lib/auth';

export function AppointmentsPage({ user }) {
  const [appointments, setAppointments] = useState([]);
  const [leads, setLeads] = useState([]);
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadAppointments();
    loadLeads();
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const assignable = allUsers.filter(u => 
      [AUTH_ROLES.SALES_AGENT, AUTH_ROLES.TEAM_MANAGER, AUTH_ROLES.ADMIN].includes(u.role)
    );
    setAssignableUsers(assignable);
  }, []);

  const loadAppointments = () => {
    const allAppointments = getAppointments();
    setAppointments(allAppointments.sort((a,b) => new Date(b.datetime) - new Date(a.datetime)));
  };

  const loadLeads = () => {
    const allLeads = getLeads();
    setLeads(allLeads);
  };

  const handleOpenCreateModal = (appointment = null) => {
    if (appointment) {
      setCurrentAppointment({
        ...appointment,
        datetime: new Date(appointment.datetime).toISOString().substring(0, 16)
      });
      setIsEditing(true);
    } else {
      setCurrentAppointment({
        title: '',
        leadId: '',
        datetime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString().substring(0, 16), // Default to 1 hour from now
        notes: '',
        status: APPOINTMENT_STATUS.PENDING,
        assignedTo: user.id 
      });
      setIsEditing(false);
    }
    setShowCreateModal(true);
  };
  
  const handleCloseModal = () => {
    setShowCreateModal(false);
    setCurrentAppointment(null);
    setIsEditing(false);
  };

  const handleSaveAppointment = () => {
    if (!currentAppointment.title || !currentAppointment.leadId || !currentAppointment.datetime || !currentAppointment.assignedTo) {
        toast({ title: "Missing Fields", description: "Please fill in all required fields.", variant: "destructive" });
        return;
    }

    const appointmentData = {
        ...currentAppointment,
        leadName: getLeadName(currentAppointment.leadId) // Add leadName for display
    };

    if (isEditing) { 
        updateAppointment(currentAppointment.id, appointmentData); 
        toast({ title: "Appointment Updated", description: "Changes saved successfully."});
    } else { 
        createAppointment(appointmentData); 
        toast({ title: "Appointment Created", description: "New appointment scheduled."});
    }
    loadAppointments();
    handleCloseModal();
  };
  
  const handleDeleteAppointment = (appointmentId) => {
     toast({ title: "Delete Appointment", description: "🚧 This feature requires confirmation and is not fully implemented. You can request it next! 🚀"});
     // Mock deletion for now:
     // const updatedAppointments = appointments.filter(apt => apt.id !== appointmentId);
     // localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
     // setAppointments(updatedAppointments);
     // toast({ title: "Appointment Deleted (Mock)", variant: "destructive"});
  }

  const getBadgeVariant = (status) => {
    if (status === APPOINTMENT_STATUS.COMPLETED) return 'default'; 
    if (status === APPOINTMENT_STATUS.PENDING) return 'secondary';
    if (status === APPOINTMENT_STATUS.CANCELLED) return 'destructive';
    if (status === APPOINTMENT_STATUS.RESCHEDULED) return 'outline'; 
    return 'secondary';
  };
  
  const getLeadName = (leadId) => leads.find(l => l.id === leadId)?.name || 'Unknown Lead';
  const getAssigneeName = (userId) => assignableUsers.find(u => u.id === userId)?.name || user.name;


  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg shadow-md">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Appointments</h1>
            <p className="text-muted-foreground text-sm md:text-base">Manage your scheduled meetings and events.</p>
          </div>
        </div>
        <Button onClick={() => handleOpenCreateModal()} className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-lg text-sm">
          <Plus className="h-4 w-4 mr-2" /> New Appointment
        </Button>
      </motion.div>

      {appointments.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-center py-16">
          <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h3 className="text-xl font-semibold mb-2">No Appointments Yet</h3>
          <p className="text-muted-foreground mb-6">Your calendar is clear! Schedule a new appointment to get started.</p>
          <Button onClick={() => handleOpenCreateModal()} className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-sm">
            <Plus className="h-4 w-4 mr-2" /> Schedule First Appointment
          </Button>
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {appointments.map((apt, index) => (
            <motion.div layout key={apt.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }} whileHover={{ y: -3, boxShadow: "0px 8px 15px rgba(0,0,0,0.15)"}}>
              <Card className="glass-card border-slate-700/50 hover:border-green-500/70 transition-all duration-300 flex flex-col h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-slate-100">{apt.title}</CardTitle>
                    <Badge variant={getBadgeVariant(apt.status)} className="text-xs px-2 py-0.5">{apt.status}</Badge>
                  </div>
                   <p className="text-xs text-slate-400 flex items-center"><Briefcase size={14} className="mr-1.5"/> With: {getLeadName(apt.leadId)}</p>
                </CardHeader>
                <CardContent className="space-y-2 text-sm flex-grow">
                    <div className="flex items-center text-slate-300"><Clock size={14} className="mr-1.5 text-slate-500"/> {new Date(apt.datetime).toLocaleString([], {dateStyle: 'medium', timeStyle: 'short'})}</div>
                    <div className="flex items-center text-slate-300"><User size={14} className="mr-1.5 text-slate-500"/> Assigned to: {getAssigneeName(apt.assignedTo)}</div>
                    {apt.notes && <p className="text-slate-300 line-clamp-2 pt-1">Notes: {apt.notes}</p>}
                </CardContent>
                <CardFooter className="border-t border-slate-700/50 pt-3 flex justify-end space-x-2">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-blue-400" onClick={() => handleOpenCreateModal(apt)}><Edit size={16}/></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-red-400" onClick={() => handleDeleteAppointment(apt.id)}><Trash2 size={16}/></Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {/* Create/Edit Modal */}
      <Dialog open={showCreateModal} onOpenChange={handleCloseModal}>
        <DialogContent className="glass-card border-slate-700/50">
            <DialogHeader>
                <DialogTitle>{isEditing ? "Edit Appointment" : "Create New Appointment"}</DialogTitle>
            </DialogHeader>
            {currentAppointment && (
                <div className="space-y-4 py-2">
                    <div>
                        <Label htmlFor="apt-title">Title *</Label>
                        <Input id="apt-title" value={currentAppointment.title} onChange={e => setCurrentAppointment({...currentAppointment, title: e.target.value})} placeholder="e.g. Product Demo Call" />
                    </div>
                    <div>
                        <Label htmlFor="apt-lead">Lead *</Label>
                        <Select value={currentAppointment.leadId} onValueChange={val => setCurrentAppointment({...currentAppointment, leadId: val})}>
                            <SelectTrigger><SelectValue placeholder="Select a lead" /></SelectTrigger>
                            <SelectContent>
                                {leads.map(lead => <SelectItem key={lead.id} value={lead.id}>{lead.name} ({lead.company})</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="apt-datetime">Date & Time *</Label>
                        <Input id="apt-datetime" type="datetime-local" value={currentAppointment.datetime} onChange={e => setCurrentAppointment({...currentAppointment, datetime: e.target.value})} />
                    </div>
                     <div>
                        <Label htmlFor="apt-assignedTo">Assigned To *</Label>
                        <Select value={currentAppointment.assignedTo} onValueChange={val => setCurrentAppointment({...currentAppointment, assignedTo: val})}>
                            <SelectTrigger><SelectValue placeholder="Assign to..." /></SelectTrigger>
                            <SelectContent>
                                {assignableUsers.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="apt-status">Status</Label>
                         <Select value={currentAppointment.status} onValueChange={val => setCurrentAppointment({...currentAppointment, status: val})}>
                            <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                            <SelectContent>
                                {Object.values(APPOINTMENT_STATUS).map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="apt-notes">Notes</Label>
                        <Textarea id="apt-notes" value={currentAppointment.notes} onChange={e => setCurrentAppointment({...currentAppointment, notes: e.target.value})} placeholder="Add meeting agenda, location, or any relevant details." />
                    </div>
                </div>
            )}
            <DialogFooter>
                <Button variant="outline" onClick={handleCloseModal}>Cancel</Button>
                <Button onClick={handleSaveAppointment} className="bg-blue-600 hover:bg-blue-700">{isEditing ? "Save Changes" : "Create Appointment"}</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
