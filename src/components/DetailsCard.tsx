import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { IconCheck, IconX, IconFlag, IconAlertCircle, IconZoomCode } from '@tabler/icons-react';
import type { ModerationResult } from '@/services/moderationService';

interface DetailsCardProps {
  result: ModerationResult | null;
  isLoading: boolean;
}

export function DetailsCard({ result, isLoading }: DetailsCardProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const handleAction = (action: string) => {
    setPendingAction(action);
    setShowConfirmModal(true);
  };

  const confirmAction = () => {
    console.log(`Action confirmed: ${pendingAction}`);
    setShowConfirmModal(false);
    // Here you would save the decision to your backend
  };

  if (isLoading) {
    return (
      <div className="glass-effect rounded-2xl p-6 animate-pulse">
        <div className="h-32 bg-white/5 rounded-lg mb-4" />
        <div className="h-20 bg-white/5 rounded-lg" />
      </div>
    );
  }

  if (!result) return null;

  const harmfulPercent = result.harmful_score * 100;
  const isHighRisk = harmfulPercent > 70;
  const isMediumRisk = harmfulPercent > 30 && harmfulPercent <= 70;

  // Highlight toxic words in text (simplified)
  const highlightToxicWords = (text: string, violations: string[]) => {
    if (!text) return text;
    let highlighted = text;
    const toxicWords = ['hate', 'kill', 'stupid', 'worthless', 'die', 'nude', 'naked', 'sex'];
    toxicWords.forEach(word => {
      const regex = new RegExp(`(${word})`, 'gi');
      highlighted = highlighted.replace(regex, `<span class="bg-red-500/30 text-red-400 px-1 rounded">$1</span>`);
    });
    return highlighted;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`glass-effect rounded-2xl p-6 border-2 transition-all ${
          isHighRisk ? 'border-red-500/50 shadow-red-500/20' : 
          isMediumRisk ? 'border-yellow-500/50 shadow-yellow-500/20' : 
          'border-green-500/50 shadow-green-500/20'
        } shadow-lg`}
      >
        {/* Score Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60">Harmfulness Score</span>
            <span className={`text-2xl font-bold ${
              isHighRisk ? 'text-red-400' : isMediumRisk ? 'text-yellow-400' : 'text-green-400'
            }`}>
              {harmfulPercent.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${harmfulPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-2 rounded-full ${
                isHighRisk ? 'bg-red-500' : isMediumRisk ? 'bg-yellow-500' : 'bg-green-500'
              }`}
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-6 p-4 rounded-xl bg-white/5">
          <p className="text-white/80 text-sm leading-relaxed">{result.reason}</p>
        </div>

        {/* Flags */}
        {result.violations.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-white mb-2">Violations Detected</h4>
            <div className="flex flex-wrap gap-2">
              {result.violations.map((v) => (
                <span key={v} className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-medium">
                  {v.replace('_', ' ').toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Highlighted Content */}
        {result.content_type === 'text' && (
          <div className="mb-6 p-4 rounded-xl bg-white/5">
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <IconZoomCode size={16} />
              Highlighted Content
            </h4>
            <div 
              className="text-white/80 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: highlightToxicWords('Sample text would go here', result.violations) 
              }}
            />
          </div>
        )}

        {/* Confidence Badge */}
        <div className="mb-6 flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            result.confidence > 0.8 ? 'bg-green-500/20 text-green-400' :
            result.confidence > 0.6 ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            Confidence: {(result.confidence * 100).toFixed(0)}%
          </div>
          <div className="px-3 py-1 rounded-full bg-white/10 text-white/60 text-xs">
            {result.detection_method}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleAction('allow')}
            className="group relative py-3 rounded-xl bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="flex items-center justify-center gap-2">
              <IconCheck size={18} className="text-green-400" />
              <span className="text-green-400 font-medium">Allow</span>
            </div>
          </button>
          
          <button
            onClick={() => handleAction('flag')}
            className="group relative py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 hover:bg-yellow-500/20 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-yellow-500 opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="flex items-center justify-center gap-2">
              <IconFlag size={18} className="text-yellow-400" />
              <span className="text-yellow-400 font-medium">Flag</span>
            </div>
          </button>
          
          <button
            onClick={() => handleAction('remove')}
            className="group relative py-3 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-10 transition-opacity" />
            <div className="flex items-center justify-center gap-2">
              <IconX size={18} className="text-red-400" />
              <span className="text-red-400 font-medium">Remove</span>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-effect rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <IconAlertCircle size={24} className="text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Confirm Action</h3>
              </div>
              <p className="text-white/80 mb-6">
                Are you sure you want to <span className="font-semibold text-yellow-400">{pendingAction?.toUpperCase()}</span> this content?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className="flex-1 py-2 rounded-lg gradient-bg text-white font-medium"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}