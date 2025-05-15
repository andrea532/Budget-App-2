import { useContext } from 'react';
import { motion } from 'framer-motion';
import { Home, Calendar, Receipt, BarChart3, Settings } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Navigation = () => {
  const { currentView, setCurrentView, theme } = useContext(AppContext);

  const navItems = [
    { id: 'dashboard', icon: Home },
    { id: 'history', icon: Calendar },
    { id: 'future-expenses', icon: Receipt },
    { id: 'stats', icon: BarChart3 },
    { id: 'settings', icon: Settings },
  ];

  return (
    // Nel file Navigation.jsx, modifica il componente nav come segue:

<motion.nav
  initial={{ y: 100 }}
  animate={{ y: 0 }}
  className="navigation"
  style={{
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1E1F25',
    borderTop: `1px solid ${theme.border}`,
    zIndex: 1000, // Aumentato per essere sicuri che sia sopra tutto
    paddingBottom: 'max(24px, env(safe-area-inset-bottom))', // Usa il valore più grande tra i due
    paddingTop: '10px',
    boxShadow: '0 -4px 15px rgba(0, 0, 0, 0.2)'
  }}
>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '0',
          maxWidth: '428px',
          margin: '0 auto',
          height: '100%'
        }}
      >
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentView(item.id)}
            style={{
              background: 'none',
              border: 'none',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color:
                currentView === item.id ? theme.primary : theme.textSecondary,
              transition: 'all 0.3s ease',
            }}
          >
            <motion.div
              animate={{
                scale: currentView === item.id ? 1.2 : 1,
                color:
                  currentView === item.id
                    ? theme.primary
                    : theme.textSecondary,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                width: '46px',
                height: '46px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '14px',
                backgroundColor: currentView === item.id ? 'rgba(76, 111, 255, 0.15)' : 'transparent',
                boxShadow: currentView === item.id ? '0 0 12px rgba(76, 111, 255, 0.2)' : 'none',
              }}
            >
              <item.icon size={24} /> {/* Icona più grande */}
            </motion.div>
          </motion.button>
        ))}
      </div>
    </motion.nav>
  );
};

export default Navigation;
