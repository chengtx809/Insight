import React, { useState } from 'react';
import { Copy, Eye, EyeOff, FileText, Globe } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { GeneratedArticle } from '../types';
import { downloadUtils } from '../utils/download';
import { format } from 'date-fns';

interface Props {
  article: GeneratedArticle;
}

export const ArticleViewer: React.FC<Props> = ({ article }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(article.content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const previewContent = article.content.slice(0, 500) + (article.content.length > 500 ? '...' : '');

  return (
    <div className="scroll-card rounded-none p-8 animate-fade-in">
      {/* 文章头部信息 - 古书风格 */}
      <div className="border-b-2 border-ink-200 pb-6 mb-8">
        <h2 className="text-2xl font-bold text-ink-800 mb-4 font-serif text-center">{article.title}</h2>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-ink-500 font-kai">
          <span>撰于 {format(article.createdAt, 'yyyy年MM月dd日 HH:mm')}</span>
          <span className="text-ink-300">|</span>
          <span>共 {article.wordCount.toLocaleString()} 字</span>
          <span className="text-ink-300">|</span>
          <span>主题：{article.params.topic}</span>
        </div>
      </div>

      {/* 文章内容 - 古书排版 */}
      <div className="mb-8">
        <div className="prose-classic max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              // 自定义代码块样式
              code: ({ node, className, children, ...props }: any) => {
                const isInline = !className?.includes('language-');
                if (isInline) {
                  return (
                    <code className="bg-paper-200 text-vermilion-600 px-2 py-0.5 text-sm font-mono border border-ink-200" {...props}>
                      {children}
                    </code>
                  );
                }
                return (
                  <pre className="bg-paper-200 border-2 border-ink-200 p-4 overflow-x-auto my-6">
                    <code className="text-ink-700 text-sm font-mono" {...props}>
                      {children}
                    </code>
                  </pre>
                );
              },
              // 自定义标题样式 - 古书风格
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold text-ink-900 mb-6 pb-4 text-center" style={{ borderBottom: '2px solid', borderImage: 'linear-gradient(to right, transparent, #7d6e5d, transparent) 1' }}>
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold text-ink-800 mb-4 mt-10 pl-4 border-l-4 border-vermilion-500">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-semibold text-ink-800 mb-3 mt-8">
                  <span className="text-vermilion-500 mr-2">◇</span>
                  {children}
                </h3>
              ),
              // 自定义段落 - 首行缩进
              p: ({ children }) => (
                <p className="leading-loose mb-5 text-ink-700 text-justify" style={{ textIndent: '2em' }}>
                  {children}
                </p>
              ),
              // 自定义引用样式 - 古书风格
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-ink-400 bg-paper-200/50 pl-5 py-3 my-6 text-ink-600 relative">
                  <span className="text-4xl text-ink-300 absolute -left-1 -top-2 font-kai">"</span>
                  {children}
                </blockquote>
              ),
              // 自定义列表样式
              ul: ({ children }) => (
                <ul className="list-none space-y-2 text-ink-700 my-4 pl-4">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-2 text-ink-700 my-4 pl-4">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-ink-700">
                  <span className="text-vermilion-500 mr-2">•</span>
                  {children}
                </li>
              ),
              // 强调文字
              strong: ({ children }) => (
                <strong className="text-ink-900 font-bold">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="text-ink-600 not-italic underline decoration-wavy decoration-vermilion-400 underline-offset-4">{children}</em>
              ),
              // 分隔线
              hr: () => (
                <hr className="my-8 border-0 h-px" style={{ background: 'linear-gradient(to right, transparent, #b8ada0, transparent)' }} />
              ),
            }}
          >
            {isExpanded ? article.content : previewContent}
          </ReactMarkdown>
        </div>
        
        {article.content.length > 500 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-6 flex items-center gap-2 text-vermilion-600 hover:text-vermilion-700 font-serif mx-auto"
          >
            {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {isExpanded ? '收起全文' : '展开全文'}
          </button>
        )}
      </div>

      {/* 操作按钮 - 古书风格 */}
      <div className="flex flex-wrap gap-3 pt-6 border-t-2 border-ink-200 justify-center">
        <button
          onClick={handleCopy}
          className="btn-secondary flex items-center gap-2"
        >
          <Copy className="w-4 h-4" />
          {copySuccess ? '已复制' : '复制文本'}
        </button>

        <button
          onClick={() => downloadUtils.downloadAsMarkdown(article)}
          className="btn-secondary flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          下载 Markdown
        </button>

        <button
          onClick={() => downloadUtils.downloadAsHTML(article)}
          className="btn-secondary flex items-center gap-2"
        >
          <Globe className="w-4 h-4" />
          下载 HTML
        </button>
      </div>
    </div>
  );
};
