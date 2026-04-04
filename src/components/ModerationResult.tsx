// src/components/ModerationResult.tsx

import React from 'react';
import { ModerationResult as ModerationResultType } from '@/services/moderationService';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle, Shield } from 'lucide-react';

interface ModerationResultProps {
  result: ModerationResultType | null;
  isLoading: boolean;
  error: string | null;
}

export function ModerationResult({ result, isLoading, error }: ModerationResultProps) {
  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 bg-gray-300 rounded-full animate-bounce" />
          <div className="w-4 h-4 bg-gray-300 rounded-full animate-bounce delay-100" />
          <div className="w-4 h-4 bg-gray-300 rounded-full animate-bounce delay-200" />
          <span className="ml-2 text-gray-600">AI is analyzing your content...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-red-200 bg-red-50">
        <div className="flex items-start space-x-3">
          <XCircle className="w-6 h-6 text-red-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800">Connection Error</h3>
            <p className="text-sm text-red-600 mt-1">{error}</p>
            <p className="text-xs text-red-500 mt-2">
              Make sure the backend server is running on http://localhost:5000
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  const harmfulPercent = result.harmful_score * 100;
  const isAllowed = result.action === 'ALLOW';
  const isFlagged = result.action === 'FLAG';
  const isRemoved = result.action === 'REMOVE';

  const getIcon = () => {
    if (isAllowed) return <CheckCircle className="w-8 h-8 text-green-600" />;
    if (isFlagged) return <AlertTriangle className="w-8 h-8 text-yellow-600" />;
    return <XCircle className="w-8 h-8 text-red-600" />;
  };

  const getColorClass = () => {
    if (isAllowed) return 'border-green-200 bg-green-50';
    if (isFlagged) return 'border-yellow-200 bg-yellow-50';
    return 'border-red-200 bg-red-50';
  };

  const getProgressColor = () => {
    if (harmfulPercent < 30) return 'bg-green-500';
    if (harmfulPercent < 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className={`p-6 ${getColorClass()} transition-all duration-300`}>
      <div className="flex items-start space-x-4">
        {getIcon()}
        <div className="flex-1">
          <h3 className="text-lg font-semibold">
            {isAllowed && 'Content Approved'}
            {isFlagged && 'Content Flagged for Review'}
            {isRemoved && 'Content Blocked'}
          </h3>
          
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Harmful Score</span>
              <span className="font-medium">{harmfulPercent.toFixed(1)}%</span>
            </div>
            <Progress value={harmfulPercent} className={getProgressColor()} />
          </div>

          {result.violations.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium mb-2">Violations Detected:</p>
              <div className="flex flex-wrap gap-2">
                {result.violations.map((violation) => (
                  <Badge key={violation} variant="destructive" className="capitalize">
                    {violation.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <p className="text-sm mt-3">
            <span className="font-medium">Reason:</span> {result.reason}
          </p>

          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <Shield className="w-3 h-3" />
                <span>Detection: {result.detection_method}</span>
              </div>
              <span>AI Models: {result.ai_available ? 'Active ✅' : 'Not Available ❌'}</span>
              <span>Confidence: {(result.confidence * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}