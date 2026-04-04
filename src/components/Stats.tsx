import { motion } from 'framer-motion';
import { IconCheck, IconX, IconClock, IconTrophy, IconRobot, IconTrendingUp } from '@tabler/icons-react';
import { useAppState } from '@/store';

export default function Stats() {
  const { state } = useAppState();
  const { stats, difficulty } = state;

  const statsCards = [
    {
      title: 'Accuracy',
      value: `${stats.accuracy}%`,
      icon: <IconTrendingUp size={20} />,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      trend: stats.accuracy > 70 ? '+12%' : '-5%',
    },
    {
      title: 'Total Score',
      value: stats.avgScore,
      icon: <IconTrophy size={20} />,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      trend: '+',
    },
    {
      title: 'Processed',
      value: stats.totalProcessed,
      icon: <IconClock size={20} />,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Mistakes',
      value: stats.mistakes,
      icon: <IconX size={20} />,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
    },
  ];

  return (
    <div className="space-y-4">
      {statsCards.map((card, idx) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="glass-sm p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${card.bg}`}>
              <div className={card.color}>{card.icon}</div>
            </div>
            {card.trend && (
              <span className="text-xs text-green-500">{card.trend}</span>
            )}
          </div>
          <p className="text-2xl font-bold text-foreground">{card.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{card.title}</p>
        </motion.div>
      ))}

      {/* Difficulty Badge */}
      <div className="glass-sm p-4 mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Current Difficulty</span>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            difficulty === 'easy' ? 'bg-green-500/20 text-green-500' :
            difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
            'bg-red-500/20 text-red-500'
          }`}>
            {difficulty.toUpperCase()}
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Points per correct:</span>
          <span className="font-medium">
            {difficulty === 'easy' ? '8' : difficulty === 'medium' ? '10' : '15'}
          </span>
        </div>
      </div>

      {/* AI Integration Status */}
      <div className="glass-sm p-4 mt-4">
        <div className="flex items-center gap-2 mb-2">
          <IconRobot size={16} className="text-primary" />
          <span className="text-xs font-medium">AI Assistant</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Compare your decisions with AI to learn and improve
        </p>
      </div>
    </div>
  );
}