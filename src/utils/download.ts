import { GeneratedArticle } from '../types';
import { format } from 'date-fns';

export const downloadUtils = {
  // 下载单篇文章为Markdown
  downloadAsMarkdown: (article: GeneratedArticle): void => {
    const content = `# ${article.title}

> 生成时间: ${format(article.createdAt, 'yyyy-MM-dd HH:mm:ss')}
> 知识点主题: ${article.params.topic}
> 目标受众: ${article.params.targetAudience}
> 字数统计: ${article.wordCount}

---

${article.content}

---

*本文由吴军笔风教学文章生成器生成*
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${article.title.replace(/[^\w\s-]/g, '').trim()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // 下载为HTML
  downloadAsHTML: (article: GeneratedArticle): void => {
    const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
            line-height: 1.8;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            color: #333;
            background: #fafafa;
        }
        .header {
            border-bottom: 2px solid #e1e5e9;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .title {
            font-size: 2.5em;
            font-weight: 700;
            color: #1a202c;
            margin-bottom: 10px;
        }
        .meta {
            color: #666;
            font-size: 0.9em;
        }
        .content {
            white-space: pre-wrap;
            font-size: 1.1em;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e1e5e9;
            text-align: center;
            color: #888;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">${article.title}</h1>
        <div class="meta">
            生成时间: ${format(article.createdAt, 'yyyy-MM-dd HH:mm:ss')} | 
            知识点: ${article.params.topic} | 
            字数: ${article.wordCount}
        </div>
    </div>
    <div class="content">${article.content.replace(/\n/g, '<br>')}</div>
    <div class="footer">
        本文由吴军笔风教学文章生成器生成
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${article.title.replace(/[^\w\s-]/g, '').trim()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // 批量下载为ZIP（简化版，实际项目中可以使用JSZip库）
  downloadMultipleAsText: (articles: GeneratedArticle[]): void => {
    const content = articles.map(article => 
      `${'='.repeat(60)}
${article.title}
生成时间: ${format(article.createdAt, 'yyyy-MM-dd HH:mm:ss')}
知识点: ${article.params.topic}
字数: ${article.wordCount}
${'='.repeat(60)}

${article.content}

`).join('\n\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `吴军笔风文章合集_${format(new Date(), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};