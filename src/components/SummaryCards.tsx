import { motion } from 'framer-motion';
import { IconFileText, IconAlertTriangle, IconShieldCheck, IconClock } from '@tabler/icons-react';

interface SummaryCardsProps {
  analytics: {
    totalModerated?: number;
    allowed?: number;
    removed?: number;
    averageResponseTime?: number;
  };
}

export function SummaryCards({ analytics }: SummaryCardsProps) {
  // Default values to prevent undefined errors
  const totalModerated = analytics?.totalModerated || 0;
  const harmfulCount = analytics?.removed || 0;
  const safeCount = analytics?.allowed || 0;
  const avgResponse = analytics?.averageResponseTime || 0;

  const cards = [
    {
      title: 'Total Checked',
      value: totalModerated,
      icon: IconFileText,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      change: totalModerated > 0 ? '+12%' : '0%',
    },
    {
      title: 'Harmful Count',
      value: harmfulCount,
      icon: IconAlertTriangle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      change: harmfulCount > 0 ? '+5%' : '0%',
    },
    {
      title: 'Safe Count',
      value: safeCount,
      icon: IconShieldCheck,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      change: safeCount > 0 ? '-3%' : '0%',
    },
    {
      title: 'Avg Response',
      value: `${avgResponse}ms`,
      icon: IconClock,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      change: 'fast',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="glass-effect rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${card.bg}`}>
              <card.icon size={18} className={card.color} />
            </div>
            {card.change !== '0%' && card.change !== 'fast' && (
              <span className={`text-xs ${card.change.includes('+') ? 'text-green-400' : 'text-red-400'}`}>
                {card.change}
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-white">{card.value}</p>
          <p className="text-xs text-white/40 mt-1">{card.title}</p>
        </motion.div>
      ))}
    </div>
  );
}