import React, { useState, useRef, useEffect } from 'react';
import { ModelType } from '../../types';
import { ChevronDown, Sparkles, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface ModelSelectorProps {
  currentModel: ModelType;
  onSelect: (model: ModelType) => void;
}

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

  const models: { id: ModelType; name: string; icon: React.ReactNode; desc: string }[] = [
    { 
      id: 'gemini-3-flash-preview', 
      name: 'Gemini Flash', 
      icon: <Zap size={14} />,
      desc: 'Fastest reasoning'
    },
    { 
      id: 'gemini-3-pro-preview', 
      name: 'Gemini Pro', 
      icon: <Sparkles size={14} />,
      desc: 'Deep reasoning'
    },
  ];

  const selected = models.find(m => m.id === currentModel) || models[0];

  return (
    <div className="relative z-20" ref={containerRef}>
      <Button 
        variant="secondary" 
        size="sm" 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pr-2"
      >
        <span className="text-prism-accent/70">{selected.icon}</span>
        <span>{selected.name}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 animate-fade-in">
          <Card noPadding className="overflow-hidden">
            <div className="flex flex-col p-1">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    onSelect(model.id);
                    setIsOpen(false);
                  }}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors
                    ${currentModel === model.id ? 'bg-prism-accent/5 text-prism-accent' : 'text-slate-600 hover:bg-slate-50'}
                  `}
                >
                  <div className={`
                    p-2 rounded-lg 
                    ${currentModel === model.id ? 'bg-prism-accent/10' : 'bg-slate-100'}
                  `}>
                    {model.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{model.name}</div>
                    <div className="text-[10px] text-slate-400">{model.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};