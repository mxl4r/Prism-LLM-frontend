'use client';
import React, { useEffect } from 'react';
import { Menu, Plus, LayoutGrid } from 'lucide-react';
import { Button } from '../ui/Button';
import { ModelSelector } from '../chat/ModelSelector';
import { ModelType } from '../../types';

interface NavbarProps {
  onToggleSidebar: () => void;
  currentModel: ModelType;
  onModelChange: (model: ModelType) => void;
  onNewChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, currentModel, onModelChange, onNewChat }) => {
  
  // Persist model choice for ChatPage to read
  useEffect(() => {
    localStorage.setItem('prism_model', currentModel);
  }, [currentModel]);

  return (
    // Added background classes for mobile visibility: bg-white/80 backdrop-blur-md border-b border-white/50
    // Removed these on medium screens: md:bg-transparent md:border-none md:backdrop-blur-none
    <header className="h-16 flex items-center justify-between px-4 z-10 bg-white/80 backdrop-blur-md border-b border-white/50 md:bg-transparent md:border-none md:backdrop-blur-none transition-all">
      <div className="flex items-center gap-3">
        <Button variant="icon" onClick={onToggleSidebar} className="md:hidden">
          <Menu size={20} />
        </Button>
        <Button variant="icon" onClick={onToggleSidebar} className="hidden md:flex text-slate-400">
          <LayoutGrid size={20} />
        </Button>
        <div className="hidden md:block w-px h-6 bg-slate-200/60 mx-1"></div>
        <ModelSelector currentModel={currentModel} onSelect={onModelChange} />
      </div>

      <div className="flex items-center gap-2">
         {/* Mobile new chat */}
         <Button variant="icon" className="md:hidden" onClick={onNewChat}>
            <Plus size={20} />
         </Button>
      </div>
    </header>
  );
};