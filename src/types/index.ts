export interface LLMConfig {
  endpoint: string;
  model: string;
  apiKey: string;
  temperature?: number;
  // maxTokens已移除，不再限制生成长度
}

export interface ArticleParams {
  topic: string;
  relatedProblems: string;
  targetAudience: string;
}

export interface GeneratedArticle {
  id: string;
  title: string;
  content: string;
  params: ArticleParams;
  llmConfig: Omit<LLMConfig, 'apiKey'>;
  createdAt: Date;
  wordCount: number;
}

export interface GenerationStatus {
  isGenerating: boolean;
  currentStep: string;
  error?: string;
  streamingContent?: string; // 流式输出的实时内容
}