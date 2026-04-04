import { useState, useEffect } from 'react';
import { motion, useSpring, useTransform, animate } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  IconArrowLeft, 
  IconShieldCheck, 
  IconAlertTriangle, 
  IconX, 
  IconFlag,
  IconBrain,
  IconChartBar,
  IconClock,
  IconCategory,
  IconScoreboard,
  IconFileText,
  IconPhoto,
  IconVideo,
  IconMusic,
  IconDownload,
  IconShare,
  IconCopy,
  IconCheck,
  IconRobot
} from '@tabler/icons-react';
import Navbar from '@/components/Navbar';

interface ModerationResult {
  action: 'ALLOW' | 'FLAG' | 'REMOVE';
  harmful_score: number;
  confidence: number;
  violations: string[];
  reason: string;
  content_type: string;
  detection_method: string;
  ai_available: boolean;
}

export default function DetailedAnalysis() {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState<ModerationResult | null>(null);
  const [contentType, setContentType] = useState<string>('text');
  const [contentText, setContentText] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  
  useEffect(() => {
    const state = location.state as { result: ModerationResult; contentType: string; content: string };
    
    if (state?.result) {
      setResult(state.result);
      setContentType(state.contentType);
      setContentText(state.content || '');
    } else {
      const savedResult = sessionStorage.getItem('lastModerationResult');
      const savedType = sessionStorage.getItem('lastContentType');
      const savedContent = sessionStorage.getItem('lastContent');
      
      if (savedResult) {
        setResult(JSON.parse(savedResult));
        setContentType(savedType || 'text');
        setContentText(savedContent || '');
      }
    }
  }, [location]);

  useEffect(() => {
    if (result) {
      const targetScore = result.harmful_score * 100;
      const animation = animate(0, targetScore, {
        duration: 1.5,
        onUpdate: (value) => setDisplayScore(Math.round(value)),
      });
      return () => animation.stop();
    }
  }, [result]);

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60">Loading analysis...</p>
          </div>
        </div>
      </div>
    );
  }

  const harmfulPercent = result.harmful_score * 100;
  const isHighRisk = harmfulPercent > 70;
  const isMediumRisk = harmfulPercent > 30 && harmfulPercent <= 70;
  const isLowRisk = harmfulPercent <= 30;

  const getScoreColor = () => {
    if (isLowRisk) return { bg: 'bg-green-500', text: 'text-green-400', glow: 'shadow-green-500/30', badge: 'badge-safe' };
    if (isMediumRisk) return { bg: 'bg-yellow-500', text: 'text-yellow-400', glow: 'shadow-yellow-500/30', badge: 'badge-risky' };
    return { bg: 'bg-red-500', text: 'text-red-400', glow: 'shadow-red-500/30', badge: 'badge-harmful' };
  };

  const getActionColor = () => {
    if (result.action === 'ALLOW') return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', button: 'btn-allow' };
    if (result.action === 'FLAG') return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', button: 'btn-flag' };
    return { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', button: 'btn-remove' };
  };

  const getContentIcon = () => {
    switch(contentType) {
      case 'text': return <IconFileText size={24} />;
      case 'image': return <IconPhoto size={24} />;
      case 'video': return <IconVideo size={24} />;
      case 'audio': return <IconMusic size={24} />;
      default: return <IconFileText size={24} />;
    }
  };

  const scoreColor = getScoreColor();
  const actionColor = getActionColor();
  const circumference = 2 * Math.PI * 110;
  const strokeDashoffset = circumference * (1 - harmfulPercent / 100);

  const handleCopyReport = () => {
    const report = `Moderation Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 CONTENT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Content Type: ${contentType.toUpperCase()}
Analyzed Content: ${contentText || 'Content uploaded for analysis'}

🎯 MODERATION RESULT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Action: ${result.action}
Harmful Score: ${harmfulPercent.toFixed(1)}%
Confidence: ${(result.confidence * 100).toFixed(0)}%
Detection Method: ${result.detection_method}

⚠️ VIOLATIONS DETECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${result.violations.length > 0 ? result.violations.join('\n') : 'No violations detected'}

🤖 AI EXPLANATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${result.reason}

Report Generated: ${new Date().toLocaleString()}
Powered by ModAI Content Moderation System
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <div className="pt-20 pb-8 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Back Button - Same style as Home page */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/')}
            className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg glass-effect text-white/60 hover:text-white transition-all"
          >
            <IconArrowLeft size={18} />
            Back to Upload
          </motion.button>

          {/* Header - Same style as Home page */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-effect text-xs text-purple-400 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              Detailed Analysis Report
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
              AI-Powered <span className="gradient-text">Moderation</span> Insights
            </h1>
            <p className="text-white/40 max-w-2xl mx-auto">
              Comprehensive analysis with real-time AI detection and detailed breakdown
            </p>
          </motion.div>

          {/* Main Grid - Same glass card style as Home page */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Circular Score */}
            <div className="lg:col-span-1 space-y-6">
              {/* Circular Score Card - Same glass style */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="glass-effect rounded-2xl p-6 text-center"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Harmfulness Score</h3>
                
                <div className="relative inline-flex items-center justify-center">
                  <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500 ${scoreColor.glow}`} style={{ backgroundColor: scoreColor.bg, opacity: 0.2 }} />
                  
                  <svg width="260" height="260" className="transform -rotate-90">
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={scoreColor.bg} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={scoreColor.bg} stopOpacity="0.8" />
                      </linearGradient>
                    </defs>
                    <circle cx="130" cy="130" r="110" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
                    <motion.circle
                      cx="130"
                      cy="130"
                      r="110"
                      fill="none"
                      stroke={scoreColor.bg}
                      strokeWidth="12"
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      style={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
                    />
                  </svg>
                  
                  <div className="absolute text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                    >
                      <span className="text-5xl font-bold text-white">{displayScore}</span>
                      <span className="text-2xl text-white/60">%</span>
                    </motion.div>
                    <div className={`mt-2 px-2 py-1 rounded-full text-xs font-medium ${scoreColor.badge}`}>
                      {isHighRisk ? 'High Risk' : isMediumRisk ? 'Medium Risk' : 'Low Risk'}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex justify-between text-xs">
                    <div className="text-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mx-auto mb-1" />
                      <span className="text-white/40">Safe (0-30%)</span>
                    </div>
                    <div className="text-center">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mx-auto mb-1" />
                      <span className="text-white/40">Risky (30-70%)</span>
                    </div>
                    <div className="text-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mx-auto mb-1" />
                      <span className="text-white/40">Harmful (70-100%)</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Stats Cards - Same glass style */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                {[
                  { icon: <IconBrain size={18} />, label: 'Confidence', value: `${(result.confidence * 100).toFixed(0)}%`, color: 'text-purple-400' },
                  { icon: <IconClock size={18} />, label: 'Detection Method', value: result.detection_method, color: 'text-blue-400' },
                  { icon: <IconRobot size={18} />, label: 'AI Status', value: result.ai_available ? 'Active' : 'Not Available', color: 'text-green-400' },
                ].map((item, idx) => (
                  <div key={idx} className="glass-effect rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-white/5`}>
                        <div className={item.color}>{item.icon}</div>
                      </div>
                      <span className="text-white/60 text-sm">{item.label}</span>
                    </div>
                    <span className="text-white font-semibold capitalize">{item.value}</span>
                  </div>
                ))}
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                <button
                  onClick={handleCopyReport}
                  className="w-full py-3 rounded-xl glass-effect text-white/80 font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  {copied ? <IconCheck size={18} className="text-green-400" /> : <IconCopy size={18} />}
                  {copied ? 'Copied!' : 'Copy Report'}
                </button>
              </motion.div>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Content Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="glass-effect rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${actionColor.bg}`}>
                      <div className={actionColor.text}>{getContentIcon()}</div>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs">Content Type</p>
                      <p className="text-white font-semibold capitalize">{contentType}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full ${actionColor.bg} border ${actionColor.border}`}>
                    <div className="flex items-center gap-2">
                      {result.action === 'ALLOW' && <IconShieldCheck size={14} className={actionColor.text} />}
                      {result.action === 'FLAG' && <IconFlag size={14} className={actionColor.text} />}
                      {result.action === 'REMOVE' && <IconX size={14} className={actionColor.text} />}
                      <span className={`text-sm font-semibold ${actionColor.text}`}>{result.action}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-xl bg-white/5">
                  <p className="text-white/80 text-sm leading-relaxed">
                    {contentText || 'Content uploaded for analysis'}
                  </p>
                </div>
              </motion.div>

              {/* Violations Card */}
              {result.violations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-effect rounded-2xl p-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <IconAlertTriangle size={20} className="text-rose-400" />
                    Violations Detected
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {result.violations.map((v) => (
                      <div key={v} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        <span className="text-rose-400 text-sm capitalize">{v.replace('_', ' ')}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* AI Explanation Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="glass-effect rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <IconBrain size={20} className="text-purple-400" />
                  AI Explanation
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">{result.reason}</p>
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-white/40 text-xs">
                    Analyzed using {result.detection_method} with {(result.confidence * 100).toFixed(0)}% confidence
                  </p>
                </div>
              </motion.div>

              {/* Score Breakdown Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-effect rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <IconScoreboard size={20} className="text-yellow-400" />
                  Score Breakdown
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/60">Harmful Score</span>
                      <span className={`font-semibold ${scoreColor.text}`}>{harmfulPercent.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all duration-700 ${scoreColor.bg}`} style={{ width: `${harmfulPercent}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/60">Confidence Score</span>
                      <span className="text-white font-semibold">{(result.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="h-2 rounded-full bg-purple-500 transition-all duration-700" style={{ width: `${result.confidence * 100}%` }} />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Recommendations Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="glass-effect rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Recommendations</h3>
                <div className="space-y-3">
                  {result.action === 'ALLOW' && (
                    <>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/10">
                        <IconShieldCheck size={18} className="text-emerald-400 mt-0.5" />
                        <div>
                          <p className="text-white/80 text-sm font-medium">Content is Safe</p>
                          <p className="text-white/40 text-xs">This content meets community guidelines and can be published.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10">
                        <IconChartBar size={18} className="text-blue-400 mt-0.5" />
                        <div>
                          <p className="text-white/80 text-sm font-medium">Consider Monitoring</p>
                          <p className="text-white/40 text-xs">While safe, keep an eye on user behavior patterns.</p>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {result.action === 'FLAG' && (
                    <>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10">
                        <IconFlag size={18} className="text-amber-400 mt-0.5" />
                        <div>
                          <p className="text-white/80 text-sm font-medium">Human Review Required</p>
                          <p className="text-white/40 text-xs">This content should be reviewed by a human moderator.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/10">
                        <IconAlertTriangle size={18} className="text-orange-400 mt-0.5" />
                        <div>
                          <p className="text-white/80 text-sm font-medium">Potential Policy Violation</p>
                          <p className="text-white/40 text-xs">May violate community guidelines regarding {result.violations.join(', ')}.</p>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {result.action === 'REMOVE' && (
                    <>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-rose-500/10">
                        <IconX size={18} className="text-rose-400 mt-0.5" />
                        <div>
                          <p className="text-white/80 text-sm font-medium">Content Should Be Removed</p>
                          <p className="text-white/40 text-xs">This content violates community guidelines.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-rose-500/10">
                        <IconAlertTriangle size={18} className="text-rose-400 mt-0.5" />
                        <div>
                          <p className="text-white/80 text-sm font-medium">Action Required</p>
                          <p className="text-white/40 text-xs">Consider issuing a warning or taking appropriate action.</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}