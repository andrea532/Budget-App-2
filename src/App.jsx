import { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext, AppProvider } from './context/AppContext';
import './styles/globals.css';

// Import di tutti i componenti
import Dashboard from './components/Dashboard';
import TransactionHistory from './components/TransactionHistory';
import FutureExpensesPage from './components/FutureExpensesPage';
import StatsPage from './components/StatsPage';
import SettingsPage from './components/SettingsPage';
import IncomeSetup from './components/IncomeSetup';
import ExpensesSetup from './components/ExpensesSetup';
import SavingsSetup from './components/SavingsSetup';
import Navigation from './components/Navigation';
import LoadingScreen from './components/LoadingScreen';

// Definizione delle animazioni per le transizioni tra pagine
const pageVariants = {
  initial: { opacity: 0, x: '-100%' },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: '100%' },
};

const pageTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

const AppContent = () => {
  const { currentView, theme, databaseInitialized, dataLoaded } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (databaseInitialized && dataLoaded) {
      // Mostra lo schermo di caricamento per almeno 1 secondo per dare un'esperienza migliore
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [databaseInitialized, dataLoaded]);

  // Funzione per renderizzare la vista corrente
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'history':
        return <TransactionHistory />;
      case 'future-expenses':
        return <FutureExpensesPage />;
      case 'stats':
        return <StatsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'income':
        return <IncomeSetup />;
      case 'expenses':
        return <ExpensesSetup />;
      case 'savings':
        return <SavingsSetup />;
      default:
        return <Dashboard />;
    }
  };

  if (isLoading) {
    return <LoadingScreen theme={theme} />;
  }

  return (
    <div
      className="app-container"
      style={{
        backgroundColor: theme?.background || '#F8FAFF',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 'env(safe-area-inset-top)' // Per gestire la safe area
      }}
    >
      {/* Contenitore principale con animazioni per le transizioni tra pagine */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          style={{
            height: '100%',
            paddingBottom: '80px', // Spazio base per la navigation bar
          }}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation bar fissa in basso */}
      <Navigation />
    </div>
  );
};

// Componente principale che wrappa tutto con il Provider del context
function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
