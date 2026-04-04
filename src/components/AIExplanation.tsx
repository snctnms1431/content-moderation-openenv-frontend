import { motion } from 'framer-motion';
import { IconBrain, IconBulb, IconTag, IconChartBar } from '@tabler/icons-react';
import type { ModerationResult } from '@/services/moderationService';

interface AIExplanationProps {
  result: ModerationResult | null;
}

export function AIExplanation({ result }: AIExplanationProps) {
  if (!result) return null;

  const getExplanation = () => {
    if (result.violations.length === 0) {
      return {
        title: "Content appears safe",
        reasons: [
          "No harmful keywords detected",
          "Language appears constructive",
          "Within community guidelines"
        ]
      };
    }
    
    return {
      title: "Why this content was flagged",
      reasons: result.violations.map(v => {
        switch(v) {
          case 'violence': return "Contains violent or threatening language";
          case 'hate_speech': return "Includes hate speech or discriminatory content";
          case 'nudity': return "Sexually explicit or inappropriate content detected";
          case 'harassment': return "Harassing or bullying behavior identified";
          default: return `${v.replace('_', ' ')} detected`;
        }
      })
    };
  };

  const explanation = getExplanation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-effect rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <IconBrain size={20} className="text-purple-400" />
        <h3 className="text-lg font-semibold text-white">AI Explanation</h3>
      </div>
      
      <div className="space-y-4">
        <p className="text-white/80 text-sm font-medium">{explanation.title}</p>
        
        <div className="space-y-2">
          {explanation.reasons.map((reason, idx) => (
            <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-white/5">
              <IconBulb size={14} className="text-purple-400 mt-0.5" />
              <span className="text-white/60 text-sm">{reason}</span>
            </div>
          ))}
        </div>
        
        <div className="pt-3 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-white/40">
            <IconTag size={12} />
            <span>Powered by advanced NLP models</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}