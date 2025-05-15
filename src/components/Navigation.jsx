import { useContext } from 'react';
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
    <nav
      className="navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1E1F25',
        borderTop: `1px solid ${theme.border}`,
        paddingBottom: 'calc(10px + env(safe-area-inset-bottom))',
        paddingTop: '10px',
        boxShadow: '0 -4px 15px rgba(0, 0, 0, 0.2)',
        zIndex: 10000, // Z-index molto alto
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
        }}
      >
        {navItems.map((item) => (
          <button
            key={item.id}
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
            }}
          >
            <div
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
              <item.icon size={24} />
            </div>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
