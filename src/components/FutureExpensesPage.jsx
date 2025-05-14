import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Receipt,
  Plus,
  Minus,
  Pencil,
  Trash2,
  Calendar,
  Calculator,
  AlertCircle,
  Check,
} from 'lucide-react';
import { AppContext } from '../context/AppContext';

const FutureExpensesPage = () => {
  const {
    theme,
    futureExpenses,
    addFutureExpense,
    updateFutureExpense,
    deleteFutureExpense,
    categories,
  } = useContext(AppContext);

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: '',
    dueDate: '',
    categoryId: 1,
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Animazioni
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  // Imposta la data di scadenza di default a un mese da oggi
  useEffect(() => {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    
    if (!newExpense.dueDate) {
      setNewExpense({
        ...newExpense,
        dueDate: nextMonth.toISOString().split('T')[0],
      });
    }
  }, []);

  // Calcola i giorni rimanenti fino alla scadenza
  const calculateDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Calcola l'importo giornaliero da accantonare
  const calculateDailyAmount = (totalAmount, dueDate) => {
    const daysRemaining = calculateDaysRemaining(dueDate);
    if (daysRemaining <= 0) return 0;
    return (totalAmount / daysRemaining).toFixed(2);
  };

  // Calcola il totale giornaliero di tutte le spese future
  const getTotalDailyAmount = () => {
    return futureExpenses.reduce((total, expense) => {
      const dailyAmount = calculateDailyAmount(expense.amount, expense.dueDate);
      return total + parseFloat(dailyAmount);
    }, 0);
  };

  // Stile per gli input adattato al tema dark
  const inputStyle = {
    width: '100%',
    padding: '16px',
    borderRadius: '12px',
    border: `1px solid ${theme.border}`,
    backgroundColor: theme.background,
    color: theme.text,
    fontSize: '16px',
  };

  // Stile per select adattato al tema dark
  const selectStyle = {
    ...inputStyle,
    WebkitAppearance: 'menulist', // Mostra la freccia dropdown su webkit
    MozAppearance: 'menulist', // Mostra la freccia dropdown su Firefox
    appearance: 'menulist', // Standard
  };

  // Verifica la validità del form
  const validateForm = () => {
    if (!newExpense.name || newExpense.name.trim() === '') {
      setValidationError('Inserisci il nome della spesa');
      return false;
    }
    
    if (!newExpense.amount || isNaN(parseFloat(newExpense.amount)) || parseFloat(newExpense.amount) <= 0) {
      setValidationError('Inserisci un importo valido maggiore di zero');
      return false;
    }
    
    if (!newExpense.dueDate) {
      setValidationError('Seleziona una data di scadenza');
      return false;
    }
    
    setValidationError('');
    return true;
  };

  // Handlers
  const handleAddExpense = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const expense = {
        ...newExpense,
        amount: parseFloat(newExpense.amount),
        categoryId: parseInt(newExpense.categoryId),
      };
      
      console.log("Saving expense:", expense);

      if (editingExpenseId) {
        await updateFutureExpense(editingExpenseId, expense);
        setEditingExpenseId(null);
      } else {
        await addFutureExpense(expense);
      }

      setNewExpense({
        name: '',
        amount: '',
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        categoryId: 1,
        description: '',
      });
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setShowAddExpense(false);
      }, 1500);
    } catch (error) {
      console.error("Errore nel salvataggio:", error);
      setValidationError('Errore nel salvataggio. Riprova più tardi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditExpense = (expense) => {
    setNewExpense({
      name: expense.name,
      amount: expense.amount.toString(),
      dueDate: expense.dueDate,
      categoryId: expense.categoryId,
      description: expense.description || '',
    });
    setEditingExpenseId(expense.id);
    setShowAddExpense(true);
  };

  const handleDeleteExpense = (id) => {
    deleteFutureExpense(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="future-expenses-page"
      style={{ paddingBottom: '100px' }}
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{
          textAlign: 'center',
          padding: '16px',
          marginBottom: '16px',
        }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: theme.text }}>
          Spese Future
        </h2>
        <p
          style={{
            fontSize: '14px',
            color: theme.textSecondary,
            marginTop: '4px',
          }}
        >
          Pianifica e accantona per le spese imminenti
        </p>
      </motion.div>

      {/* Riepilogo totale giornaliero */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          margin: '0 16px 24px',
          padding: '24px',
          borderRadius: '24px',
          backgroundColor: theme.card,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.3 }}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.primary}30 0%, ${theme.primary}10 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <Calculator size={40} style={{ color: theme.primary }} />
          </motion.div>

          <p
            style={{
              fontSize: '14px',
              color: theme.textSecondary,
              marginBottom: '8px',
            }}
          >
            ACCANTONAMENTO GIORNALIERO
          </p>
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.4 }}
            style={{
              fontSize: '36px',
              fontWeight: '700',
              color: theme.primary,
            }}
          >
            € {getTotalDailyAmount().toFixed(2)}
          </motion.p>
          <p
            style={{
              fontSize: '14px',
              color: theme.textSecondary,
              marginTop: '8px',
            }}
          >
            Da sottrarre dal budget giornaliero
          </p>
        </div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            marginTop: '24px',
          }}
        >
          <motion.div
            variants={itemVariants}
            style={{
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: `${theme.warning}15`,
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '12px', color: theme.textSecondary }}>
              SPESE PIANIFICATE
            </p>
            <p
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: theme.warning,
                marginTop: '4px',
              }}
            >
              {futureExpenses.length}
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            style={{
              padding: '16px',
              borderRadius: '16px',
              backgroundColor: `${theme.danger}15`,
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '12px', color: theme.textSecondary }}>
              TOTALE DA PAGARE
            </p>
            <p
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: theme.danger,
                marginTop: '4px',
              }}
            >
              € {futureExpenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Lista spese future */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          margin: '0 16px',
          padding: '24px',
          borderRadius: '24px',
          backgroundColor: theme.card,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <div>
            <h3
              style={{ fontSize: '18px', fontWeight: '600', color: theme.text }}
            >
              Prossime spese
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: theme.textSecondary,
                marginTop: '4px',
              }}
            >
              Gestisci le tue spese imminenti
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setNewExpense({
                name: '',
                amount: '',
                dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
                categoryId: 1,
                description: '',
              });
              setEditingExpenseId(null);
              setValidationError('');
              setShowAddExpense(!showAddExpense);
            }}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: `${theme.primary}15`,
              color: theme.primary,
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {showAddExpense ? <Minus size={20} /> : <Plus size={20} />}
          </motion.button>
        </div>

        {/* Messaggio di successo */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                padding: '12px 16px',
                backgroundColor: `${theme.secondary}15`,
                borderRadius: '12px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Check size={18} style={{ color: theme.secondary }} />
              <p style={{ color: theme.secondary, fontWeight: '500' }}>
                Spesa salvata con successo!
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Form aggiunta/modifica spesa */}
        <AnimatePresence>
          {showAddExpense && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                overflow: 'hidden',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  backgroundColor: theme.background,
                  border: `1px solid ${theme.border}`,
                }}
              >
                {validationError && (
                  <div 
                    style={{
                      padding: '10px 16px',
                      backgroundColor: `${theme.danger}15`,
                      borderRadius: '10px',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <AlertCircle size={16} style={{ color: theme.danger }} />
                    <p style={{ color: theme.danger, fontSize: '14px' }}>
                      {validationError}
                    </p>
                  </div>
                )}
                
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  <input
                    type="text"
                    placeholder="Nome spesa (es. Bollo auto, Assicurazione)"
                    value={newExpense.name}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, name: e.target.value })
                    }
                    style={inputStyle}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label
                        style={{
                          fontSize: '14px',
                          color: theme.textSecondary,
                          display: 'block',
                          marginBottom: '8px',
                        }}
                      >
                        Importo totale (€)
                      </label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={newExpense.amount}
                        onChange={(e) =>
                          setNewExpense({ ...newExpense, amount: e.target.value })
                        }
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          fontSize: '14px',
                          color: theme.textSecondary,
                          display: 'block',
                          marginBottom: '8px',
                        }}
                      >
                        Data scadenza
                      </label>
                      <input
                        type="date"
                        value={newExpense.dueDate}
                        onChange={(e) =>
                          setNewExpense({ ...newExpense, dueDate: e.target.value })
                        }
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        fontSize: '14px',
                        color: theme.textSecondary,
                        display: 'block',
                        marginBottom: '8px',
                      }}
                    >
                      Categoria
                    </label>
                    <select
                      value={newExpense.categoryId}
                      onChange={(e) =>
                        setNewExpense({
                          ...newExpense,
                          categoryId: parseInt(e.target.value),
                        })
                      }
                      style={selectStyle}
                      className="expense-category-select"
                    >
                      {categories
                        .filter(cat => cat.id <= 20)
                        .map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </option>
                        ))}
                    </select>
                    <style jsx>{`
                      .expense-category-select option {
                        background-color: white;
                        color: black;
                      }
                    `}</style>
                  </div>

                  <input
                    type="text"
                    placeholder="Descrizione (opzionale)"
                    value={newExpense.description}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, description: e.target.value })
                    }
                    style={inputStyle}
                  />

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddExpense}
                    disabled={isSubmitting}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      background: isSubmitting 
                        ? theme.border 
                        : `linear-gradient(135deg, ${theme.primary} 0%, #5A85FF 100%)`,
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '16px',
                      border: 'none',
                      cursor: isSubmitting ? 'default' : 'pointer',
                      marginTop: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                          <Calendar size={18} />
                        </motion.div>
                        Salvataggio...
                      </>
                    ) : (
                      <>
                        {editingExpenseId ? 'Aggiorna spesa' : 'Aggiungi spesa'}
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lista delle spese */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          {futureExpenses.length > 0 ? (
            futureExpenses.map((expense) => {
              const daysRemaining = calculateDaysRemaining(expense.dueDate);
              const dailyAmount = calculateDailyAmount(expense.amount, expense.dueDate);
              const isUrgent = daysRemaining <= 7;
              const isOverdue = daysRemaining === 0;
              const category = categories.find(c => c.id === expense.categoryId);

              return (
                <motion.div
                  key={expense.id}
                  variants={itemVariants}
                  layout
                  style={{
                    padding: '20px',
                    borderRadius: '16px',
                    backgroundColor: theme.background,
                    border: `1px solid ${
                      isOverdue ? theme.danger : isUrgent ? theme.warning : theme.border
                    }`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          backgroundColor: `${category?.color || theme.primary}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                        }}
                      >
                        {category?.icon || '📝'}
                      </div>
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <h4
                            style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: theme.text,
                            }}
                          >
                            {expense.name}
                          </h4>
                          {isUrgent && !isOverdue && (
                            <AlertCircle
                              size={16}
                              style={{ color: theme.warning }}
                            />
                          )}
                          {isOverdue && (
                            <AlertCircle
                              size={16}
                              style={{ color: theme.danger }}
                            />
                          )}
                        </div>
                        <p
                          style={{ fontSize: '14px', color: theme.textSecondary }}
                        >
                          Scadenza: {new Date(expense.dueDate).toLocaleDateString('it-IT')}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditExpense(expense)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: `${theme.primary}15`,
                          color: theme.primary,
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <Pencil size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteExpense(expense.id)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: `${theme.danger}15`,
                          color: theme.danger,
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      borderRadius: '4px',
                      backgroundColor: `${theme.primary}20`,
                      marginBottom: '12px',
                      overflow: 'hidden',
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${100 - (daysRemaining / 30) * 100}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      style={{
                        height: '100%',
                        borderRadius: '4px',
                        backgroundColor: isOverdue
                          ? theme.danger
                          : isUrgent
                          ? theme.warning
                          : theme.primary,
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <p style={{ fontSize: '14px', color: theme.textSecondary }}>
                        {isOverdue
                          ? 'Scaduta!'
                          : `${daysRemaining} giorni rimanenti`}
                      </p>
                      <p
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: theme.primary,
                        }}
                      >
                        € {dailyAmount} al giorno
                      </p>
                    </div>
                    <p style={{ fontSize: '20px', fontWeight: '700', color: theme.text }}>
                      € {expense.amount.toFixed(2)}
                    </p>
                  </div>

                  {expense.description && (
                    <p
                      style={{
                        fontSize: '14px',
                        color: theme.textSecondary,
                        marginTop: '12px',
                        fontStyle: 'italic',
                      }}
                    >
                      {expense.description}
                    </p>
                  )}
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: 'center',
                padding: '48px 24px',
                borderRadius: '16px',
                backgroundColor: theme.background,
                color: theme.textSecondary,
              }}
            >
              <Receipt
                size={48}
                style={{ margin: '0 auto 16px', opacity: 0.5 }}
              />
              <p
                style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  marginBottom: '8px',
                }}
              >
                Nessuna spesa pianificata
              </p>
              <p style={{ fontSize: '14px' }}>
                Aggiungi le spese future per calcolare l'accantonamento giornaliero
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default FutureExpensesPage;