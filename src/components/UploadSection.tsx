import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  IconFileText, 
  IconPhoto, 
  IconVideo, 
  IconMusic, 
  IconUpload, 
  IconShieldCheck, 
  IconAlertTriangle, 
  IconLoader2,
  IconChartBar,
  IconArrowRight
} from '@tabler/icons-react';
import { useModeration } from '@/hooks/useModeration';
import { moderationService } from '@/services/moderationService';

// Define types
type ContentType = 'text' | 'image' | 'video' | 'audio';

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

interface ApiError {
  message: string;
}

const tabs: { type: ContentType; label: string; icon: React.ReactNode }[] = [
  { type: 'text', label: 'Text', icon: <IconFileText size={18} /> },
  { type: 'image', label: 'Image', icon: <IconPhoto size={18} /> },
  { type: 'video', label: 'Video', icon: <IconVideo size={18} /> },
  { type: 'audio', label: 'Audio', icon: <IconMusic size={18} /> },
];



export default function UploadSection() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ContentType>('text');
  
const navigateToDetailedAnalysis = () => {
  const currentResult = getCurrentResult();
  const currentContent = activeTab === 'text' ? textContent : 
                         activeTab === 'image' ? selectedImage?.name : 
                         activeTab === 'video' ? selectedVideo?.name : '';
  
  if (currentResult) {
    navigate('/detailed-analysis', {
      state: {
        result: currentResult,
        contentType: activeTab,
        content: currentContent
      }
    });
  }
};


  // Text state
  const [textContent, setTextContent] = useState('');
  const [textResult, setTextResult] = useState<ModerationResult | null>(null);
  const [isTextLoading, setIsTextLoading] = useState(false);
  const [textError, setTextError] = useState<string | null>(null);
  
  // Image state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageResult, setImageResult] = useState<ModerationResult | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  
  // Video state
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoResult, setVideoResult] = useState<ModerationResult | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  
  const { isBackendAvailable, checkBackend } = useModeration();

  useEffect(() => {
    checkBackend();
  }, [checkBackend]);

  // Handle Text Analysis
  const handleTextAnalyze = async () => {
    if (!textContent.trim()) return;
    
    setIsTextLoading(true);
    setTextError(null);
    setTextResult(null);
    
    try {
      const response = await fetch('http://localhost:5000/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: { type: 'text', data: textContent }
        })
      });
      const result: ModerationResult = await response.json();
      setTextResult(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setTextError(errorMessage);
    } finally {
      setIsTextLoading(false);
    }
  };

  // Handle Image Upload & Analysis
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedImage(file);
    setImageResult(null);
    setImageError(null);
    setIsImageLoading(true);
    
    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    
    // Convert to base64 and analyze
    const base64 = await moderationService.fileToBase64(file);
    
    try {
      const response = await fetch('http://localhost:5000/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: { type: 'image', data: base64 }
        })
      });
      const result: ModerationResult = await response.json();
      setImageResult(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setImageError(errorMessage);
    } finally {
      setIsImageLoading(false);
    }
  };

  // Handle Video Upload & Analysis
  const handleVideoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedVideo(file);
    setVideoResult(null);
    setVideoError(null);
    setIsVideoLoading(true);
    
    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);
    
    // Convert to base64 and analyze
    const base64 = await moderationService.fileToBase64(file);
    
    try {
      const response = await fetch('http://localhost:5000/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: { 
            type: 'video', 
            data: base64,
            filename: file.name,
            size: file.size
          }
        })
      });
      const result: ModerationResult = await response.json();
      setVideoResult(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setVideoError(errorMessage);
    } finally {
      setIsVideoLoading(false);
    }
  };

  // Reset current tab's state
  const handleTabChange = (type: ContentType) => {
    setActiveTab(type);
  };

  // Clear current tab's result (for new upload)
  const clearCurrentResult = () => {
    if (activeTab === 'text') {
      setTextContent('');
      setTextResult(null);
      setTextError(null);
    } else if (activeTab === 'image') {
      setSelectedImage(null);
      setImagePreview(null);
      setImageResult(null);
      setImageError(null);
    } else if (activeTab === 'video') {
      setSelectedVideo(null);
      setVideoPreview(null);
      setVideoResult(null);
      setVideoError(null);
    }
  };

  // Navigate to dashboard with current result
  const navigateToDashboard = () => {
    const currentResult = getCurrentResult();
    if (currentResult) {
      sessionStorage.setItem('lastModerationResult', JSON.stringify(currentResult));
      sessionStorage.setItem('lastContentType', activeTab);
      if (activeTab === 'text') {
        sessionStorage.setItem('lastContent', textContent);
      }
    }
    navigate('/dashboard');
  };

  const getCurrentResult = (): ModerationResult | null => {
    if (activeTab === 'text') return textResult;
    if (activeTab === 'image') return imageResult;
    if (activeTab === 'video') return videoResult;
    return null;
  };

  const getCurrentLoading = (): boolean => {
    if (activeTab === 'text') return isTextLoading;
    if (activeTab === 'image') return isImageLoading;
    if (activeTab === 'video') return isVideoLoading;
    return false;
  };

  const getCurrentError = (): string | null => {
    if (activeTab === 'text') return textError;
    if (activeTab === 'image') return imageError;
    if (activeTab === 'video') return videoError;
    return null;
  };

  const hasCurrentResult = (): boolean => {
    if (activeTab === 'text') return textResult !== null;
    if (activeTab === 'image') return imageResult !== null;
    if (activeTab === 'video') return videoResult !== null;
    return false;
  };

  const renderResult = (result: ModerationResult, type: string): React.ReactNode => {
    if (!result) return null;
    
    const harmfulPercent = result.harmful_score * 100;
    const isHighRisk = harmfulPercent > 70;
    const isMediumRisk = harmfulPercent > 30 && harmfulPercent <= 70;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mt-6 p-5 rounded-xl border-2 transition-all ${
          result.action === 'ALLOW' ? 'border-green-500/30 bg-green-500/10' :
          result.action === 'FLAG' ? 'border-yellow-500/30 bg-yellow-500/10' :
          'border-red-500/30 bg-red-500/10'
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          {result.action === 'ALLOW' && <IconShieldCheck size={28} className="text-green-500" />}
          {result.action === 'FLAG' && <IconAlertTriangle size={28} className="text-yellow-500" />}
          {result.action === 'REMOVE' && <IconAlertTriangle size={28} className="text-red-500" />}
          <div>
            <h3 className={`font-bold text-lg ${
              result.action === 'ALLOW' ? 'text-green-500' :
              result.action === 'FLAG' ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {result.action === 'ALLOW' && '✅ Content is Safe'}
              {result.action === 'FLAG' && '⚠️ Content Flagged for Review'}
              {result.action === 'REMOVE' && '❌ Harmful Content Detected'}
            </h3>
            <p className="text-white/60 text-sm">Analyzed {type}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white/60">Harmful Score</span>
              <span className={`font-semibold ${
                isHighRisk ? 'text-red-400' : isMediumRisk ? 'text-yellow-400' : 'text-green-400'
              }`}>{harmfulPercent.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-700 ${
                  isHighRisk ? 'bg-red-500' : isMediumRisk ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${harmfulPercent}%` }}
              />
            </div>
          </div>

          {result.violations && result.violations.length > 0 && (
            <div>
              <span className="text-white/60 text-sm">Violations:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {result.violations.map((v: string) => (
                  <span key={v} className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">
                    {v.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="text-white/60 text-sm">
            <strong>Reason:</strong> {result.reason}
          </p>
          
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-white/40 text-xs">Detection: {result.detection_method}</span>
            <span className="text-white/40 text-xs">Confidence: {(result.confidence * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Navigate to Dashboard Button */}
        <button
  onClick={navigateToDetailedAnalysis}
  className="mt-4 w-full py-2.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 font-medium text-sm hover:bg-purple-500/30 transition-all flex items-center justify-center gap-2"
>
  <IconChartBar size={16} />
  View Detailed Analysis
  <IconArrowRight size={14} />
</button>
      </motion.div>
    );
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Try It <span className="gradient-text">Now</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Upload your content and let our AI analyze it in real-time
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto glass p-6 md:p-8"
        >
          {/* Backend Status */}
          {!isBackendAvailable && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400 text-center">
              ⚠️ AI Backend not connected. Run: python backend/api_server.py
              <button onClick={checkBackend} className="ml-3 underline hover:no-underline">Retry</button>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.type}
                onClick={() => handleTabChange(tab.type)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.type
                    ? 'gradient-bg text-primary-foreground'
                    : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Text Tab */}
          {activeTab === 'text' && (
            <div>
              {!textResult ? (
                <>
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Paste your text content here to analyze..."
                    className="w-full h-40 p-4 rounded-lg bg-secondary/30 border border-glass-border text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary/50 transition-colors"
                  />
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <button
                      onClick={() => setTextContent("I love this beautiful day! The sun is shining.")}
                      className="text-xs px-2 py-1 rounded bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      ✅ Safe Example
                    </button>
                    <button
                      onClick={() => setTextContent("I want to kill you and watch you die")}
                      className="text-xs px-2 py-1 rounded bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      ❌ Violence Example
                    </button>
                    <button
                      onClick={() => setTextContent("You are so stupid and worthless")}
                      className="text-xs px-2 py-1 rounded bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      ❌ Hate Speech Example
                    </button>
                  </div>
                  <button
                    onClick={handleTextAnalyze}
                    disabled={isTextLoading || !textContent.trim() || !isBackendAvailable}
                    className="mt-4 w-full py-3 rounded-lg gradient-bg text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isTextLoading ? <><IconLoader2 size={18} className="animate-spin" /> Analyzing...</> : 'Check Content'}
                  </button>
                </>
              ) : (
                <div>
                  {renderResult(textResult, 'text')}
                  <button
                    onClick={clearCurrentResult}
                    className="mt-3 w-full py-2 rounded-lg border border-white/20 text-white/60 text-sm hover:bg-white/5 transition-colors"
                  >
                    Analyze New Text
                  </button>
                </div>
              )}
              {textError && <p className="mt-3 text-red-400 text-sm">{textError}</p>}
            </div>
          )}

          {/* Image Tab */}
          {activeTab === 'image' && (
            <div>
              {!imageResult ? (
                <>
                  <label className="block w-full p-8 text-center border-2 border-dashed border-glass-border rounded-lg cursor-pointer hover:border-primary/40 transition-colors">
                    <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                    <IconUpload size={32} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Drop your image here or click to browse</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">Supports: JPG, PNG, GIF (Max 50MB)</p>
                  </label>
                  {imagePreview && (
                    <div className="mt-4">
                      <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg mx-auto" />
                    </div>
                  )}
                  {isImageLoading && (
                    <div className="mt-4 text-center py-4">
                      <IconLoader2 size={32} className="animate-spin mx-auto text-primary mb-2" />
                      <p className="text-white/60 text-sm">AI Analyzing Image...</p>
                    </div>
                  )}
                </>
              ) : (
                <div>
                  {renderResult(imageResult, 'image')}
                  <button
                    onClick={clearCurrentResult}
                    className="mt-3 w-full py-2 rounded-lg border border-white/20 text-white/60 text-sm hover:bg-white/5 transition-colors"
                  >
                    Analyze New Image
                  </button>
                </div>
              )}
              {imageError && <p className="mt-3 text-red-400 text-sm">{imageError}</p>}
            </div>
          )}

          {/* Video Tab */}
          {activeTab === 'video' && (
            <div>
              {!videoResult ? (
                <>
                  <label className="block w-full p-8 text-center border-2 border-dashed border-glass-border rounded-lg cursor-pointer hover:border-primary/40 transition-colors">
                    <input type="file" accept="video/*" onChange={handleVideoSelect} className="hidden" />
                    <IconUpload size={32} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Drop your video here or click to browse</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">Supports: MP4, AVI, MOV (Max 100MB)</p>
                  </label>
                  {videoPreview && (
                    <div className="mt-4">
                      <video src={videoPreview} controls className="max-h-48 rounded-lg mx-auto" />
                    </div>
                  )}
                  {isVideoLoading && (
                    <div className="mt-4 text-center py-4">
                      <IconLoader2 size={32} className="animate-spin mx-auto text-primary mb-2" />
                      <p className="text-white/60 text-sm">AI Analyzing Video Frame by Frame...</p>
                    </div>
                  )}
                </>
              ) : (
                <div>
                  {renderResult(videoResult, 'video')}
                  <button
                    onClick={clearCurrentResult}
                    className="mt-3 w-full py-2 rounded-lg border border-white/20 text-white/60 text-sm hover:bg-white/5 transition-colors"
                  >
                    Analyze New Video
                  </button>
                </div>
              )}
              {videoError && <p className="mt-3 text-red-400 text-sm">{videoError}</p>}
            </div>
          )}

          {/* Audio Tab Placeholder */}
          {activeTab === 'audio' && (
            <div className="text-center p-8">
              <IconMusic size={48} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Audio moderation coming soon!</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Currently supporting text, image, and video</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}