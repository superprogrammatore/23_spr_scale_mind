import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock, AlertCircle, TrendingUp, Sparkles, BookOpen } from 'lucide-react';
import { useSimulation } from '@/hooks/useSimulation';
import { Header } from '@/components/Header';
import { MetricCard } from '@/components/MetricCard';
import { ResponseTimeChart } from '@/components/ResponseTimeChart';
import { UserSlider } from '@/components/UserSlider';
import { BottleneckList } from '@/components/BottleneckList';
import { StateComparison } from '@/components/StateComparison';
import { SystemGauge } from '@/components/SystemGauge';
import { TrafficFlow } from '@/components/TrafficFlow';
import { Onboarding } from '@/components/Onboarding';
import { ConceptsPanel } from '@/components/ConceptsPanel';
import { LoginScreen } from '@/components/LoginScreen';
import { isAuthenticated, logout } from '@/lib/auth';
import { SystemStatus } from '@/types/simulation';

/**
 * SCALEMIND - PAGINA PRINCIPALE
 * 
 * Questa app insegna i concetti di scalabilità attraverso simulazione visuale.
 * Tutto è simulato matematicamente per mostrare come un sistema si comporta sotto stress.
 * 
 * FEATURES PER PRINCIPIANTI:
 * - Tutorial onboarding con spiegazioni semplici
 * - Tooltip su ogni metrica
 * - Glossario dei termini
 * - Animazioni che visualizzano i concetti
 * - Descrizioni contestuali
 */

function Index() {
  const {
    metrics,
    config,
    history,
    activeBottlenecks,
    allBottlenecks,
    setUserMultiplier,
    togglePause,
    reset
  } = useSimulation();
  
  // Stato per autenticazione
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Stato per onboarding e pannelli
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showConcepts, setShowConcepts] = useState(false);
  
  // Controlla autenticazione all'avvio
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);
  
  // Controlla se è la prima visita
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('scalemind_onboarding_seen');
    if (hasSeenOnboarding) {
      setShowOnboarding(false);
    }
  }, []);
  
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
  };
  
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('scalemind_onboarding_seen', 'true');
  };
  
  const getSystemStatus = (): SystemStatus => {
    if (metrics.errorRate > 10 || metrics.responseTime > 500 || metrics.cpuUsage > 90) {
      return 'critical';
    }
    if (metrics.errorRate > 2 || metrics.responseTime > 200 || metrics.cpuUsage > 70) {
      return 'warning';
    }
    return 'healthy';
  };
  
  const systemStatus = getSystemStatus();
  
  // Testi di stato per principianti
  const statusMessages = {
    healthy: {
      title: '✅ Sistema Stabile',
      description: 'Il sistema gestisce bene il carico attuale. Prova ad aumentare gli utenti!'
    },
    warning: {
      title: '⚠️ Attenzione',
      description: 'Il sistema inizia a rallentare. I tempi di risposta aumentano.'
    },
    critical: {
      title: '🔥 Stato Critico',
      description: 'Troppo carico! Gli utenti vedono errori e ritardi significativi.'
    }
  };
  
  // Se non autenticato, mostra la schermata di login
  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }
  
  return (
    <div className="min-h-screen bg-background grid-pattern">
      {/* Onboarding per nuovi utenti */}
      <Onboarding 
        onComplete={handleOnboardingComplete}
      />
      
      {/* Pannello glossario */}
      <ConceptsPanel 
        isOpen={showConcepts} 
        onClose={() => setShowConcepts(false)} 
      />
      
      {/* Effetto glow animato di sfondo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: systemStatus === 'critical' 
              ? 'radial-gradient(circle, hsl(0, 85%, 55%), transparent)'
              : systemStatus === 'warning'
              ? 'radial-gradient(circle, hsl(35, 100%, 50%), transparent)'
              : 'radial-gradient(circle, hsl(180, 100%, 50%), transparent)'
          }}
        />
        <motion.div 
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{
            background: 'radial-gradient(circle, hsl(260, 60%, 50%), transparent)'
          }}
        />
      </div>
      
      {/* Mostra onboarding solo se attivo */}
      {showOnboarding ? null : (
        <>
          <Header 
            isPaused={config.isPaused} 
            onTogglePause={togglePause} 
            onReset={reset}
            onOpenConcepts={() => setShowConcepts(true)}
            onOpenOnboarding={() => setShowOnboarding(true)}
            onLogout={handleLogout}
          />
          
          <main className="container mx-auto px-4 py-8">
            {/* Banner di stato con spiegazione */}
            <motion.div 
              layout
              className={`glass-card p-6 mb-8 border transition-colors duration-500 ${
                systemStatus === 'healthy' ? 'border-success/30 bg-success/5' :
                systemStatus === 'warning' ? 'border-warning/30 bg-warning/5' :
                'border-destructive/30 bg-destructive/5'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <motion.h2 
                    key={systemStatus}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl font-bold mb-2 flex items-center gap-2"
                  >
                    <span className="gradient-text">ScaleMind</span>
                    <span className={
                      systemStatus === 'healthy' ? 'text-success' :
                      systemStatus === 'warning' ? 'text-warning' :
                      'text-destructive'
                    }>
                      {statusMessages[systemStatus].title}
                    </span>
                  </motion.h2>
                  <p className="text-muted-foreground max-w-xl">
                    {statusMessages[systemStatus].description}
                  </p>
                </div>
                
                {/* Indicatore visivo stato */}
                <motion.div 
                  animate={
                    systemStatus === 'critical' 
                      ? { scale: [1, 1.1, 1] }
                      : {}
                  }
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="flex items-center gap-3"
                >
                  <motion.div 
                    animate={
                      systemStatus === 'critical' 
                        ? { opacity: [1, 0.5, 1] }
                        : systemStatus === 'warning'
                        ? { opacity: [1, 0.7, 1] }
                        : {}
                    }
                    transition={{ duration: 1, repeat: Infinity }}
                    className={`w-4 h-4 rounded-full ${
                      systemStatus === 'healthy' ? 'bg-success' :
                      systemStatus === 'warning' ? 'bg-warning' :
                      'bg-destructive'
                    }`}
                  />
                  <span className="text-sm font-medium">
                    {metrics.activeUsers.toLocaleString('it-IT')} utenti simulati
                  </span>
                </motion.div>
              </div>
              
              {/* Tip per principianti */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 p-3 rounded-lg bg-background/50 border border-border/50 flex items-start gap-2"
              >
                <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Suggerimento:</strong> Usa lo slider qui sotto per simulare più utenti. 
                  Osserva come cambiano i numeri e i colori. Quando diventano rossi, il sistema è in difficoltà!
                </p>
              </motion.div>
            </motion.div>
            
            {/* Grid principale */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Colonna sinistra - Controlli */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <UserSlider
                    multiplier={config.userMultiplier}
                    onMultiplierChange={setUserMultiplier}
                  />
                </motion.div>
                
                {/* Visualizzazione traffico */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <TrafficFlow
                    requestsPerSecond={metrics.requestsPerSecond}
                    errorRate={metrics.errorRate}
                    responseTime={metrics.responseTime}
                  />
                </motion.div>
                
                {/* Gauges */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card p-5"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="font-semibold text-foreground">Risorse Sistema</h3>
                    <span className="text-xs text-muted-foreground">(simulate)</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    CPU e RAM mostrano quanto il server è sotto sforzo. Sopra 80% = problemi!
                  </p>
                  <div className="flex justify-around">
                    <SystemGauge
                      value={metrics.cpuUsage}
                      label="CPU"
                      status={metrics.cpuUsage > 90 ? 'critical' : metrics.cpuUsage > 70 ? 'warning' : 'healthy'}
                    />
                    <SystemGauge
                      value={metrics.memoryUsage}
                      label="RAM"
                      status={metrics.memoryUsage > 90 ? 'critical' : metrics.memoryUsage > 70 ? 'warning' : 'healthy'}
                    />
                  </div>
                </motion.div>
              </div>
              
              {/* Colonna centrale - Metriche */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard
                    title="Utenti"
                    value={metrics.activeUsers.toLocaleString('it-IT')}
                    icon={<Activity className="w-4 h-4" />}
                    status={systemStatus}
                    tooltip="Numero di utenti che stanno usando l'app in questo momento (simulato)"
                    description="Utenti attivi ora"
                  />
                  
                  <MetricCard
                    title="Richieste/s"
                    value={metrics.requestsPerSecond.toLocaleString('it-IT')}
                    icon={<TrendingUp className="w-4 h-4" />}
                    status={systemStatus}
                    tooltip="Quante azioni (click, caricamenti) il server deve gestire ogni secondo"
                    description="Azioni al secondo"
                  />
                  
                  <MetricCard
                    title="Latenza"
                    value={metrics.responseTime}
                    unit="ms"
                    icon={<Clock className="w-4 h-4" />}
                    status={metrics.responseTime > 500 ? 'critical' : metrics.responseTime > 200 ? 'warning' : 'healthy'}
                    trend={metrics.responseTime > 200 ? 'up' : 'stable'}
                    tooltip="Tempo di attesa tra click e risposta. Sotto 200ms = veloce!"
                    description="Tempo di risposta"
                  />
                  
                  <MetricCard
                    title="Errori"
                    value={metrics.errorRate}
                    unit="%"
                    icon={<AlertCircle className="w-4 h-4" />}
                    status={metrics.errorRate > 10 ? 'critical' : metrics.errorRate > 2 ? 'warning' : 'healthy'}
                    trend={metrics.errorRate > 5 ? 'up' : 'stable'}
                    tooltip="Percentuale di richieste fallite. Sopra 5% = utenti arrabbiati!"
                    description="Richieste fallite"
                  />
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <ResponseTimeChart data={history} status={systemStatus} />
                </motion.div>
                
                {/* Comparazione Stato */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <StateComparison currentUsers={metrics.activeUsers} />
                </motion.div>
              </div>
              
              {/* Colonna destra - Bottleneck */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <BottleneckList
                  activeBottlenecks={activeBottlenecks}
                  allBottlenecks={allBottlenecks}
                  currentUsers={metrics.activeUsers}
                />
              </motion.div>
            </div>
            
            {/* Footer educativo */}
            <motion.footer 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-12 glass-card p-6"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Cosa hai imparato?</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>📈 <strong>Più utenti = più carico</strong> - Le richieste crescono con gli utenti</li>
                    <li>⏱️ <strong>Latenza sale sotto stress</strong> - Il server rallenta quando è sovraccarico</li>
                    <li>🚨 <strong>I bottleneck bloccano tutto</strong> - Il punto più lento limita l'intero sistema</li>
                    <li>🌐 <strong>Stateless scala meglio</strong> - Non memorizzare stato sul server</li>
                  </ul>
                </div>
              </div>
            </motion.footer>
          </main>
        </>
      )}
    </div>
  );
}

export default Index;
