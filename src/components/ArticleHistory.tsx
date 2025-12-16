import React, { useState } from 'react';
import { History, Search, Download, Trash2, Calendar, FileText } from 'lucide-react';
import { GeneratedArticle } from '../types';
import { downloadUtils } from '../utils/download';
import { format } from 'date-fns';

interface Props {
  articles: GeneratedArticle[];
  onSelectArticle: (article: GeneratedArticle) => void;
  onDeleteArticle: (id: string) => void;
  onClearAll: () => void;
}

export const ArticleHistory: React.FC<Props> = ({ 
  articles, 
  onSelectArticle, 
  onDeleteArticle, 
  onClearAll 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set());

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.params.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.params.targetAudience.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedArticles.size === filteredArticles.length) {
      setSelectedArticles(new Set());
    } else {
      setSelectedArticles(new Set(filteredArticles.map(a => a.id)));
    }
  };

  const handleSelectArticle = (id: string) => {
    const newSelected = new Set(selectedArticles);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedArticles(newSelected);
  };

  const handleBatchDownload = () => {
    const selectedArticlesList = articles.filter(a => selectedArticles.has(a.id));
    if (selectedArticlesList.length > 0) {
      downloadUtils.downloadMultipleAsText(selectedArticlesList);
    }
  };

  const handleBatchDelete = () => {
    if (window.confirm(`确定要删除选中的 ${selectedArticles.size} 篇文章吗？`)) {
      selectedArticles.forEach(id => onDeleteArticle(id));
      setSelectedArticles(new Set());
    }
  };

  if (articles.length === 0) {
    return (
      <div className="scroll-card rounded-none p-8 text-center animate-fade-in">
        <History className="w-12 h-12 text-ink-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-ink-600 mb-2 font-serif">暂无书卷</h3>
        <p className="text-ink-500 font-kai">撰写第一篇文章后，书卷将显示于此</p>
      </div>
    );
  }

  return (
    <div className="scroll-card rounded-none p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <History className="w-6 h-6 text-vermilion-500" />
          <h2 className="text-xl font-semibold text-ink-800 font-serif">书卷记录</h2>
          <span className="bg-paper-200 text-ink-600 px-2 py-1 text-sm border border-ink-200">
            {articles.length}
          </span>
        </div>
        
        {articles.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('确定要清空所有书卷吗？此操作不可恢复。')) {
                onClearAll();
              }
            }}
            className="text-vermilion-600 hover:text-vermilion-700 text-sm font-medium font-kai"
          >
            清空全部
          </button>
        )}
      </div>

      {/* 搜索栏 */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
        <input
          type="text"
          placeholder="搜索文章标题、主题或受众..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* 批量操作 */}
      {filteredArticles.length > 0 && (
        <div className="flex items-center justify-between mb-4 p-3 bg-paper-200/50 border border-ink-200">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedArticles.size === filteredArticles.length && filteredArticles.length > 0}
              onChange={handleSelectAll}
              className="rounded border-ink-300 text-vermilion-500 focus:ring-vermilion-300"
            />
            <span className="text-sm text-ink-600 font-kai">
              已选 {selectedArticles.size} / {filteredArticles.length} 篇
            </span>
          </div>
          
          {selectedArticles.size > 0 && (
            <div className="flex gap-2">
              <button
                onClick={handleBatchDownload}
                className="text-sm px-3 py-1 bg-jade-100 text-jade-700 border border-jade-300 hover:bg-jade-200 flex items-center gap-1 font-kai"
              >
                <Download className="w-3 h-3" />
                批量下载
              </button>
              <button
                onClick={handleBatchDelete}
                className="text-sm px-3 py-1 bg-vermilion-100 text-vermilion-700 border border-vermilion-300 hover:bg-vermilion-200 flex items-center gap-1 font-kai"
              >
                <Trash2 className="w-3 h-3" />
                批量删除
              </button>
            </div>
          )}
        </div>
      )}

      {/* 文章列表 */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => onSelectArticle(article)}
            className="border-2 border-ink-200 p-4 hover:border-vermilion-400 hover:bg-paper-100 transition-colors bg-paper-50 cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selectedArticles.has(article.id)}
                onChange={(e) => {
                  e.stopPropagation();
                  handleSelectArticle(article.id);
                }}
                onClick={(e) => e.stopPropagation()}
                className="mt-1 rounded border-ink-300 text-vermilion-500 focus:ring-vermilion-300"
              />
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-ink-800 truncate mb-1 font-serif">
                  {article.title}
                </h3>
                
                <div className="flex flex-wrap items-center gap-3 text-xs text-ink-500 mb-2 font-kai">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(article.createdAt, 'MM-dd HH:mm')}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {article.wordCount.toLocaleString()} 字
                  </span>
                </div>
                
                <div className="text-sm text-ink-600 font-kai">
                  <p className="truncate">主题: {article.params.topic}</p>
                  <p className="truncate">受众: {article.params.targetAudience}</p>
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('确定要删除这篇文章吗？')) {
                    onDeleteArticle(article.id);
                  }
                }}
                className="p-2 text-ink-400 hover:text-vermilion-600 hover:bg-vermilion-50 transition-colors"
                title="删除文章"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && searchTerm && (
        <div className="text-center py-8 text-ink-500">
          <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="font-kai">未找到匹配的文章</p>
        </div>
      )}
    </div>
  );
};
