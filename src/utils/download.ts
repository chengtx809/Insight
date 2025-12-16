import { GeneratedArticle } from '../types';
import { format } from 'date-fns';
import { marked } from 'marked';
import katex from 'katex';

// 清理文件名，保留中文字符
const sanitizeFilename = (filename: string): string => {
  // 移除文件系统不允许的字符: \ / : * ? " < > |
  return filename.replace(/[\\/:*?"<>|]/g, '').trim() || '未命名文章';
};

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
    link.download = `${sanitizeFilename(article.title)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // 下载为HTML
  downloadAsHTML: (article: GeneratedArticle): void => {
    // 预处理 LaTeX 公式
    const processLatex = (content: string): string => {
      // 处理块级公式 $$...$$
      content = content.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
        try {
          return `<div class="math-block">${katex.renderToString(math.trim(), { displayMode: true, throwOnError: false })}</div>`;
        } catch {
          return `<div class="math-block math-error">$$${math}$$</div>`;
        }
      });
      // 处理行内公式 $...$
      content = content.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
        try {
          return katex.renderToString(math.trim(), { displayMode: false, throwOnError: false });
        } catch {
          return `<span class="math-error">$${math}$</span>`;
        }
      });
      return content;
    };

    // 先处理 LaTeX，再转换 Markdown
    const processedContent = processLatex(article.content);
    const renderedContent = marked.parse(processedContent) as string;
    
    const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.title}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
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
            font-size: 1.1em;
        }
        .content h1, .content h2, .content h3 {
            color: #1a202c;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
        }
        .content h1 { font-size: 1.8em; border-bottom: 1px solid #e1e5e9; padding-bottom: 0.3em; }
        .content h2 { font-size: 1.5em; }
        .content h3 { font-size: 1.2em; }
        .content p { margin: 1em 0; text-indent: 2em; text-align: justify; }
        .content ul, .content ol { margin: 1em 0; padding-left: 2em; }
        .content li { margin: 0.5em 0; }
        .content blockquote {
            border-left: 4px solid #ddd;
            margin: 1em 0;
            padding: 0.5em 1em;
            color: #666;
            background: #f9f9f9;
        }
        .content code {
            background: #f4f4f4;
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: Consolas, Monaco, 'Courier New', monospace;
            font-size: 0.9em;
        }
        .content pre {
            background: #f4f4f4;
            padding: 1em;
            overflow-x: auto;
            border-radius: 5px;
        }
        .content pre code {
            background: none;
            padding: 0;
        }
        .content strong { font-weight: 600; }
        .content em { font-style: italic; }
        .content hr { border: none; border-top: 1px solid #e1e5e9; margin: 2em 0; }
        .math-block { text-align: center; margin: 1.5em 0; overflow-x: auto; }
        .math-error { color: #c00; background: #fee; padding: 0.2em 0.4em; }
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
    <div class="content">${renderedContent}</div>
    <div class="footer">
        本文由吴军笔风教学文章生成器生成
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sanitizeFilename(article.title)}.html`;
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