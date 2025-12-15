import { LLMConfig, GeneratedArticle } from '../types';

const STORAGE_KEYS = {
  LLM_CONFIG: 'wujun-generator-llm-config',
  ARTICLES: 'wujun-generator-articles',
} as const;

export const storageUtils = {
  // LLM配置存储
  saveLLMConfig: (config: LLMConfig): void => {
    localStorage.setItem(STORAGE_KEYS.LLM_CONFIG, JSON.stringify(config));
  },

  loadLLMConfig: (): LLMConfig | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.LLM_CONFIG);
    return stored ? JSON.parse(stored) : null;
  },

  // 文章历史存储
  saveArticle: (article: GeneratedArticle): void => {
    const articles = storageUtils.loadArticles();
    articles.unshift(article);
    // 最多保存100篇文章
    if (articles.length > 100) {
      articles.splice(100);
    }
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
  },

  loadArticles: (): GeneratedArticle[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.ARTICLES);
    if (!stored) return [];
    
    const articles = JSON.parse(stored);
    // 转换日期字符串为Date对象
    return articles.map((article: any) => ({
      ...article,
      createdAt: new Date(article.createdAt),
    }));
  },

  deleteArticle: (id: string): void => {
    const articles = storageUtils.loadArticles();
    const filtered = articles.filter(article => article.id !== id);
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(filtered));
  },

  clearAllArticles: (): void => {
    localStorage.removeItem(STORAGE_KEYS.ARTICLES);
  },
};