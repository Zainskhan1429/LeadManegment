
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Plus, Star, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { getFeedback } from '@/lib/db/feedback'; // Updated import path

export function FeedbackPage({ user }) {
  const [feedback, setFeedback] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = () => {
    const allFeedback = getFeedback();
    setFeedback(allFeedback);
  };

  const handleCreateFeedback = () => {
    toast({
      title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-400'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Feedback</h1>
            <p className="text-muted-foreground">View and manage lead feedback</p>
          </div>
        </div>

        <Button
          onClick={handleCreateFeedback}
          className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Feedback
        </Button>
      </motion.div>

      {feedback.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center py-12"
        >
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No feedback yet</h3>
          <p className="text-muted-foreground mb-4">
            Start collecting feedback from your leads
          </p>
          <Button
            onClick={handleCreateFeedback}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add First Feedback
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {feedback.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <Card className="glass-card border-slate-700/50 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">Lead Feedback</CardTitle>
                    <div className="flex items-center space-x-1">
                      {renderStars(item.rating)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Lead ID: {item.leadId}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>

                  {item.feedbackText && (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Feedback</p>
                      <p className="text-sm">{item.feedbackText}</p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-700/50">
                    <p className="text-xs text-muted-foreground">
                      Agent: {item.agentId}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
