import React from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { GenerationStatus } from '../types';

interface Props {
  status: GenerationStatus;
}

export const GenerationProgress: React.FC<Props> = ({ status }) => {
  if (!status.isGenerating && !status.error) {
    return null;
  }

  return (
    <div className="scroll-card rounded-none p-6 animate-fade-in">
      <div className="flex items-center gap-4">
        {status.error ? (
          <XCircle className="w-6 h-6 text-vermilion-500 flex-shrink-0" />
        ) : status.currentStep === '生成完成!' ? (
          <CheckCircle className="w-6 h-6 text-jade-500 flex-shrink-0" />
        ) : (
          <Loader2 className="w-6 h-6 text-ink-500 animate-spin flex-shrink-0" />
        )}
        
        <div className="flex-1">
          <span className="text-sm font-medium text-ink-700 font-serif">
            {status.error ? '撰文失败' : status.currentStep}
          </span>
          
          {status.error && (
            <div className="text-sm text-vermilion-600 bg-vermilion-50 p-3 border border-vermilion-200 mt-2 font-kai">
              {status.error}
            </div>
          )}
        </div>
      </div>
      
      {status.isGenerating && (
        <div className="mt-4 text-xs text-ink-500 font-kai">
          <p>• 请保持页面打开，撰文过程可能需要2-5分钟</p>
          <p>• 撰文时间取决于文章复杂度和AI模型响应速度</p>
        </div>
      )}

      {/* 字数统计 */}
      {status.streamingContent && status.isGenerating && (
        <div className="mt-6 border-t-2 border-ink-200 pt-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-2 h-2 bg-jade-500 rounded-full animate-pulse"></div>
            <span className="text-lg font-medium text-ink-700 font-serif">
              已书 {status.streamingContent.length} 字
            </span>
            <div className="w-2 h-2 bg-jade-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
};
