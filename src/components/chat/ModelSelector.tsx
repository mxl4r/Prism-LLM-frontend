'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ModelType, ModelProvider, AIModelConfig } from '../../types';
import { ChevronDown, Zap, Brain, Hexagon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface ModelSelectorProps {
  currentModel: ModelType;
  onSelect: (model: ModelType) => void;
}

const MODELS: AIModelConfig[] = [
  // Google
  { id: 'gemini-2.5-flash-latest', name: 'Gemini Flash', provider: 'google', description: 'Fast & Multimodal', multimodal: true },
  { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro', provider: 'google', description: 'High Reasoning', multimodal: true },
  // Alibaba / Qwen
  { id: 'qwen2.5:3b', name: 'Qwen 2.5 3B', provider: 'alibaba', description: 'Lightweight & Fast', multimodal: false },
  // Anthropic
  { id: 'claude-3-5-sonnet-latest', name: 'Claude 3.5 Sonnet', provider: 'anthropic', description: 'Coding & Analysis', multimodal: true },
  { id: 'claude-3-opus-latest', name: 'Claude 3 Opus', provider: 'anthropic', description: 'High Intelligence', multimodal: true },
];

export const ModelSelector: React.FC<ModelSelectorProps> = ({ currentModel, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = MODELS.find(m => m.id === currentModel) || MODELS[0];

  const getProviderIcon = (provider: ModelProvider) => {
    switch (provider) {
      case 'google': return <Zap size={14} className="text-blue-500" />;
      case 'alibaba': return <Hexagon size={14} className="text-purple-500" />;
      case 'anthropic': return <Brain size={14} className="text-orange-500" />;
      default: return <Zap size={14} className="text-slate-400" />;
    }
  };

  const getProviderLabel = (provider: ModelProvider): string => {
    switch (provider) {
      case 'google': return 'Google';
      case 'alibaba': return 'Alibaba / Qwen';
      case 'anthropic': return 'Anthropic';
      default: return provider;
    }
  };

  // Group models by provider (Array.from avoids --downlevelIteration requirement)
  const providers = Array.from(new Set(MODELS.map(m => m.provider))) as ModelProvider[];

  return (
    <div className="relative z-30" ref={containerRef}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pr-2 border-white/60 bg-white/40"
      >
        <span>{getProviderIcon(selected.provider)}</span>
        <span className="font-medium text-slate-700">{selected.name}</span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 animate-fade-in">
          <Card noPadding className="overflow-hidden shadow-xl ring-1 ring-slate-900/5">
            <div className="max-h-[400px] overflow-y-auto p-1">
              {providers.map(provider => {
                const providerModels = MODELS.filter(m => m.provider === provider);
                if (providerModels.length === 0) return null;

                return (
                  <div key={provider} className="mb-2 last:mb-0">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                      {getProviderLabel(provider)}
                    </div>
                    {providerModels.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          onSelect(model.id as ModelType);
                          setIsOpen(false);
                        }}
                        className={`
                          w-full flex items-start gap-3 px-3 py-2.5 text-left transition-colors
                          ${currentModel === model.id ? 'bg-prism-accent/5' : 'hover:bg-slate-50'}
                        `}
                      >
                        <div className="mt-0.5">
                          {getProviderIcon(model.provider)}
                        </div>
                        <div>
                          <div className={`text-sm font-medium ${currentModel === model.id ? 'text-prism-accent' : 'text-slate-700'}`}>
                            {model.name}
                          </div>
                          <div className="text-[10px] text-slate-500">{model.description}</div>
                        </div>
                        {currentModel === model.id && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-prism-accent mt-2"></div>
                        )}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};