import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconRefresh, IconTrophy, IconX, IconRobot, IconLoader2 } from '@tabler/icons-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import PostCard from '@/components/PostCard';
import Stats from '@/components/Stats';
import DashboardCharts from '@/components/DashboardCharts';
import { useAppState, type ModerationItem } from '@/store';
import { useModeration } from '@/hooks/useModeration';

const samplePosts: ModerationItem[] = [
  { id: '1', type: 'text', content: 'This product is amazing! I love how easy it is to use and the customer support is fantastic.', timestamp: '2 min ago', confidence: 95, score: 0, correctDecision: 'allow', category: 'positive', explanation: 'Positive review with no harmful content.' },
  { id: '2', type: 'text', content: 'You are so stupid and worthless. Nobody likes you and you should just disappear.', timestamp: '5 min ago', confidence: 92, score: 0, correctDecision: 'remove', category: 'harassment', explanation: 'Contains direct harassment and bullying language targeted at an individual.' },
  { id: '3', type: 'image', content: '[Image] A sunset photo with the caption "Beautiful evening view from my balcony"', timestamp: '8 min ago', confidence: 88, score: 0, correctDecision: 'allow', category: 'nature', explanation: 'Harmless nature photography.' },
  { id: '4', type: 'text', content: 'I think we should discuss this policy more carefully. While I disagree, I respect different viewpoints.', timestamp: '12 min ago', confidence: 85, score: 0, correctDecision: 'allow', category: 'discussion', explanation: 'Respectful disagreement and constructive discourse.' },
  { id: '5', type: 'text', content: 'Click here to win $10000 instantly! Limited time offer, act now before it expires!', timestamp: '15 min ago', confidence: 90, score: 0, correctDecision: 'flag', category: 'spam', explanation: 'Spam/scam content designed to lure users with false promises.' },
  { id: '6', type: 'video', content: '[Video] Tutorial on how to build a website using React and Tailwind CSS', timestamp: '20 min ago', confidence: 91, score: 0, correctDecision: 'allow', category: 'educational', explanation: 'Educational programming tutorial.' },
];

// Define Difficulty type
type Difficulty = 'easy' | 'medium' | 'hard';

export default function Dashboard() {
  const { state, dispatch } = useAppState();
  const [items, setItems] = useState<ModerationItem[]>(samplePosts);
  const [showResult, setShowResult] = useState(false);
  const [aiDecisions, setAiDecisions] = useState<Record<string, string>>({});
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [showAiComparison, setShowAiComparison] = useState(true);
  
  const difficulty = state.difficulty as Difficulty;
  const { moderate, isBackendAvailable, checkBackend } = useModeration();

  // Handler for difficulty change - FIXED
  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Difficulty;
    dispatch({ type: 'SET_DIFFICULTY', payload: value });
  };

  // Run AI analysis on all posts when component loads
  useEffect(() => {
    const analyzeAllWithAI = async () => {
      if (!isBackendAvailable) return;
      
      setIsAiAnalyzing(true);
      const decisions: Record<string, string> = {};
      
      for (const item of items) {
        if (item.type === 'text') {
          try {
            const result = await moderate({ type: 'text', data: item.content });
            if (result) {
              decisions[item.id] = result.action.toLowerCase();
            }
          } catch (error) {
            console.error(`AI analysis failed for ${item.id}:`, error);
          }
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      setAiDecisions(decisions);
      setIsAiAnalyzing(false);
    };
    
    analyzeAllWithAI();
    checkBackend();
  }, [isBackendAvailable]);


// Add at the top of Dashboard component
useEffect(() => {
  const savedResult = sessionStorage.getItem('lastModerationResult');
  const savedType = sessionStorage.getItem('lastContentType');
  const savedContent = sessionStorage.getItem('lastContent');
  
  if (savedResult) {
    console.log('Received from upload:', { savedResult, savedType, savedContent });
    // You can use this data to pre-fill or highlight in dashboard
    sessionStorage.removeItem('lastModerationResult');
    sessionStorage.removeItem('lastContentType');
    sessionStorage.removeItem('lastContent');
  }
}, []);


  const handleDecision = useCallback((id: string, decision: 'allow' | 'flag' | 'remove') => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        
        const aiDecision = aiDecisions[id];
        const isCorrect = decision === item.correctDecision;
        const matchesAI = aiDecision ? decision === aiDecision : false;
        
        let score = 0;
        if (isCorrect) {
          score = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 10 : 15;
        }
        
        // Bonus points if matches AI decision
        if (matchesAI && isCorrect) {
          score += 5;
        }
        
        const updated = { 
          ...item, 
          decision, 
          score,
          aiDecision: aiDecision,
          matchesAI 
        };
        
        dispatch({ type: 'RECORD_DECISION', payload: updated });
        return updated;
      })
    );
  }, [difficulty, dispatch, aiDecisions]);

  const handleReset = () => {
    setItems(samplePosts.map((p) => ({ 
      ...p, 
      decision: undefined, 
      score: 0,
      aiDecision: undefined,
      matchesAI: undefined
    })));
    dispatch({ type: 'RESET_SESSION' });
    // Re-run AI analysis
    setTimeout(() => {
      const analyzeAgain = async () => {
        const decisions: Record<string, string> = {};
        for (const item of samplePosts) {
          if (item.type === 'text') {
            const result = await moderate({ type: 'text', data: item.content });
            if (result) {
              decisions[item.id] = result.action.toLowerCase();
            }
          }
        }
        setAiDecisions(decisions);
      };
      analyzeAgain();
    }, 500);
  };

  const allDecided = items.every((i) => i.decision);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-display font-bold">Content Moderation</h1>
                  <p className="text-sm text-muted-foreground">Review and moderate incoming content</p>
                </div>
                <div className="flex items-center gap-3">
                  {/* AI Status Badge */}
                  {isBackendAvailable && (
                    <div className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
                      isAiAnalyzing ? 'bg-yellow-500/10' : 'bg-green-500/10'
                    }`}>
                      {isAiAnalyzing ? (
                        <IconLoader2 size={14} className="animate-spin text-yellow-500" />
                      ) : (
                        <IconRobot size={14} className="text-green-500" />
                      )}
                      <span className={`text-xs font-medium ${
                        isAiAnalyzing ? 'text-yellow-500' : 'text-green-500'
                      }`}>
                        {isAiAnalyzing ? 'AI Analyzing...' : 'AI Active'}
                      </span>
                    </div>
                  )}
                  
                  {/* FIXED: onChange handler */}
                  <select
                    value={difficulty}
                    onChange={handleDifficultyChange}
                    className="bg-secondary/30 border border-glass-border rounded-lg px-3 py-2 text-sm text-foreground outline-none"
                  >
                    <option value="easy">Easy (8 pts)</option>
                    <option value="medium">Medium (10 pts)</option>
                    <option value="hard">Hard (15 pts)</option>
                  </select>
                  
                  <button onClick={handleReset} className="p-2 rounded-lg glass-sm text-muted-foreground hover:text-foreground transition-colors">
                    <IconRefresh size={18} />
                  </button>
                </div>
              </div>

              {/* AI Performance Banner */}
              {Object.keys(aiDecisions).length > 0 && !isAiAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20"
                >
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <IconRobot size={24} className="text-primary" />
                      <div>
                        <p className="font-semibold text-sm">AI Assistant Active</p>
                        <p className="text-xs text-muted-foreground">
                          Compare your decisions with AI to learn and earn bonus points
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">AI Accuracy</p>
                        <p className="text-lg font-bold text-primary">
                          {Math.round((Object.values(aiDecisions).filter((d, i) => 
                            d === samplePosts[i]?.correctDecision
                          ).length / Object.keys(aiDecisions).length) * 100)}%
                        </p>
                      </div>
                      <div className="w-px h-8 bg-primary/20" />
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Bonus Available</p>
                        <p className="text-lg font-bold text-yellow-500">+5 pts/match</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* AI Comparison Toggle */}
              {Object.keys(aiDecisions).length > 0 && !isAiAnalyzing && (
                <div className="mb-4 flex items-center gap-2">
                  <button
                    onClick={() => setShowAiComparison(!showAiComparison)}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                      showAiComparison 
                        ? 'gradient-bg text-primary-foreground' 
                        : 'bg-secondary/30 text-muted-foreground'
                    }`}
                  >
                    {showAiComparison ? 'Hide AI Comparison' : 'Show AI Comparison'}
                  </button>
                  {!isBackendAvailable && (
                    <span className="text-xs text-red-400">
                      ⚠️ Start backend: python backend/api_server.py
                    </span>
                  )}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <AnimatePresence>
                  {items.map((item) => (
                    <PostCard 
                      key={item.id} 
                      item={item} 
                      onDecision={handleDecision}
                      aiDecision={showAiComparison ? aiDecisions[item.id] : undefined}
                      isAiAnalyzing={isAiAnalyzing}
                    />
                  ))}
                </AnimatePresence>
              </div>

              <DashboardCharts />

              {allDecided && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                  <button
                    onClick={() => setShowResult(true)}
                    className="w-full py-3 rounded-lg gradient-bg text-primary-foreground font-semibold text-sm glow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <IconTrophy size={18} /> View Results
                  </button>
                </motion.div>
              )}
            </div>

            {/* Stats panel */}
            <div className="lg:w-72 shrink-0">
              <h2 className="font-display font-semibold text-sm mb-4 text-foreground">Session Stats</h2>
              <Stats />
              
              {/* AI Performance Summary */}
              {Object.keys(aiDecisions).length > 0 && !isAiAnalyzing && (
                <div className="mt-6 glass-sm p-4">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <IconRobot size={16} />
                    AI Performance
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Decisions Made:</span>
                      <span>{Object.keys(aiDecisions).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">AI Accuracy:</span>
                      <span className="text-green-400">
                        {Math.round((Object.values(aiDecisions).filter((d, i) => 
                          d === samplePosts[i]?.correctDecision
                        ).length / Object.keys(aiDecisions).length) * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bonus Points:</span>
                      <span className="text-yellow-400">+5 per match</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Result modal */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowResult(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="glass p-8 max-w-md w-full text-center"
            >
              <button onClick={() => setShowResult(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <IconX size={20} />
              </button>
              <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4 glow">
                <IconTrophy size={28} className="text-primary-foreground" />
              </div>
              <h2 className="text-xl font-display font-bold mb-2">Session Complete!</h2>
              
              {/* AI Comparison Summary */}
              {Object.keys(aiDecisions).length > 0 && (
                <div className="mt-4 p-3 rounded-lg bg-secondary/30 text-left">
                  <p className="text-xs font-medium mb-2 flex items-center gap-2">
                    <IconRobot size={14} />
                    AI Comparison Summary:
                  </p>
                  <div className="space-y-1 text-xs max-h-40 overflow-y-auto">
                    {items.map((item) => {
                      const userDecision = item.decision;
                      const aiDecision = aiDecisions[item.id];
                      const match = userDecision && aiDecision && userDecision === aiDecision;
                      if (!userDecision) return null;
                      return (
                        <div key={item.id} className="flex justify-between items-center">
                          <span className="truncate max-w-[180px] text-muted-foreground">
                            {item.content.substring(0, 40)}...
                          </span>
                          <span className={match ? 'text-green-400' : 'text-red-400'}>
                            {match ? '✓ Match (+5)' : '✗ Different'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="glass-sm p-4">
                  <p className="text-2xl font-bold text-foreground">{state.stats.accuracy}%</p>
                  <p className="text-xs text-muted-foreground">Accuracy</p>
                </div>
                <div className="glass-sm p-4">
                  <p className="text-2xl font-bold text-foreground">{state.stats.avgScore}</p>
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                </div>
                <div className="glass-sm p-4">
                  <p className="text-2xl font-bold text-foreground">{state.stats.totalProcessed}</p>
                  <p className="text-xs text-muted-foreground">Processed</p>
                </div>
                <div className="glass-sm p-4">
                  <p className="text-2xl font-bold text-foreground">{state.stats.mistakes}</p>
                  <p className="text-xs text-muted-foreground">Mistakes</p>
                </div>
              </div>
              <button onClick={() => { setShowResult(false); handleReset(); }} className="mt-6 w-full py-2.5 rounded-lg border border-glass-border text-sm font-medium text-foreground hover:bg-secondary/30 transition-colors">
                Try Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}