import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Calendar, ArrowUpRight, Wallet } from 'lucide-react';
import { MobileLayout, PageContainer, PageHeader } from '@/components/layout/MobileLayout';
import { BottomNavBar } from '@/components/navigation/BottomNavBar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  service: string;
  customer: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending';
}

const mockTransactions: Transaction[] = [
  { id: '1', service: 'Deep House Cleaning', customer: 'Sarah J.', amount: 80, date: 'Today', status: 'completed' },
  { id: '2', service: 'Standard Cleaning', customer: 'Mike C.', amount: 50, date: 'Yesterday', status: 'completed' },
  { id: '3', service: 'Deep House Cleaning', customer: 'Emily D.', amount: 80, date: 'Dec 13', status: 'completed' },
  { id: '4', service: 'Move-out Cleaning', customer: 'James W.', amount: 150, date: 'Dec 12', status: 'completed' },
  { id: '5', service: 'Standard Cleaning', customer: 'Anna K.', amount: 50, date: 'Dec 11', status: 'pending' },
];

const ProviderEarnings = () => {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  const stats = {
    week: { earnings: 320, jobs: 5, growth: 12 },
    month: { earnings: 1280, jobs: 18, growth: 8 },
    year: { earnings: 15400, jobs: 234, growth: 25 },
  };

  const currentStats = stats[period];

  return (
    <MobileLayout>
      <PageHeader title="Earnings" subtitle="Track your income" />

      <PageContainer className="pt-4">
        {/* Period Selector */}
        <div className="flex gap-2 mb-6">
          {(['week', 'month', 'year'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                period === p
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {/* Earnings Card */}
        <motion.div
          key={period}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="gradient-primary rounded-2xl p-6 text-primary-foreground mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-6 w-6" />
              <span className="font-medium">Total Earnings</span>
            </div>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              currentStats.growth >= 0 ? 'bg-success/20 text-success-foreground' : 'bg-destructive/20'
            }`}>
              {currentStats.growth >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {currentStats.growth}%
            </div>
          </div>

          <p className="text-4xl font-bold mb-2">${currentStats.earnings.toLocaleString()}</p>
          <p className="text-primary-foreground/80">
            {currentStats.jobs} jobs completed this {period}
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl p-4 border border-border/50"
          >
            <div className="w-10 h-10 rounded-lg bg-success-soft flex items-center justify-center mb-2">
              <Wallet className="h-5 w-5 text-success" />
            </div>
            <p className="text-2xl font-bold text-foreground">$450</p>
            <p className="text-sm text-muted-foreground">Available to withdraw</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl p-4 border border-border/50"
          >
            <div className="w-10 h-10 rounded-lg bg-primary-soft flex items-center justify-center mb-2">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">$50</p>
            <p className="text-sm text-muted-foreground">Pending clearance</p>
          </motion.div>
        </div>

        {/* Withdraw Button */}
        <Button 
          size="lg" 
          fullWidth 
          className="mb-6"
          onClick={() => toast.success('Withdrawal initiated!')}
        >
          <ArrowUpRight className="h-5 w-5 mr-2" />
          Withdraw to Bank
        </Button>

        {/* Recent Transactions */}
        <div className="mb-4">
          <h3 className="font-semibold text-foreground mb-4">Recent Transactions</h3>
          
          <div className="flex flex-col gap-3">
            {mockTransactions.map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 bg-card rounded-xl border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    tx.status === 'completed' ? 'bg-success-soft' : 'bg-warning/10'
                  }`}>
                    <DollarSign className={`h-5 w-5 ${
                      tx.status === 'completed' ? 'text-success' : 'text-warning'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{tx.service}</p>
                    <p className="text-xs text-muted-foreground">{tx.customer} • {tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">+${tx.amount}</p>
                  <p className={`text-xs ${
                    tx.status === 'completed' ? 'text-success' : 'text-warning'
                  }`}>
                    {tx.status === 'completed' ? 'Completed' : 'Pending'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </PageContainer>

      <BottomNavBar />
    </MobileLayout>
  );
};

export default ProviderEarnings;
