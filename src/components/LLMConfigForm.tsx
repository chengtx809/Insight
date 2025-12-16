import React, { useState, useRef, useEffect } from 'react';
import { Settings, TestTube, Eye, EyeOff } from 'lucide-react';
import { LLMConfig } from '../types';
import { LLMService } from '../services/llmService';

interface Props {
  config: LLMConfig;
  onChange: (config: LLMConfig) => void;
}

// 自适应输入框组件
const AdaptiveInput: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}> = ({ label, value, onChange, placeholder, type = 'text', required }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 检测内容是否溢出并自动展开
  useEffect(() => {
    const checkOverflow = () => {
      if (inputRef.current) {
        const isOverflow = inputRef.current.scrollWidth > inputRef.current.clientWidth;
        setIsExpanded(isOverflow);
      }
    };
    checkOverflow();
    // 监听窗口大小变化
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [value]);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-ink-700 mb-2 font-serif">
        {label} {required && <span className="text-vermilion-500">*</span>}
      </label>
      {isExpanded ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-field min-h-[80px] resize-y"
          required={required}
        />
      ) : (
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-field"
          required={required}
        />
      )}
    </div>
  );
};

export const LLMConfigForm: React.FC<Props> = ({ config, onChange }) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (field: keyof LLMConfig, value: string | number) => {
    onChange({
      ...config,
      [field]: value,
    });
  };

  // 判断URL是否只是域名（没有路径）
  const isOnlyDomain = (url: string): boolean => {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      // 如果pathname只是 "/" 或为空，说明只有域名
      return parsed.pathname === '/' || parsed.pathname === '';
    } catch {
      // 不是有效URL，检查是否包含路径
      const withoutProtocol = url.replace(/^https?:\/\//, '');
      return !withoutProtocol.includes('/');
    }
  };

  // 智能处理端点：只有纯域名才补全路径
  const normalizeEndpoint = (input: string): string => {
    if (!input) return '';
    
    // 确保有协议
    let url = input;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    
    // 移除末尾斜杠便于判断
    const cleanUrl = url.replace(/\/+$/, '');
    
    // 如果只是域名，自动补全 /v1/chat/completions
    if (isOnlyDomain(cleanUrl)) {
      return `${cleanUrl}/v1/chat/completions`;
    }
    
    // 已有路径，保持原样
    return cleanUrl;
  };

  // 获取显示用的输入值（用户输入的原始值）
  const getDisplayEndpoint = (endpoint: string): string => {
    return endpoint || '';
  };

  // 处理端点变化
  const handleEndpointChange = (value: string) => {
    handleInputChange('endpoint', normalizeEndpoint(value));
  };

  const testConnection = async () => {
    if (!config.endpoint || !config.apiKey || !config.model) {
      setConnectionStatus('error');
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('idle');

    try {
      const service = new LLMService(config);
      const isConnected = await service.testConnection();
      setConnectionStatus(isConnected ? 'success' : 'error');
    } catch {
      setConnectionStatus('error');
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <div className="scroll-card rounded-none p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-vermilion-500" />
        <h2 className="text-xl font-semibold text-ink-800 font-serif">LLM 配置</h2>
      </div>

      <div className="space-y-4">
        {/* API端点 */}
        <div className="w-full">
          <label className="block text-sm font-medium text-ink-700 mb-2 font-serif">
            API 端点 <span className="text-vermilion-500">*</span>
          </label>
          <input
            type="url"
            value={getDisplayEndpoint(config.endpoint)}
            onChange={(e) => handleEndpointChange(e.target.value)}
            placeholder="https://api.openai.com 或完整路径"
            className="input-field"
            required
          />
          <p className="mt-1 text-xs text-ink-500 font-kai">
            输入域名自动补全 /v1/chat/completions，输入完整路径则保持原样
          </p>
          {config.endpoint && (
            <div className="mt-2 p-2 bg-paper-100 border border-ink-200 rounded text-sm">
              <span className="text-ink-600 font-kai">请求端点预览：</span>
              <div className="text-ink-800 font-mono text-xs break-all mt-1">
                {config.endpoint}
              </div>
            </div>
          )}
        </div>

        {/* 模型 */}
        <AdaptiveInput
          label="模型名称"
          value={config.model}
          onChange={(value) => handleInputChange('model', value)}
          placeholder="gpt-4"
          required
        />

        {/* API密钥 */}
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-2 font-serif">
            API 密钥 <span className="text-vermilion-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={config.apiKey}
              onChange={(e) => handleInputChange('apiKey', e.target.value)}
              placeholder="sk-..."
              className="input-field pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
            >
              {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 高级设置 */}
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-2 font-serif">
            温度 (0-2)
          </label>
          <input
            type="number"
            min="0"
            max="2"
            step="0.1"
            value={config.temperature || 0.7}
            onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
            className="input-field"
          />
        </div>
      </div>

      {/* 连接测试 */}
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={testConnection}
          disabled={isTestingConnection || !config.endpoint || !config.apiKey || !config.model}
          className="btn-secondary flex items-center gap-2"
        >
          <TestTube className="w-4 h-4" />
          {isTestingConnection ? '测试中...' : '测试连接'}
        </button>

        {connectionStatus === 'success' && (
          <div className="flex items-center gap-2 text-jade-600 font-kai">
            <div className="w-2 h-2 bg-jade-500 rounded-full"></div>
            <span className="text-sm">连接成功</span>
          </div>
        )}

        {connectionStatus === 'error' && (
          <div className="flex items-center gap-2 text-vermilion-600 font-kai">
            <div className="w-2 h-2 bg-vermilion-500 rounded-full"></div>
            <span className="text-sm">连接失败</span>
          </div>
        )}
      </div>
    </div>
  );
};
