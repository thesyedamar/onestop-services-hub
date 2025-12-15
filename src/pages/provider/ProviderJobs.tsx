import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Phone, MessageCircle, CheckCircle, Navigation } from 'lucide-react';
import { MobileLayout, PageContainer, PageHeader } from '@/components/layout/MobileLayout';
import { BottomNavBar } from '@/components/navigation/BottomNavBar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type JobStatus = 'upcoming' | 'today' | 'in_progress';

interface Job {
  id: string;
  customer: string;
  service: string;
  date: string;
  time: string;
  location: string;
  price: number;
  status: JobStatus;
  phone: string;
}

const mockJobs: Job[] = [
  { id: '1', customer: 'Sarah Johnson', service: 'Deep House Cleaning', date: 'Today', time: '2:00 PM', location: '123 Main St, Apt 4B', price: 80, status: 'in_progress', phone: '+1 234 567 8900' },
  { id: '2', customer: 'Mike Chen', service: 'Deep House Cleaning', date: 'Today', time: '5:00 PM', location: '456 Oak Ave', price: 80, status: 'today', phone: '+1 234 567 8901' },
  { id: '3', customer: 'Emily Davis', service: 'Standard Cleaning', date: 'Tomorrow', time: '10:00 AM', location: '789 Pine Rd', price: 50, status: 'upcoming', phone: '+1 234 567 8902' },
  { id: '4', customer: 'James Wilson', service: 'Deep House Cleaning', date: 'Dec 18', time: '3:00 PM', location: '321 Elm St', price: 80, status: 'upcoming', phone: '+1 234 567 8903' },
];

const ProviderJobs = () => {
  const [jobs, setJobs] = useState(mockJobs);
  const [filter, setFilter] = useState<'all' | JobStatus>('all');

  const filters: { key: 'all' | JobStatus; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'in_progress', label: 'Active' },
    { key: 'today', label: 'Today' },
    { key: 'upcoming', label: 'Upcoming' },
  ];

  const filteredJobs = filter === 'all' ? jobs : jobs.filter(j => j.status === filter);

  const getStatusBadge = (status: JobStatus) => {
    const config = {
      in_progress: { color: 'bg-accent/10 text-accent', label: 'In Progress' },
      today: { color: 'bg-primary/10 text-primary', label: 'Today' },
      upcoming: { color: 'bg-muted text-muted-foreground', label: 'Upcoming' },
    };
    const { color, label } = config[status];
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{label}</span>;
  };

  const handleComplete = (id: string) => {
    setJobs(jobs.filter(j => j.id !== id));
    toast.success('Job completed! Great work!');
  };

  const handleStartJob = (id: string) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, status: 'in_progress' as JobStatus } : j));
    toast.success('Job started!');
  };

  return (
    <MobileLayout>
      <PageHeader 
        title="My Jobs" 
        subtitle={`${jobs.length} active jobs`}
      />

      {/* Filters */}
      <div className="px-4 pb-2 sticky top-16 z-30 bg-background">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === f.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <PageContainer className="pt-4">
        {filteredJobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <Clock className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No Jobs</h3>
            <p className="text-muted-foreground">Check incoming requests for new jobs</p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className={`bg-card rounded-2xl p-4 border shadow-sm ${
                  job.status === 'in_progress' ? 'border-accent' : 'border-border/50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{job.customer}</h3>
                    <p className="text-sm text-muted-foreground">{job.service}</p>
                  </div>
                  {getStatusBadge(job.status)}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{job.date} at {job.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-success text-lg">${job.price}</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon-sm" onClick={() => toast('Opening chat...')}>
                      <MessageCircle className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => toast(`Calling ${job.phone}`)}>
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => toast('Opening navigation...')}>
                      <Navigation className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Action Button */}
                {job.status === 'in_progress' && (
                  <Button 
                    variant="success" 
                    fullWidth
                    onClick={() => handleComplete(job.id)}
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Mark as Complete
                  </Button>
                )}
                {job.status === 'today' && (
                  <Button 
                    variant="default" 
                    fullWidth
                    onClick={() => handleStartJob(job.id)}
                  >
                    Start Job
                  </Button>
                )}
                {job.status === 'upcoming' && (
                  <Button 
                    variant="outline" 
                    fullWidth
                    onClick={() => toast('View details coming soon')}
                  >
                    View Details
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </PageContainer>

      <BottomNavBar />
    </MobileLayout>
  );
};

export default ProviderJobs;
