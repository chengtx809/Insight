import { LLMConfig, ArticleParams } from '../types';

export class LLMService {
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
  }

  async generateArticle(
    params: ArticleParams,
    onProgress?: (step: string, streamingContent?: string) => void
  ): Promise<string> {
    const prompt = this.buildPrompt(params);
    
    try {
      onProgress?.('连接到AI服务...');
      
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: this.config.temperature || 0.7,
          stream: true // 启用流式输出
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API请求失败: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
      }

      onProgress?.('正在生成文章...');

      if (!response.body) {
        throw new Error('响应体为空');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            break;
          }

          // 解码数据块
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          // 处理可能包含多个事件的缓冲区
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // 保留最后一个可能不完整的行

          for (const line of lines) {
            if (line.trim() === '') continue;
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              
              if (data === '[DONE]') {
                onProgress?.('生成完成!', fullContent);
                return fullContent;
              }

              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content;
                
                if (delta) {
                  fullContent += delta;
                  onProgress?.('正在生成文章...', fullContent);
                }
              } catch (parseError) {
                console.warn('解析流数据失败:', parseError, 'Data:', data);
              }
            }
          }
        }

        onProgress?.('生成完成!', fullContent);
        return fullContent;

      } finally {
        reader.releaseLock();
      }

    } catch (error) {
      console.error('LLM API调用失败:', error);
      throw error instanceof Error ? error : new Error('未知错误');
    }
  }

  private buildPrompt(params: ArticleParams): string {
    return `你是一位深受吴军《数学之美》影响的教育者和作家。请为"${params.topic}"创作一篇深度教学文章。

# 核心要求

## 1. 写作风格要求

**吴军笔风的核心特征：**
- **从第一性原理出发**：不满足于"怎么做"，而要追问"为什么"
- **历史与现代交织**：善用历史故事、科学家轶事引入概念
- **哲学与技术融合**：技术背后有思想，算法背后有智慧
- **类比化抽象**：用生活化的类比解释抽象概念
- **层次分明递进**：从简单到复杂，从具体到抽象
- **注重思维方式**：不是记住"术"，而是理解"道"

**语言特点：**
- 口语化但有深度，像在和朋友聊天
- 善用反问、设问引发思考
- 适当引用名人名言，但不堆砌
- 段落短小精悍，节奏明快
- 代码和文字有机结合

## 2. 文章结构要求

### 引子（约800-1000字）

**必须包含：**
1. 一个历史故事/科学家轶事/古代智慧
   - 优先选择：古希腊数学家、文艺复兴科学家、计算机先驱
   - 要求：真实、有趣、与主题相关

2. 从故事引出核心概念
   - 用"这个故事揭示了..."过渡
   - 提出文章要回答的核心问题

3. 点题：说明文章的目标
   - "这篇文章将讲述..."
   - "当你理解了X，你就理解了Y"

### 主体章节（3-5章，每章1500-2500字）

**章节递进逻辑：**
1. **第一章**：最基础的概念
2. **第二章**：核心机制
3. **第三章**：难点突破
4. **第四章**：应用与扩展
5. **第五章**（可选）：方法论

### 结语（约600-800字）

**必须包含：**
1. 升华主题：从技术到思想
2. 知识迁移：联系更广阔的领域
3. 学习建议：具体可操作
4. 激励性收尾

## 3. 具体知识点处理

**你将要讲解的知识点：**
${params.topic}

**相关题目：**
${params.relatedProblems}

**目标受众：**
${params.targetAudience}

请按照上述要求，创作一篇不少于5000字的深度教学文章。文章要有深度、有趣味、有启发，体现吴军老师的写作风格和思维方式。`;
  }

  // 测试API连接
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [{ role: 'user', content: '测试连接' }],
          temperature: 0.1,
        }),
      });

      return response.ok;
    } catch {
      return false;
    }
  }
}