
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Users, Zap, ListFilter, LayoutGrid, SlidersHorizontal, User as UserIcon, Activity as ActivityIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { LeadCard } from '@/components/leads/LeadCard';
import { LeadModal } from '@/components/leads/LeadModal';
import { CreateLeadModal } from '@/components/leads/CreateLeadModal';
import { getLeads, deleteLead, scoreLeadWithAI } from '@/lib/db/leads';
import { LEAD_SCORES, LEAD_SOURCES, LEAD_STATUS } from '@/lib/constants';
import { AUTH_ROLES } from '@/lib/auth';

export function LeadsPage({ user }) {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    score: 'all',
    status: 'all',
    source: 'all',
    assignedTo: 'all',
  });
  const [sortOption, setSortOption] = useState('createdAt_desc');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [assignableUsers, setAssignableUsers] = useState([]);

  const { toast } = useToast();

  useEffect(() => {
    loadLeads();
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const assignable = allUsers.filter(u => 
      [AUTH_ROLES.SALES_AGENT, AUTH_ROLES.TEAM_MANAGER, AUTH_ROLES.ADMIN].includes(u.role)
    );
    setAssignableUsers(assignable);
  }, []);

  const loadLeads = () => {
    const allLeads = getLeads();
    setLeads(allLeads);
  };
  
  const filteredAndSortedLeads = useMemo(() => {
    let processedLeads = [...leads];

    if (searchTerm) {
      processedLeads = processedLeads.filter(lead =>
        Object.values(lead).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (filters.score !== 'all') processedLeads = processedLeads.filter(lead => lead.leadScore === filters.score);
    if (filters.status !== 'all') processedLeads = processedLeads.filter(lead => lead.status === filters.status);
    if (filters.source !== 'all') processedLeads = processedLeads.filter(lead => lead.leadSource === filters.source);
    if (filters.assignedTo !== 'all') processedLeads = processedLeads.filter(lead => lead.assignedTo === filters.assignedTo);
    
    const [field, order] = sortOption.split('_');
    processedLeads.sort((a, b) => {
        let valA = a[field];
        let valB = b[field];

        if (field === 'leadScore') { // Custom sort for lead score (Hot > Warm > Cold)
            const scoreOrder = { [LEAD_SCORES.HOT]: 3, [LEAD_SCORES.WARM]: 2, [LEAD_SCORES.COLD]: 1 };
            valA = scoreOrder[valA] || 0;
            valB = scoreOrder[valB] || 0;
        } else if (typeof valA === 'string') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }
        
        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
    });

    return processedLeads;
  }, [leads, searchTerm, filters, sortOption]);


  const handleViewLead = (lead) => { setSelectedLead(lead); setShowLeadModal(true); };
  const handleEditLead = () => toast({ title: "Edit Lead: Coming Soon!", description: "🚧 This feature isn't implemented yet!" });
  
  const handleDeleteLead = (lead) => {
    if (window.confirm(`Delete ${lead.name}? This action cannot be undone.`)) {
      deleteLead(lead.id);
      loadLeads();
      toast({ title: "Lead Deleted", description: `${lead.name} removed.`, variant: "destructive" });
    }
  };

  const handleScoreLead = (lead) => {
    const updatedLead = scoreLeadWithAI(lead.id);
    if (updatedLead) {
      loadLeads();
      if (selectedLead && selectedLead.id === lead.id) setSelectedLead(updatedLead);
      toast({ title: "Lead Scored!", description: `${lead.name} is now ${updatedLead.leadScore}.` });
    }
  };

  const handleLeadCreated = () => loadLeads();
  const handleLeadUpdate = (updatedLead) => {
    setSelectedLead(updatedLead); // Update if current modal lead changed
    loadLeads();
  };

  const FilterDropdown = ({ value, onValueChange, placeholder, items, label, icon: Icon }) => (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full sm:w-auto min-w-[180px] text-sm">
        {Icon && <Icon className="h-4 w-4 mr-2 text-muted-foreground" />}
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          <SelectItem value="all">All {label}</SelectItem>
          {items.map(item => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
        </SelectGroup>
      </SelectContent>
    </Select>
  );

  return (
    <div className="space-y-6 pb-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg shadow-md">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Leads Pipeline</h1>
            <p className="text-muted-foreground text-sm md:text-base">Manage and track your leads with AI insights.</p>
          </div>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-sm">
          <Plus className="h-4 w-4 mr-2" /> Add New Lead
        </Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4 p-4 glass-card rounded-xl border border-slate-700/50">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search leads (name, company, email, etc.)..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 text-sm h-10" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} className="h-10 w-10">
              {viewMode === 'grid' ? <ListFilter className="h-5 w-5"/> : <LayoutGrid className="h-5 w-5"/>}
            </Button>
             <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-full sm:w-auto min-w-[180px] text-sm h-10">
                    <SlidersHorizontal className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="createdAt_desc">Date Created (Newest)</SelectItem>
                    <SelectItem value="createdAt_asc">Date Created (Oldest)</SelectItem>
                    <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                    <SelectItem value="leadScore_desc">Lead Score (Hot-Cold)</SelectItem>
                    <SelectItem value="leadScore_asc">Lead Score (Cold-Hot)</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <FilterDropdown value={filters.score} onValueChange={val => setFilters(f => ({...f, score: val}))} placeholder="Filter by Score" items={Object.values(LEAD_SCORES).map(s => ({value: s, label: s}))} label="Scores" icon={Zap} />
            <FilterDropdown value={filters.status} onValueChange={val => setFilters(f => ({...f, status: val}))} placeholder="Filter by Status" items={Object.values(LEAD_STATUS).map(s => ({value: s, label: s}))} label="Statuses" icon={ActivityIcon} />
            <FilterDropdown value={filters.source} onValueChange={val => setFilters(f => ({...f, source: val}))} placeholder="Filter by Source" items={Object.values(LEAD_SOURCES).map(s => ({value: s, label: s}))} label="Sources" icon={Filter} />
            <FilterDropdown value={filters.assignedTo} onValueChange={val => setFilters(f => ({...f, assignedTo: val}))} placeholder="Filter by Assignee" items={assignableUsers.map(u => ({value: u.id, label: u.name}))} label="Assignees" icon={UserIcon} />
        </div>
      </motion.div>

      <AnimatePresence>
        {filteredAndSortedLeads.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-xl font-semibold mb-2">No Leads Match Your Criteria</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or filters, or add a new lead to get started.</p>
            <Button onClick={() => setShowCreateModal(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" /> Create First Lead
            </Button>
          </motion.div>
        ) : (
          <motion.div layout className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' : 'grid-cols-1'}`}>
            {filteredAndSortedLeads.map((lead, index) => (
              <LeadCard key={lead.id} lead={lead} index={index} onView={handleViewLead} onEdit={handleEditLead} onDelete={handleDeleteLead} onScore={handleScoreLead} assignableUsers={assignableUsers} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <LeadModal lead={selectedLead} isOpen={showLeadModal} onClose={() => setShowLeadModal(false)} onLeadUpdate={handleLeadUpdate} assignableUsers={assignableUsers} />
      <CreateLeadModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onLeadCreated={handleLeadCreated} />
    </div>
  );
}
