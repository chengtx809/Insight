import React, { useState } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { ArticleParams } from '../types';

interface Props {
  params: ArticleParams;
  onChange: (params: ArticleParams) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const ArticleForm: React.FC<Props> = ({ params, onChange, onGenerate, isGenerating }) => {
  const [errors, setErrors] = useState<Partial<ArticleParams>>({});

  const handleInputChange = (field: keyof ArticleParams, value: string) => {
    onChange({
      ...params,
      [field]: value,
    });
    
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ArticleParams> = {};
    
    if (!params.topic.trim()) {
      newErrors.topic = '请输入知识点主题';
    }
    
    if (!params.targetAudience.trim()) {
      newErrors.targetAudience = '请输入目标受众';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onGenerate();
    }
  };

  // 预设示例
  const topicExamples = [
    '递归算法的本质与应用',
    '机器学习中的梯度下降',
    '区块链的密码学原理',
    '动态规划的思维模式',
    '深度学习的反向传播',
  ];

  const audienceExamples = [
    '计算机科学专业学生',
    '有一定编程基础的开发者',
    '对算法感兴趣的初学者',
    '准备技术面试的求职者',
    '想要深入理解原理的工程师',
  ];

  return (
    <div className="scroll-card rounded-none p-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-6 h-6 text-vermilion-500" />
        <h2 className="text-xl font-semibold text-ink-800 font-serif">文章参数设置</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 知识点主题 */}
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-2 font-serif">
            知识点主题 <span className="text-vermilion-500">*</span>
          </label>
          <input
            type="text"
            value={params.topic}
            onChange={(e) => handleInputChange('topic', e.target.value)}
            placeholder="例如：递归算法的本质与应用"
            className={`input-field ${errors.topic ? 'border-vermilion-400 focus:ring-vermilion-200' : ''}`}
            disabled={isGenerating}
          />
          {errors.topic && (
            <p className="mt-1 text-sm text-vermilion-600 font-kai">{errors.topic}</p>
          )}
          
          {/* 主题示例 */}
          <div className="mt-3">
            <p className="text-xs text-ink-500 mb-2 font-kai">热门主题示例：</p>
            <div className="flex flex-wrap gap-2">
              {topicExamples.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => handleInputChange('topic', example)}
                  className="tag-classic transition-colors"
                  disabled={isGenerating}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 相关题目 */}
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-2 font-serif">
            相关题目列表
            <span className="text-ink-500 font-normal font-kai">（可选）</span>
          </label>
          <textarea
            value={params.relatedProblems}
            onChange={(e) => handleInputChange('relatedProblems', e.target.value)}
            placeholder="例如：&#10;1. LeetCode 70 - 爬楼梯问题&#10;2. 汉诺塔问题&#10;3. 二叉树遍历&#10;4. 斐波那契数列计算"
            rows={4}
            className="textarea-field"
            disabled={isGenerating}
          />
          <p className="mt-1 text-xs text-ink-500 font-kai">
            每行一个题目，AI会结合这些题目来讲解知识点
          </p>
        </div>

        {/* 目标受众 */}
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-2 font-serif">
            目标受众 <span className="text-vermilion-500">*</span>
          </label>
          <input
            type="text"
            value={params.targetAudience}
            onChange={(e) => handleInputChange('targetAudience', e.target.value)}
            placeholder="例如：计算机科学专业学生"
            className={`input-field ${errors.targetAudience ? 'border-vermilion-400 focus:ring-vermilion-200' : ''}`}
            disabled={isGenerating}
          />
          {errors.targetAudience && (
            <p className="mt-1 text-sm text-vermilion-600 font-kai">{errors.targetAudience}</p>
          )}
          
          {/* 受众示例 */}
          <div className="mt-3">
            <p className="text-xs text-ink-500 mb-2 font-kai">受众类型示例：</p>
            <div className="flex flex-wrap gap-2">
              {audienceExamples.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => handleInputChange('targetAudience', example)}
                  className="tag-classic transition-colors"
                  disabled={isGenerating}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 生成按钮 */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isGenerating}
            className="btn-primary w-full flex items-center justify-center gap-3 text-lg py-4"
          >
            <Sparkles className="w-5 h-5" />
            {isGenerating ? '正在撰文...' : '开始撰文'}
          </button>
        </div>
      </form>
    </div>
  );
};
