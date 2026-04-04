import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  IconCheck, 
  IconX, 
  IconFlag, 
  IconRobot, 
  IconAlertCircle,
  IconClock,
  IconCategory,
  IconChartBar
} from '@tabler/icons-react';
import type { ModerationItem } from '@/store';

interface PostCardProps {
  item: ModerationItem;
  onDecision: (id: string, decision: 'allow' | 'flag' | 'remove') => void;
  aiDecision?: string;
  isAiAnalyzing?: boolean;
}

const actionColors = {
  allow: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-500', icon: <IconCheck size={16} /> },
  flag: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-500', icon: <IconFlag size={16} /> },
  remove: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-500', icon: <IconX size={16} /> },
};

export default function PostCard({ item, onDecision, aiDecision, isAiAnalyzing }: PostCardProps) {
  const [selectedAction, setSelectedAction] = useState<'allow' | 'flag' | 'remove' | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleDecision = (decision: 'allow' | 'flag' | 'remove') => {
    setSelectedAction(decision);
    onDecision(item.id, decision);
  };

  const getTypeIcon = () => {
    switch (item.type) {
      case 'text': return '📝';
      case 'image': return '🖼️';
      case 'video': return '🎬';
      default: return '📄';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-500';
    if (confidence >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const isDecisionMade = item.decision !== undefined;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`glass-hover rounded-xl overflow-hidden transition-all duration-300 ${
        isDecisionMade ? 'opacity-90' : ''
      } ${isHovered ? 'shadow-xl' : ''}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-glass-border/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{getTypeIcon()}</span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {item.type}
            </span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <IconClock size={12} />
              {item.timestamp}
            </span>
          </div>
          
          {/* AI Decision Badge */}
          {aiDecision && !isAiAnalyzing && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
              actionColors[aiDecision as keyof typeof actionColors]?.bg || 'bg-secondary/30'
            }`}>
              <IconRobot size={12} />
              <span>AI: {aiDecision.toUpperCase()}</span>
            </div>
          )}
          {isAiAnalyzing && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/30 text-xs">
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              <span>AI Analyzing...</span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="mt-2">
          <p className="text-foreground leading-relaxed">
            {item.type === 'text' ? (
              item.content
            ) : (
              <span className="text-muted-foreground italic">{item.content}</span>
            )}
          </p>
        </div>
      </div>

      {/* Metadata */}
      <div className="px-4 py-3 bg-secondary/20 border-b border-glass-border/50">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <IconChartBar size={14} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Confidence:</span>
              <span className={`text-xs font-medium ${getConfidenceColor(item.confidence)}`}>
                {item.confidence}%
              </span>
            </div>
            <div className="flex items-center gap-1">
              <IconCategory size={14} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Category:</span>
              <span className="text-xs font-medium capitalize">{item.category}</span>
            </div>
          </div>
          
          {item.score > 0 && (
            <div className="px-2 py-0.5 rounded-full gradient-bg text-primary-foreground text-xs font-bold">
              +{item.score} pts
            </div>
          )}
        </div>
        
        {/* Explanation */}
        <p className="text-xs text-muted-foreground mt-2 italic">
          {item.explanation}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleDecision('allow')}
            disabled={isDecisionMade}
            className={`
              relative overflow-hidden group py-2.5 rounded-lg font-medium text-sm transition-all
              ${selectedAction === 'allow' 
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                : isDecisionMade
                  ? 'bg-secondary/30 text-muted-foreground cursor-not-allowed'
                  : 'bg-green-500/10 text-green-600 hover:bg-green-500/20 border border-green-500/20'
              }
            `}
          >
            <div className="flex items-center justify-center gap-2">
              <IconCheck size={16} />
              <span>Allow</span>
            </div>
            {!isDecisionMade && (
              <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-10 transition-opacity" />
            )}
          </button>

          <button
            onClick={() => handleDecision('flag')}
            disabled={isDecisionMade}
            className={`
              relative overflow-hidden group py-2.5 rounded-lg font-medium text-sm transition-all
              ${selectedAction === 'flag' 
                ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/30' 
                : isDecisionMade
                  ? 'bg-secondary/30 text-muted-foreground cursor-not-allowed'
                  : 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border border-yellow-500/20'
              }
            `}
          >
            <div className="flex items-center justify-center gap-2">
              <IconFlag size={16} />
              <span>Flag</span>
            </div>
          </button>

          <button
            onClick={() => handleDecision('remove')}
            disabled={isDecisionMade}
            className={`
              relative overflow-hidden group py-2.5 rounded-lg font-medium text-sm transition-all
              ${selectedAction === 'remove' 
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
                : isDecisionMade
                  ? 'bg-secondary/30 text-muted-foreground cursor-not-allowed'
                  : 'bg-red-500/10 text-red-600 hover:bg-red-500/20 border border-red-500/20'
              }
            `}
          >
            <div className="flex items-center justify-center gap-2">
              <IconX size={16} />
              <span>Remove</span>
            </div>
          </button>
        </div>

        {/* Feedback after decision */}
        {isDecisionMade && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-2 rounded-lg bg-secondary/30 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-xs">
              {selectedAction === item.correctDecision ? (
                <>
                  <IconCheck size={14} className="text-green-500" />
                  <span className="text-green-500">Correct! +{item.score} points</span>
                </>
              ) : (
                <>
                  <IconAlertCircle size={14} className="text-red-500" />
                  <span className="text-red-500">
                    Incorrect. Correct decision: {item.correctDecision}
                  </span>
                </>
              )}
              {aiDecision && selectedAction === aiDecision && (
                <span className="text-blue-500 text-xs">✓ Matches AI decision</span>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}