import { useState, useEffect } from 'react';
import { useModeration } from '@/hooks/useModeration';
import { ModerationResult } from '@/components/ModerationResult';
import Navbar from '@/components/Navbar';

export default function ModerationTest() {
  const [text, setText] = useState('');
  const { moderate, isLoading, error, lastResult, isBackendAvailable, checkBackend } = useModeration();

  useEffect(() => {
    checkBackend();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-6 pt-24 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">AI Moderation Test</h1>
        
        <div className={`p-4 rounded-lg mb-6 ${isBackendAvailable ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          Backend: {isBackendAvailable ? 'Connected ✅' : 'Not Connected ❌'}
          {!isBackendAvailable && (
            <button onClick={checkBackend} className="ml-4 underline">Retry</button>
          )}
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to moderate..."
          className="w-full p-4 rounded-lg bg-secondary/30 border border-glass-border min-h-[150px]"
        />
        
        <button
          onClick={() => moderate({ type: 'text', data: text })}
          disabled={isLoading || !text.trim()}
          className="mt-4 w-full py-3 rounded-lg gradient-bg text-primary-foreground font-semibold disabled:opacity-50"
        >
          {isLoading ? 'Analyzing...' : 'Moderate'}
        </button>

        <ModerationResult result={lastResult} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
}