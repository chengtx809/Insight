import { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Settings, History as HistoryIcon } from 'lucide-react';
import { LLMConfigForm } from './components/LLMConfigForm';
import { ArticleForm } from './components/ArticleForm';
import { GenerationProgress } from './components/GenerationProgress';
import { ArticleViewer } from './components/ArticleViewer';
import { ArticleHistory } from './components/ArticleHistory';
import { LLMConfig, ArticleParams, GeneratedArticle, GenerationStatus } from './types';
import { LLMService } from './services/llmService';
import { storageUtils } from './utils/storage';

type TabType = 'generate' | 'history' | 'settings';

function App() {
  // 状态管理
  const [activeTab, setActiveTab] = useState<TabType>('generate');
  const [llmConfig, setLLMConfig] = useState<LLMConfig>({
    endpoint: '',
    model: '',
    apiKey: '',
    temperature: 0.7,
  });
  
  const [articleParams, setArticleParams] = useState<ArticleParams>({
    topic: '',
    relatedProblems: '',
    targetAudience: '',
  });

  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({
    isGenerating: false,
    currentStep: '',
  });

  const [articles, setArticles] = useState<GeneratedArticle[]>([]);
  const [generatedArticle, setGeneratedArticle] = useState<GeneratedArticle | null>(null);
  const [historyViewArticle, setHistoryViewArticle] = useState<GeneratedArticle | null>(null);

  // 初始化数据
  useEffect(() => {
    const savedConfig = storageUtils.loadLLMConfig();
    if (savedConfig) {
      setLLMConfig(savedConfig);
    }

    const savedArticles = storageUtils.loadArticles();
    setArticles(savedArticles);
  }, []);

  // 保存LLM配置
  const handleLLMConfigChange = (config: LLMConfig) => {
    setLLMConfig(config);
    storageUtils.saveLLMConfig(config);
  };

  // 生成文章
  const handleGenerateArticle = async () => {
    if (!llmConfig.endpoint || !llmConfig.apiKey || !llmConfig.model) {
      alert('请先配置LLM设置');
      setActiveTab('settings');
      return;
    }

    setGenerationStatus({
      isGenerating: true,
      currentStep: '准备生成...',
    });

    try {
      const service = new LLMService(llmConfig);
      
      const content = await service.generateArticle(
        articleParams,
        (step, streamingContent) => {
          setGenerationStatus({
            isGenerating: true,
            currentStep: step,
            streamingContent,
          });
        }
      );

      // 创建文章对象
      const article: GeneratedArticle = {
        id: Date.now().toString(),
        title: `${articleParams.topic} - 吴军笔风教学文章`,
        content,
        params: articleParams,
        llmConfig: {
          endpoint: llmConfig.endpoint,
          model: llmConfig.model,
          temperature: llmConfig.temperature,
        },
        createdAt: new Date(),
        wordCount: content.length,
      };

      // 保存文章
      storageUtils.saveArticle(article);
      setArticles(prev => [article, ...prev]);
      setGeneratedArticle(article);

      setGenerationStatus({
        isGenerating: false,
        currentStep: '生成完成！',
      });

      // 3秒后清除状态
      setTimeout(() => {
        setGenerationStatus({
          isGenerating: false,
          currentStep: '',
        });
      }, 3000);

    } catch (error) {
      console.error('生成文章失败:', error);
      setGenerationStatus({
        isGenerating: false,
        currentStep: '',
        error: error instanceof Error ? error.message : '生成失败，请检查配置并重试',
      });
    }
  };

  // 删除文章
  const handleDeleteArticle = (id: string) => {
    storageUtils.deleteArticle(id);
    setArticles(prev => prev.filter(article => article.id !== id));
    if (historyViewArticle?.id === id) {
      setHistoryViewArticle(null);
    }
    if (generatedArticle?.id === id) {
      setGeneratedArticle(null);
    }
  };

  // 清空所有文章
  const handleClearAllArticles = () => {
    storageUtils.clearAllArticles();
    setArticles([]);
    setHistoryViewArticle(null);
  };

  // 选择历史文章查看
  const handleSelectArticle = (article: GeneratedArticle) => {
    setHistoryViewArticle(article);
  };

  const tabs = [
    { id: 'generate' as TabType, label: '撰文', icon: Sparkles },
    { id: 'history' as TabType, label: '书卷', icon: HistoryIcon },
    { id: 'settings' as TabType, label: '设置', icon: Settings },
  ];

  return (
    <div className="min-h-screen">
      {/* 头部 - 古书风格 */}
      <header className="bg-paper-50/90 backdrop-blur-sm border-b-2 border-ink-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              {/* 印章风格图标 */}
              <div className="w-12 h-12 bg-vermilion-500 flex items-center justify-center shadow-seal" style={{ transform: 'rotate(-2deg)' }}>
                <BookOpen className="w-7 h-7 text-paper-50" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-ink-800 font-serif tracking-wider">
                  见微
                </h1>
                <p className="text-sm text-ink-500 font-kai">
                  见微知著，洞察深意
                </p>
              </div>
            </div>
            {/* 装饰性印章 */}
            <div className="hidden md:block seal-decoration">
              文以载道
            </div>
          </div>
        </div>
      </header>

      {/* 导航标签 - 古书标签风格 */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex space-x-1 bg-paper-200/60 p-1 border-2 border-ink-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-serif font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-paper-50 text-vermilion-600 border-t-2 border-vermilion-500 shadow-sm'
                    : 'text-ink-600 hover:text-ink-800 hover:bg-paper-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.id === 'history' && articles.length > 0 && (
                  <span className="bg-vermilion-100 text-vermilion-600 px-2 py-0.5 text-xs border border-vermilion-300">
                    {articles.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧面板 */}
          <div className="lg:col-span-1 space-y-6">
            {activeTab === 'generate' && (
              <>
                <ArticleForm
                  params={articleParams}
                  onChange={setArticleParams}
                  onGenerate={handleGenerateArticle}
                  isGenerating={generationStatus.isGenerating}
                />
                <GenerationProgress status={generationStatus} />
              </>
            )}

            {activeTab === 'settings' && (
              <LLMConfigForm
                config={llmConfig}
                onChange={handleLLMConfigChange}
              />
            )}

            {activeTab === 'history' && (
              <ArticleHistory
                articles={articles}
                onSelectArticle={handleSelectArticle}
                onDeleteArticle={handleDeleteArticle}
                onClearAll={handleClearAllArticles}
              />
            )}
          </div>

          {/* 右侧内容区域 */}
          <div className="lg:col-span-2">
            {activeTab === 'history' && historyViewArticle ? (
              <ArticleViewer article={historyViewArticle} />
            ) : activeTab === 'generate' && generatedArticle ? (
              <ArticleViewer article={generatedArticle} />
            ) : generationStatus.streamingContent && generationStatus.isGenerating ? (
              // 显示流式生成的实时内容
              <div className="scroll-card rounded-none p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-jade-500 rounded-full animate-pulse"></div>
                  <h2 className="text-xl font-semibold text-ink-800 font-serif">
                    {`${articleParams.topic}`}
                  </h2>
                  <span className="text-sm text-ink-500 font-kai">墨迹未干...</span>
                </div>
                <div className="prose-classic">
                  <div className="whitespace-pre-wrap text-ink-700 leading-loose">
                    {generationStatus.streamingContent}
                    <span className="inline-block w-0.5 h-5 bg-ink-600 animate-pulse ml-1"></span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-ink-200 text-sm text-ink-500 text-center font-kai">
                  已书 {generationStatus.streamingContent.length} 字
                </div>
              </div>
            ) : (
              <div className="scroll-card rounded-none p-12 text-center">
                {/* 装饰性图案 */}
                <div className="w-24 h-24 mx-auto mb-8 relative">
                  <div className="absolute inset-0 border-2 border-ink-300 transform rotate-45"></div>
                  <div className="absolute inset-2 border border-ink-200 transform rotate-45"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-vermilion-500" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-ink-800 mb-4 font-serif">
                  欢迎使用见微
                </h3>
                <p className="text-ink-600 mb-8 max-w-md mx-auto font-kai leading-relaxed">
                  基于《数学之美》写作风格的AI教学文章生成工具。
                  用生活化类比讲解抽象概念，见微知著，洞察深意。
                </p>
                
                <div className="divider-classic"></div>
                
                <div className="space-y-3 text-sm text-ink-600 font-serif text-left max-w-lg mx-auto">
                  <p className="flex items-start gap-3">
                    <span className="text-vermilion-500">◆</span>
                    <span>吴军老师经典笔风：从第一性原理出发，历史与现代交织</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-vermilion-500">◆</span>
                    <span>深度教学内容：不仅讲"怎么做"，更要解释"为什么"</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-vermilion-500">◆</span>
                    <span>个性化定制：根据目标受众调整内容深度和表达方式</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-vermilion-500">◆</span>
                    <span>历史记录保存：支持文章下载和批量管理</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-vermilion-500">◆</span>
                    <span>流式输出：实时查看文章生成过程</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 页脚 - 古书风格 */}
      <footer className="mt-16 bg-paper-200/60 border-t-2 border-ink-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-ink-600 font-kai mb-2">
              灵感源于吴军老师《数学之美》等经典著作
            </p>
            <p className="text-sm text-ink-500 font-serif">
              愿每一知识点，皆以最优雅之方式传于学者
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
