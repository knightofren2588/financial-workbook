import React, { useState, useEffect } from 'react';
import { Plus, DollarSign, TrendingUp, AlertCircle, Trash2 } from 'lucide-react';

const FinancialWorkbook = () => {
  // Load data from localStorage or use defaults
  const loadFromStorage = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultValue;
    }
  };

  // Save data to localStorage
  const saveToStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Bills state with localStorage
  const [bills, setBills] = useState(() => loadFromStorage('financial-workbook-bills', [
    {
      id: 1,
      name: 'Rent',
      amount: 1200,
      dueDate: '2025-08-01',
      isPaid: false,
      assignedPaycheckId: null
    },
    {
      id: 2,
      name: 'Electric',
      amount: 150,
      dueDate: '2025-08-05',
      isPaid: false,
      assignedPaycheckId: null
    },
    {
      id: 3,
      name: 'Car Insurance',
      amount: 180,
      dueDate: '2025-08-10',
      isPaid: false,
      assignedPaycheckId: null
    }
  ]));

  // Individual paychecks state with localStorage
  const [paychecks, setPaychecks] = useState(() => loadFromStorage('financial-workbook-paychecks', [
    {
      id: 1,
      date: '2025-08-01',
      amount: 1500,
      source: 'Equitas Health - Payroll'
    },
    {
      id: 2,
      date: '2025-08-15',
      amount: 1450,
      source: 'Equitas Health - Payroll'
    }
  ]));

  // Save bills to localStorage whenever bills change
  useEffect(() => {
    saveToStorage('financial-workbook-bills', bills);
  }, [bills]);

  // Save paychecks to localStorage whenever paychecks change
  useEffect(() => {
    saveToStorage('financial-workbook-paychecks', paychecks);
  }, [paychecks]);

  // Data management functions
  const exportData = () => {
    const data = {
      bills,
      paychecks,
      exportDate: new Date().toISOString()
    };
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financial-workbook-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.bills && data.paychecks) {
            setBills(data.bills);
            setPaychecks(data.paychecks);
            alert('Data imported successfully!');
          } else {
            alert('Invalid file format!');
          }
        } catch (error) {
          alert('Error importing data!');
        }
      };
      reader.readAsText(file);
    }
  };

  const resetAllData = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone!')) {
      localStorage.removeItem('financial-workbook-bills');
      localStorage.removeItem('financial-workbook-paychecks');
      setBills([]);
      setPaychecks([]);
      alert('All data has been reset!');
    }
  };
  const [activeView, setActiveView] = useState('overview');
  const [newBill, setNewBill] = useState({ name: '', amount: '', dueDate: '' });
  const [newPaycheck, setNewPaycheck] = useState({ date: '', amount: '', source: '' });

  // Calculate totals
  const totalBills = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalIncome = paychecks.reduce((sum, paycheck) => sum + paycheck.amount, 0);
  const paidBills = bills.filter(bill => bill.isPaid);
  const unpaidBills = bills.filter(bill => !bill.isPaid);
  const totalPaid = paidBills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalUnpaid = unpaidBills.reduce((sum, bill) => sum + bill.amount, 0);

  // Add new bill
  const addBill = () => {
    if (newBill.name && newBill.amount && newBill.dueDate) {
      setBills([...bills, {
        id: Date.now(),
        name: newBill.name,
        amount: parseFloat(newBill.amount),
        dueDate: newBill.dueDate,
        isPaid: false,
        assignedPaycheckId: null
      }]);
      setNewBill({ name: '', amount: '', dueDate: '' });
    }
  };

  // Add new paycheck
  const addPaycheck = () => {
    if (newPaycheck.date && newPaycheck.amount && newPaycheck.source) {
      setPaychecks([...paychecks, {
        id: Date.now(),
        date: newPaycheck.date,
        amount: parseFloat(newPaycheck.amount),
        source: newPaycheck.source
      }]);
      setNewPaycheck({ date: '', amount: '', source: '' });
    }
  };

  // Toggle bill payment status
  const toggleBillPayment = (billId) => {
    setBills(bills.map(bill => 
      bill.id === billId 
        ? { ...bill, isPaid: !bill.isPaid }
        : bill
    ));
  };

  // Assign bill to paycheck
  const assignBillToPaycheck = (billId, paycheckId) => {
    setBills(bills.map(bill => 
      bill.id === billId 
        ? { ...bill, assignedPaycheckId: paycheckId ? parseInt(paycheckId) : null }
        : bill
    ));
  };

  // Delete bill
  const deleteBill = (billId) => {
    setBills(bills.filter(bill => bill.id !== billId));
  };

  // Delete paycheck
  const deletePaycheck = (paycheckId) => {
    setPaychecks(paychecks.filter(paycheck => paycheck.id !== paycheckId));
    setBills(bills.map(bill => 
      bill.assignedPaycheckId === paycheckId 
        ? { ...bill, assignedPaycheckId: null }
        : bill
    ));
  };

  // Calculate paycheck remaining amounts
  const getPaycheckDetails = (paycheck) => {
    const assignedBills = bills.filter(bill => bill.assignedPaycheckId === paycheck.id);
    const totalAssigned = assignedBills.reduce((sum, bill) => sum + bill.amount, 0);
    const remaining = paycheck.amount - totalAssigned;
    return { assignedBills, totalAssigned, remaining };
  };

  const formatCurrency = (amount) => `$${amount.toFixed(2)}`;
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  // Beautiful inline styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      padding: '20px',
      margin: 0
    },
    appContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px'
    },
    glassCard: {
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease'
    },
    header: {
      padding: '40px',
      textAlign: 'center'
    },
    title: {
      fontSize: '3.5rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '16px',
      textShadow: '0 4px 8px rgba(0,0,0,0.1)'
    },
    subtitle: {
      fontSize: '1.2rem',
      color: '#6b7280',
      marginBottom: '40px',
      fontWeight: '500'
    },
    viewToggle: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    toggleBtn: {
      padding: '16px 32px',
      border: 'none',
      borderRadius: '15px',
      fontWeight: '600',
      fontSize: '1.1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      background: 'rgba(255, 255, 255, 0.8)',
      color: '#374151',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
      transform: 'translateY(0px)'
    },
    toggleBtnHover: {
      transform: 'translateY(-3px)',
      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)'
    },
    toggleBtnActive: {
      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      color: 'white',
      transform: 'translateY(-3px)',
      boxShadow: '0 12px 30px rgba(59, 130, 246, 0.4)'
    },
    toggleBtnActivePaychecks: {
      background: 'linear-gradient(135deg, #10b981, #059669)',
      color: 'white',
      transform: 'translateY(-3px)',
      boxShadow: '0 12px 30px rgba(16, 185, 129, 0.4)'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '25px'
    },
    statCard: {
      padding: '30px',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer',
      transform: 'translateY(0px)',
      transition: 'all 0.3s ease'
    },
    statCardHover: {
      transform: 'translateY(-8px)',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)'
    },
    statContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    statIcon: {
      width: '70px',
      height: '70px',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      flexShrink: 0,
      boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
    },
    statIconIncome: {
      background: 'linear-gradient(135deg, #10b981, #34d399)'
    },
    statIconBills: {
      background: 'linear-gradient(135deg, #ef4444, #f87171)'
    },
    statIconUnpaid: {
      background: 'linear-gradient(135deg, #f59e0b, #fbbf24)'
    },
    statIconRemaining: {
      background: 'linear-gradient(135deg, #3b82f6, #60a5fa)'
    },
    statInfo: {
      flex: 1
    },
    statLabel: {
      fontSize: '0.9rem',
      color: '#6b7280',
      fontWeight: '500',
      marginBottom: '8px'
    },
    statValue: {
      fontSize: '2.2rem',
      fontWeight: '700',
      color: '#1f2937'
    },
    sectionCard: {
      padding: '40px'
    },
    sectionTitle: {
      fontSize: '1.8rem',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '30px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    addForm: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      padding: '30px',
      background: 'rgba(248, 250, 252, 0.8)',
      borderRadius: '16px',
      marginBottom: '30px',
      border: '1px solid rgba(226, 232, 240, 0.5)'
    },
    formInput: {
      padding: '14px 18px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: '500',
      background: 'white',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    },
    formInputFocus: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 8px rgba(0,0,0,0.1)'
    },
    btn: {
      padding: '14px 24px',
      border: 'none',
      borderRadius: '12px',
      fontWeight: '600',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
      transform: 'translateY(0px)'
    },
    btnHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)'
    },
    btnPrimary: {
      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      color: 'white'
    },
    btnSuccess: {
      background: 'linear-gradient(135deg, #10b981, #059669)',
      color: 'white'
    },
    btnDanger: {
      background: 'rgba(239, 68, 68, 0.1)',
      color: '#ef4444',
      padding: '10px'
    },
    billsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    billItem: {
      padding: '25px',
      borderRadius: '16px',
      transition: 'all 0.3s ease',
      borderLeft: '5px solid transparent',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.08)',
      cursor: 'pointer',
      transform: 'translateX(0px)'
    },
    billItemHover: {
      transform: 'translateX(8px)',
      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)'
    },
    billItemPaid: {
      background: 'rgba(236, 253, 245, 0.9)',
      borderLeftColor: '#10b981'
    },
    billItemUnpaid: {
      background: 'rgba(255, 251, 235, 0.9)',
      borderLeftColor: '#f59e0b'
    },
    billContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '25px',
      flexWrap: 'wrap'
    },
    billInfo: {
      flex: 1,
      minWidth: '200px'
    },
    billName: {
      fontSize: '1.2rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '6px'
    },
    billDue: {
      fontSize: '0.9rem',
      color: '#6b7280',
      fontWeight: '500'
    },
    billAmount: {
      fontSize: '1.4rem',
      fontWeight: '700',
      color: '#1f2937',
      margin: '0 20px'
    },
    billActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      flexWrap: 'wrap'
    },
    statusBtn: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '25px',
      fontWeight: '600',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    },
    statusBtnPaid: {
      background: 'linear-gradient(135deg, #10b981, #34d399)',
      color: 'white'
    },
    statusBtnUnpaid: {
      background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      color: 'white'
    },
    paychecksGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
      gap: '30px'
    },
    paycheckCard: {
      padding: '30px',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer',
      transform: 'translateY(0px)',
      transition: 'all 0.3s ease'
    },
    paycheckCardHover: {
      transform: 'translateY(-8px)',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)'
    },
    paycheckHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '25px',
      gap: '20px'
    },
    paycheckAmount: {
      fontSize: '2.5rem',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #10b981, #34d399)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.appContainer}>
        {/* Header */}
        <div style={{...styles.glassCard, ...styles.header}}>
          <h1 style={styles.title}>💰 Financial Workbook</h1>
          <p style={styles.subtitle}>Smart budget planning for your financial success</p>
          
          {/* Data Management */}
          <div style={{display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap'}}>
            <button
              onClick={exportData}
              style={{
                ...styles.btn,
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                padding: '8px 16px',
                fontSize: '0.9rem'
              }}
            >
              📥 Export Data
            </button>
            <label style={{
              ...styles.btn,
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              padding: '8px 16px',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}>
              📤 Import Data
              <input
                type="file"
                accept=".json"
                onChange={importData}
                style={{display: 'none'}}
              />
            </label>
            <button
              onClick={resetAllData}
              style={{
                ...styles.btn,
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: 'white',
                padding: '8px 16px',
                fontSize: '0.9rem'
              }}
            >
              🗑️ Reset All
            </button>
          </div>
          
          {/* View Toggle */}
          <div style={styles.viewToggle}>
            <button
              onClick={() => setActiveView('overview')}
              style={{
                ...styles.toggleBtn,
                ...(activeView === 'overview' ? styles.toggleBtnActive : {})
              }}
              onMouseEnter={(e) => {
                if (activeView !== 'overview') {
                  Object.assign(e.target.style, styles.toggleBtnHover);
                }
              }}
              onMouseLeave={(e) => {
                if (activeView !== 'overview') {
                  Object.assign(e.target.style, styles.toggleBtn);
                }
              }}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveView('paychecks')}
              style={{
                ...styles.toggleBtn,
                ...(activeView === 'paychecks' ? styles.toggleBtnActivePaychecks : {})
              }}
              onMouseEnter={(e) => {
                if (activeView !== 'paychecks') {
                  Object.assign(e.target.style, styles.toggleBtnHover);
                }
              }}
              onMouseLeave={(e) => {
                if (activeView !== 'paychecks') {
                  Object.assign(e.target.style, styles.toggleBtn);
                }
              }}
            >
              💰 Paycheck Planning
            </button>
          </div>
        </div>

        {activeView === 'overview' && (
          <>
            {/* Summary Cards */}
            <div style={styles.statsGrid}>
              <div style={styles.glassCard}>
                <div style={styles.statCard}>
                  <div style={styles.statContent}>
                    <div style={{...styles.statIcon, ...styles.statIconIncome}}>
                      <TrendingUp size={28} />
                    </div>
                    <div style={styles.statInfo}>
                      <div style={styles.statLabel}>Total Income</div>
                      <div style={styles.statValue}>{formatCurrency(totalIncome)}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={styles.glassCard}>
                <div style={styles.statCard}>
                  <div style={styles.statContent}>
                    <div style={{...styles.statIcon, ...styles.statIconBills}}>
                      <AlertCircle size={28} />
                    </div>
                    <div style={styles.statInfo}>
                      <div style={styles.statLabel}>Total Bills</div>
                      <div style={styles.statValue}>{formatCurrency(totalBills)}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={styles.glassCard}>
                <div style={styles.statCard}>
                  <div style={styles.statContent}>
                    <div style={{...styles.statIcon, ...styles.statIconUnpaid}}>
                      <AlertCircle size={28} />
                    </div>
                    <div style={styles.statInfo}>
                      <div style={styles.statLabel}>Unpaid Bills</div>
                      <div style={styles.statValue}>{formatCurrency(totalUnpaid)}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={styles.glassCard}>
                <div style={styles.statCard}>
                  <div style={styles.statContent}>
                    <div style={{...styles.statIcon, ...styles.statIconRemaining}}>
                      <DollarSign size={28} />
                    </div>
                    <div style={styles.statInfo}>
                      <div style={styles.statLabel}>Remaining</div>
                      <div style={styles.statValue}>{formatCurrency(totalIncome - totalBills)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bills Section */}
            <div style={{...styles.glassCard, ...styles.sectionCard}}>
              <h2 style={styles.sectionTitle}>💳 Bills & Expenses</h2>
              
              {/* Add New Bill Form */}
              <div style={styles.addForm}>
                <input
                  type="text"
                  placeholder="Bill name"
                  value={newBill.name}
                  onChange={(e) => setNewBill({...newBill, name: e.target.value})}
                  style={styles.formInput}
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={newBill.amount}
                  onChange={(e) => setNewBill({...newBill, amount: e.target.value})}
                  style={styles.formInput}
                />
                <input
                  type="date"
                  value={newBill.dueDate}
                  onChange={(e) => setNewBill({...newBill, dueDate: e.target.value})}
                  style={styles.formInput}
                />
                <button
                  onClick={addBill}
                  style={{...styles.btn, ...styles.btnPrimary}}
                >
                  <Plus size={18} />
                  <span>Add Bill</span>
                </button>
              </div>

              {/* Bills List */}
              <div style={styles.billsList}>
                {bills.map(bill => (
                  <div key={bill.id} style={{
                    ...styles.billItem,
                    ...(bill.isPaid ? styles.billItemPaid : styles.billItemUnpaid)
                  }}>
                    <div style={styles.billContent}>
                      <div style={styles.billInfo}>
                        <div style={styles.billName}>{bill.name}</div>
                        <div style={styles.billDue}>Due: {formatDate(bill.dueDate)}</div>
                      </div>
                      <div style={styles.billAmount}>{formatCurrency(bill.amount)}</div>
                      <div style={styles.billActions}>
                        <select
                          value={bill.assignedPaycheckId || ''}
                          onChange={(e) => assignBillToPaycheck(bill.id, e.target.value)}
                          style={styles.formInput}
                        >
                          <option value="">Unassigned</option>
                          {paychecks.map(paycheck => (
                            <option key={paycheck.id} value={paycheck.id}>
                              {formatDate(paycheck.date)} - {paycheck.source}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => toggleBillPayment(bill.id)}
                          style={{
                            ...styles.statusBtn,
                            ...(bill.isPaid ? styles.statusBtnPaid : styles.statusBtnUnpaid)
                          }}
                        >
                          {bill.isPaid ? '✅ Paid' : '⏳ Unpaid'}
                        </button>
                        <button
                          onClick={() => deleteBill(bill.id)}
                          style={{...styles.btn, ...styles.btnDanger}}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeView === 'paychecks' && (
          <>
            {/* Add New Paycheck */}
            <div style={{...styles.glassCard, ...styles.sectionCard}}>
              <h2 style={styles.sectionTitle}>➕ Add New Paycheck</h2>
              <div style={styles.addForm}>
                <input
                  type="date"
                  value={newPaycheck.date}
                  onChange={(e) => setNewPaycheck({...newPaycheck, date: e.target.value})}
                  style={styles.formInput}
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={newPaycheck.amount}
                  onChange={(e) => setNewPaycheck({...newPaycheck, amount: e.target.value})}
                  style={styles.formInput}
                />
                <input
                  type="text"
                  placeholder="Source (e.g., Equitas Health)"
                  value={newPaycheck.source}
                  onChange={(e) => setNewPaycheck({...newPaycheck, source: e.target.value})}
                  style={styles.formInput}
                />
                <button
                  onClick={addPaycheck}
                  style={{...styles.btn, ...styles.btnSuccess}}
                >
                  <Plus size={18} />
                  <span>Add Paycheck</span>
                </button>
              </div>
            </div>

            {/* Paycheck Cards */}
            <div style={styles.paychecksGrid}>
              {paychecks.map(paycheck => {
                const details = getPaycheckDetails(paycheck);
                return (
                  <div key={paycheck.id} style={{...styles.glassCard, ...styles.paycheckCard}}>
                    <div style={styles.paycheckHeader}>
                      <div>
                        <h3 style={{fontSize: '1.4rem', fontWeight: '700', color: '#1f2937', marginBottom: '6px'}}>
                          {paycheck.source}
                        </h3>
                        <p style={{color: '#6b7280', fontWeight: '500', fontSize: '1rem'}}>
                          {formatDate(paycheck.date)}
                        </p>
                      </div>
                      <div>
                        <div style={styles.paycheckAmount}>{formatCurrency(paycheck.amount)}</div>
                        <button
                          onClick={() => deletePaycheck(paycheck.id)}
                          style={{...styles.btn, ...styles.btnDanger, marginTop: '10px'}}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Assigned Bills */}
                    <div style={{marginBottom: '25px'}}>
                      <h4 style={{fontSize: '1.1rem', fontWeight: '600', color: '#374151', marginBottom: '15px'}}>
                        Assigned Bills:
                      </h4>
                      {details.assignedBills.length > 0 ? (
                        details.assignedBills.map(bill => (
                          <div key={bill.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '15px 20px',
                            background: 'rgba(248, 250, 252, 0.8)',
                            borderRadius: '12px',
                            marginBottom: '10px',
                            borderLeft: '4px solid #3b82f6',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            ...(bill.isPaid ? {opacity: 0.6, textDecoration: 'line-through'} : {})
                          }}>
                            <span style={{fontWeight: '500', color: '#374151', fontSize: '1rem'}}>{bill.name}</span>
                            <span style={{fontWeight: '600', color: '#1f2937', fontSize: '1.1rem'}}>{formatCurrency(bill.amount)}</span>
                          </div>
                        ))
                      ) : (
                        <p style={{
                          color: '#9ca3af',
                          fontStyle: 'italic',
                          textAlign: 'center',
                          padding: '25px',
                          background: 'rgba(249, 250, 251, 0.5)',
                          borderRadius: '12px',
                          fontSize: '1rem'
                        }}>
                          No bills assigned
                        </p>
                      )}
                    </div>

                    {/* Summary */}
                    <div style={{borderTop: '2px solid #e5e7eb', paddingTop: '20px'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontWeight: '500', fontSize: '1rem'}}>
                        <span>Paycheck Amount:</span>
                        <span>{formatCurrency(paycheck.amount)}</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontWeight: '500', fontSize: '1rem'}}>
                        <span>Assigned Bills:</span>
                        <span style={{color: '#ef4444'}}>-{formatCurrency(details.totalAssigned)}</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px solid #e5e7eb',
                        paddingTop: '12px',
                        marginTop: '15px',
                        fontWeight: '700',
                        fontSize: '1.2rem'
                      }}>
                        <span>Remaining:</span>
                        <span style={{color: details.remaining >= 0 ? '#10b981' : '#ef4444'}}>
                          {formatCurrency(details.remaining)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Unassigned Bills */}
            {bills.filter(bill => !bill.assignedPaycheckId).length > 0 && (
              <div style={{
                ...styles.glassCard,
                ...styles.sectionCard,
                background: 'rgba(254, 243, 199, 0.9)',
                borderLeft: '6px solid #f59e0b'
              }}>
                <h3 style={{...styles.sectionTitle, color: '#92400e'}}>⚠️ Unassigned Bills</h3>
                <div style={{display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px'}}>
                  {bills.filter(bill => !bill.assignedPaycheckId).map(bill => (
                    <div key={bill.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '20px 25px',
                      background: 'rgba(254, 252, 232, 0.8)',
                      borderRadius: '12px',
                      borderLeft: '5px solid #f59e0b',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
                    }}>
                      <div>
                        <span style={{fontWeight: '600', color: '#92400e', fontSize: '1.1rem'}}>{bill.name}</span>
                        <br />
                        <span style={{fontSize: '0.9rem', color: '#a16207'}}>Due: {formatDate(bill.dueDate)}</span>
                      </div>
                      <span style={{fontWeight: '700', color: '#92400e', fontSize: '1.2rem'}}>{formatCurrency(bill.amount)}</span>
                    </div>
                  ))}
                </div>
                <p style={{
                  color: '#92400e',
                  background: 'rgba(254, 243, 199, 0.6)',
                  padding: '15px 20px',
                  borderRadius: '12px',
                  borderLeft: '4px solid #f59e0b',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}>
                  💡 Assign these bills to specific paychecks in the Overview tab for better planning!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FinancialWorkbook;