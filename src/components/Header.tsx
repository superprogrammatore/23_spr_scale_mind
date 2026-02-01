import { Brain, Pause, Play, RotateCcw, Info, Book, HelpCircle, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

/**
 * HEADER COMPONENT
 * 
 * Header dell'app con logo animato, controlli simulazione e accesso al glossario.
 */

interface HeaderProps {
  isPaused: boolean;
  onTogglePause: () => void;
  onReset: () => void;
  onOpenConcepts: () => void;
  onOpenOnboarding: () => void;
  onLogout: () => void;
}

export function Header({ 
  isPaused, 
  onTogglePause, 
  onReset,
  onOpenConcepts,
  onOpenOnboarding,
  onLogout
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo animato */}
          <div className="flex items-center gap-3">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                animate={{ 
                  boxShadow: [
                    '0 0 20px hsl(180, 100%, 50%, 0.3)',
                    '0 0 40px hsl(180, 100%, 50%, 0.5)',
                    '0 0 20px hsl(180, 100%, 50%, 0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Brain className="w-6 h-6 text-primary-foreground" />
                </motion.div>
              </motion.div>
            </motion.div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                <span className="gradient-text">Scale</span>Mind
              </h1>
              <p className="text-xs text-muted-foreground">
                Impara a pensare scalabile
              </p>
            </div>
          </div>
          
          {/* Controlli */}
          <div className="flex items-center gap-2">
            {/* Pulsante Glossario */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onOpenConcepts}
                  className="gap-2 hidden sm:flex"
                >
                  <Book className="w-4 h-4" />
                  Glossario
                </Button>
              </TooltipTrigger>
              <TooltipContent>Apri il glossario dei termini</TooltipContent>
            </Tooltip>
            
            {/* Pulsante Tutorial */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onOpenOnboarding}
                >
                  <HelpCircle className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Rivedi il tutorial</TooltipContent>
            </Tooltip>
            
            <div className="w-px h-6 bg-border mx-1" />
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onTogglePause}
                  className={cn(
                    'transition-colors',
                    isPaused && 'border-warning text-warning hover:text-warning'
                  )}
                >
                  <motion.div
                    animate={isPaused ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {isPaused ? (
                      <Play className="w-4 h-4" />
                    ) : (
                      <Pause className="w-4 h-4" />
                    )}
                  </motion.div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isPaused ? 'Riprendi simulazione' : 'Pausa simulazione'}
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={onReset}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset simulazione</TooltipContent>
            </Tooltip>
            
            <div className="w-px h-6 bg-border mx-1" />
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onLogout}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Esci dall'app</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </header>
  );
}
