import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Eye, EyeOff, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { verifyAccessCode, setAuthenticated } from '@/lib/auth';
import superProgrammatoreLogo from '@/assets/super-programmatore-logo.png';

/**
 * LOGIN SCREEN
 * 
 * Schermata di accesso con inserimento codice.
 * Il codice viene verificato tramite hash SHA-256.
 */

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [code, setCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError('Inserisci il codice di accesso');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simula un breve ritardo per feedback visivo
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const isValid = await verifyAccessCode(code);
      
      if (isValid) {
        setAuthenticated(true);
        onLoginSuccess();
      } else {
        setError('Codice di accesso non valido');
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch (err) {
      setError('Errore durante la verifica');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background grid-pattern flex items-center justify-center p-4">
      {/* Effetti di sfondo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, hsl(180, 100%, 50%), transparent)'
          }}
        />
        <motion.div 
          animate={{
            x: [0, -40, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-15"
          style={{
            background: 'radial-gradient(circle, hsl(260, 60%, 50%), transparent)'
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Card di login */}
        <motion.div 
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="glass-card p-8 border border-border/50"
        >
          {/* Logo Super Programmatore */}
          <div className="text-center mb-8">
            <motion.img 
              src={superProgrammatoreLogo}
              alt="Super Programmatore"
              className="w-48 h-auto mx-auto mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
            
            <h1 className="text-2xl font-bold mb-2">
              <span className="gradient-text">Scale</span>Mind
            </h1>
            <p className="text-muted-foreground text-sm">
              Inserisci il codice di accesso per continuare
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="access-code" className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-primary" />
                Codice di Accesso
              </Label>
              <div className="relative">
                <Input
                  id="access-code"
                  type={showCode ? 'text' : 'password'}
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError(null);
                  }}
                  placeholder="Inserisci il codice..."
                  className="pr-10 font-mono"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showCode ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Errore */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pulsante submit */}
            <Button
              type="submit"
              className="w-full gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifica in corso...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Accedi
                </>
              )}
            </Button>
          </form>

        </motion.div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Applicazione educativa per imparare la scalabilità
        </p>
      </motion.div>
    </div>
  );
}
