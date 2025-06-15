import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText as ResumeIcon, UploadCloud, User, Mail, Phone, Briefcase, Brain, Search, Download, Trash2, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { getLeads, uploadResumeForLead } from '@/lib/db/leads'; 
import { supabase } from '@/lib/supabaseClient';


export function ResumeManagementPage({ user }) {
  const [leadsWithResumes, setLeadsWithResumes] = useState([]);
  const [allLeads, setAllLeads] = useState([]); // For assigning resumes
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedLeadForUpload, setSelectedLeadForUpload] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    loadResumes();
    const leadsData = getLeads();
    setAllLeads(leadsData);
  }, []);

  const loadResumes = () => {
    const leadsData = getLeads();
    setLeadsWithResumes(leadsData.filter(lead => lead.resumeUrl));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast({ title: "File too large", description: "Please select a resume file under 5MB.", variant: "destructive"});
            setSelectedFile(null);
            if(fileInputRef.current) fileInputRef.current.value = "";
            return;
        }
        if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)){
            toast({ title: "Invalid File Type", description: "Only PDF and Word documents are allowed.", variant: "destructive"});
            setSelectedFile(null);
            if(fileInputRef.current) fileInputRef.current.value = "";
            return;
        }
        setSelectedFile(file);
    }
  };

  const handleUploadResume = async () => {
    if (!selectedFile || !selectedLeadForUpload) {
      toast({ title: "Missing Information", description: "Please select a file and a lead to upload the resume for.", variant: "destructive" });
      return;
    }
    setIsUploading(true);
    try {
      const fileName = `${selectedLeadForUpload}-${Date.now()}-${selectedFile.name}`;
      const { data, error } = await supabase.storage
        .from('resumes') // Make sure this bucket exists and has correct policies
        .upload(fileName, selectedFile);

      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage.from('resumes').getPublicUrl(fileName);
      
      uploadResumeForLead(selectedLeadForUpload, publicUrl || data.path); // Use publicUrl if available, else path
      loadResumes(); // Refresh list
      toast({ title: "Resume Uploaded!", description: `${selectedFile.name} uploaded successfully for lead.` });
      setSelectedFile(null);
      setSelectedLeadForUpload('');
      if(fileInputRef.current) fileInputRef.current.value = "";

    } catch (error) {
      console.error("Supabase upload error:", error);
      toast({ title: "Upload Failed", description: error.message || "Could not upload resume. Check bucket policies.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDownloadResume = (resumeUrl, leadName) => {
    if (!resumeUrl) {
        toast({ title: "No Resume", description: "This lead does not have a resume attached.", variant: "destructive"});
        return;
    }
    // For Supabase Storage URLs, direct download should work.
    // If it's a mock URL or needs special handling:
    if (resumeUrl.startsWith('mock-resume-')) {
        toast({ title: "Mock Resume", description: "This is a mock resume. Real download requires actual file URL."});
        return;
    }
    window.open(resumeUrl, '_blank');
    toast({ title: "Downloading Resume", description: `Preparing download for ${leadName}'s resume.`});
  }
  
  const handleDeleteResume = (leadId) => {
    // This would involve deleting from Supabase storage and then updating lead record
    // For now, it's a placeholder as it requires careful implementation
    toast({
        title: "Delete Resume Feature",
        description: "🚧 This requires deleting from Supabase Storage and updating the lead. You can request it in your next prompt! 🚀"
    });
    // Example of what it might do:
    // const lead = getLeadById(leadId);
    // if (lead && lead.resumeUrl) {
    //    const filePath = lead.resumeUrl.substring(lead.resumeUrl.lastIndexOf('/') + 1); // simplistic path extraction
    //    await supabase.storage.from('resumes').remove([filePath]);
    //    updateLead(leadId, { resumeUrl: null });
    //    loadResumes();
    // }
  }

  const filteredLeads = leadsWithResumes.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.parsedSkills && lead.parsedSkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
  );
  
  // Basic mock parsing, replace with actual parsing logic if needed
  const parseResumeContent = (resumeUrl) => {
    if (!resumeUrl || resumeUrl.startsWith("mock-resume-")) {
        return { name: "N/A", email: "N/A", phone: "N/A", skills: ["Mock Data"] };
    }
    // In a real scenario, you'd fetch the file content and use a library.
    // For now, we'll return placeholder based on filename or similar heuristic.
    const fileName = resumeUrl.substring(resumeUrl.lastIndexOf('/') + 1);
    return {
        name: fileName.split('-')[0] || "Parsed Name", // Example heuristic
        email: "parsed@example.com",
        phone: "555-PARSED",
        skills: ["React", "Node.js", "TailwindCSS"] // Example skills
    };
  };


  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3"
      >
        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <ResumeIcon className="h-7 w-7 text-white" />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Resume Management</h1>
            <p className="text-muted-foreground text-lg">Upload, view, and manage candidate resumes.</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card border-slate-700/50">
            <CardHeader>
                <CardTitle className="flex items-center"><UploadCloud className="h-5 w-5 mr-2 text-indigo-400"/> Upload New Resume</CardTitle>
                <CardDescription>Attach a resume file to an existing lead.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                 <div>
                    <label htmlFor="lead-select-for-upload" className="block text-sm font-medium text-slate-300 mb-1">Select Lead</label>
                    <select 
                        id="lead-select-for-upload"
                        value={selectedLeadForUpload} 
                        onChange={(e) => setSelectedLeadForUpload(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">-- Select a Lead --</option>
                        {allLeads.filter(l => !l.resumeUrl).map(lead => ( // Show leads without resumes
                            <option key={lead.id} value={lead.id}>{lead.name} ({lead.company})</option>
                        ))}
                    </select>
                </div>
                <div>
                     <label htmlFor="resume-file-upload" className="block text-sm font-medium text-slate-300 mb-1">Resume File (PDF, DOC, DOCX - Max 5MB)</label>
                    <Input 
                        id="resume-file-upload" 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileChange} 
                        accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        className="file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
                    />
                </div>
                <Button onClick={handleUploadResume} disabled={!selectedFile || !selectedLeadForUpload || isUploading} className="bg-indigo-600 hover:bg-indigo-700 h-10">
                    {isUploading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"/> : <UploadCloud className="h-4 w-4 mr-2"/>}
                    {isUploading ? "Uploading..." : "Upload Resume"}
                </Button>
            </CardContent>
             {selectedFile && <CardFooter className="text-xs text-muted-foreground pt-2">Selected: {selectedFile.name}</CardFooter>}
        </Card>
      </motion.div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
         <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search resumes by lead name, company, or skills..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 text-sm" />
          </div>

        {filteredLeads.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <ResumeIcon className="h-16 w-16 mx-auto mb-4 text-slate-500" />
            <p className="text-lg">No resumes found matching your criteria.</p>
            <p className="text-sm">Try adjusting your search or upload new resumes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeads.map((lead, index) => {
              const parsedInfo = parseResumeContent(lead.resumeUrl);
              return (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -4, boxShadow: "0px 8px 15px rgba(0,0,0,0.1)"}}
                >
                  <Card className="glass-card border-slate-700/50 hover:border-indigo-500/70 transition-all duration-300 h-full flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg text-slate-100">{lead.name}</CardTitle>
                         <Badge variant="secondary" className="text-xs">{lead.resumeUrl && lead.resumeUrl.startsWith('mock-') ? 'Mock' : 'Uploaded'}</Badge>
                      </div>
                      <CardDescription className="text-sm text-slate-400 flex items-center"><Briefcase className="h-4 w-4 mr-1.5"/>{lead.company}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm flex-grow">
                        <div className="text-xs text-indigo-300 font-semibold">Parsed Info (Mocked):</div>
                        <div className="flex items-center space-x-2"><Mail className="h-4 w-4 text-slate-500" /><span className="truncate">{parsedInfo.email}</span></div>
                        <div className="flex items-center space-x-2"><Phone className="h-4 w-4 text-slate-500" /><span className="truncate">{parsedInfo.phone}</span></div>
                        <div>
                            <span className="text-xs text-slate-500">Skills: </span>
                            {parsedInfo.skills.slice(0,3).map(skill => <Badge key={skill} variant="outline" className="mr-1 mb-1 text-xs">{skill}</Badge>)}
                            {parsedInfo.skills.length > 3 && <Badge variant="outline" className="text-xs">+{parsedInfo.skills.length - 3} more</Badge>}
                        </div>
                    </CardContent>
                    <CardFooter className="border-t border-slate-700/50 pt-3 flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-indigo-400" onClick={() => handleDownloadResume(lead.resumeUrl, lead.name)} disabled={!lead.resumeUrl}><Download size={16}/></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-red-400" onClick={() => handleDeleteResume(lead.id)} disabled={!lead.resumeUrl}><Trash2 size={16}/></Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
       <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg text-yellow-200 flex items-start"
      >
        <AlertTriangle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-yellow-400" />
        <div>
            <h4 className="font-semibold">AI Resume Parsing - Coming Soon!</h4>
            <p className="text-xs ">
                Advanced AI-powered resume parsing to extract key information like skills, experience, education, and more is under development. 
                This will enable deeper candidate insights and matching. The current "Parsed Info" is placeholder data.
            </p>
        </div>
      </motion.div>
    </div>
  );
}