import React, { useState, useEffect } from 'react';
import { Plus, Calendar, DollarSign, TrendingUp, AlertCircle, CheckCircle, Save } from 'lucide-react';
import './App.css';
import PWAInstaller from './PWAInstaller';

const FinancialWorkbook = () => {
  // State: Think of these as "memory" for your app
  const [bills, setBills] = useState([]);
  const [income, setIncome] = useState([]);
  const [newBill, setNewBill] = useState({ name: '', amount: '', dueDay: '', category: 'Other' });
  const [newIncome, setNewIncome] = useState({ source: '', amount: '', frequency: 'bi-weekly' });
  const [lastSaved, setLastSaved] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Improved localStorage functions with error handling
  const saveToStorage = (key, data) => {
    try {
      const jsonData = JSON.stringify(data);
      localStorage.setItem(key, jsonData);
      setLastSaved(new Date().toLocaleTimeString());
      console.log(`✅ Saved ${key}:`, data);
      return true;
    } catch (error) {
      console.error(`❌ Failed to save ${key}:`, error);
      return false;
    }
  };

  const loadFromStorage = (key, defaultValue = []) => {
    try {
      const saved = localStorage.getItem(key);
      if (saved && saved !== 'undefined' && saved !== 'null') {
        const parsed = JSON.parse(saved);
        console.log(`✅ Loaded ${key}:`, parsed);
        return Array.isArray(parsed) ? parsed : defaultValue;
      }
      return defaultValue;
    } catch (error) {
      console.error(`❌ Failed to load ${key}:`, error);
      return defaultValue;
    }
  };

  // Load data when app starts - improved version
  useEffect(() => {
    console.log('🚀 App starting, loading data...');
    const loadedBills = loadFromStorage('financial-workbook-bills', []);
    const loadedIncome = loadFromStorage('financial-workbook-income', []);
    
    setBills(loadedBills);
    setIncome(loadedIncome);
    setIsLoading(false);
    console.log('✅ App loaded successfully');
  }, []);

  // Auto-save bills with debouncing
  useEffect(() => {
    if (!isLoading && bills.length >= 0) {
      const timeoutId = setTimeout(() => {
        saveToStorage('financial-workbook-bills', bills);
      }, 500); // Wait 500ms after last change before saving
      
      return () => clearTimeout(timeoutId);
    }
  }, [bills, isLoading]);

  // Auto-save income with debouncing
  useEffect(() => {
    if (!isLoading && income.length >= 0) {
      const timeoutId = setTimeout(() => {
        saveToStorage('financial-workbook-income', income);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [income, isLoading]);

  // Manual save function
  const handleManualSave = () => {
    const billsSaved = saveToStorage('financial-workbook-bills', bills);
    const incomeSaved = saveToStorage('financial-workbook-income', income);
    
    if (billsSaved && incomeSaved) {
      alert('✅ Data saved successfully!');
    } else {
      alert('❌ Failed to save data. Please try again.');
    }
  };

  // All the calculation functions remain the same
  const getDaysUntilDue = (dueDay) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentDay = today.getDate();
    
    let dueDate = new Date(currentYear, currentMonth, dueDay);
    
    if (dueDay < currentDay) {
      dueDate = new Date(currentYear, currentMonth + 1, dueDay);
    }
    
    const timeDiff = dueDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const calculateMonthlyIncome = () => {
    return income.reduce((total, item) => {
      switch (item.frequency) {
        case 'weekly': return total + (item.amount * 4.33);
        case 'bi-weekly': return total + (item.amount * 2.17);
        case 'monthly': return total + item.amount;
        default: return total + item.amount;
      }
    }, 0);
  };

  const calculateTotalBills = () => {
    return bills.reduce((total, bill) => total + bill.amount, 0);
  };

  const monthlyIncome = calculateMonthlyIncome();
  const totalBills = calculateTotalBills();
  const remainingMoney = monthlyIncome - totalBills;

  // Improved add functions with validation
  const addBill = () => {
    if (newBill.name && newBill.amount && newBill.dueDay) {
      const bill = {
        id: Date.now(),
        name: newBill.name.trim(),
        amount: parseFloat(newBill.amount),
        dueDay: parseInt(newBill.dueDay),
        category: newBill.category
      };
      
      setBills(prevBills => [...prevBills, bill]);
      setNewBill({ name: '', amount: '', dueDay: '', category: 'Other' });
    } else {
      alert('Please fill in all bill fields');
    }
  };

  const addIncome = () => {
    if (newIncome.source && newIncome.amount) {
      const income_item = {
        id: Date.now(),
        source: newIncome.source.trim(),
        amount: parseFloat(newIncome.amount),
        frequency: newIncome.frequency
      };
      
      setIncome(prevIncome => [...prevIncome, income_item]);
      setNewIncome({ source: '', amount: '', frequency: 'bi-weekly' });
    } else {
      alert('Please fill in all income fields');
    }
  };

  const removeBill = (id) => {
    setBills(prevBills => prevBills.filter(bill => bill.id !== id));
  };

  const removeIncome = (id) => {
    setIncome(prevIncome => prevIncome.filter(inc => inc.id !== id));
  };

  const getPriorityColor = (days) => {
    if (days <= 3) return 'urgent';
    if (days <= 7) return 'warning';
    return 'safe';
  };

  // Handle form submission with Enter key (mobile-friendly)
  const handleBillKeyPress = (e) => {
    if (e.key === 'Enter') {
      addBill();
    }
  };

  const handleIncomeKeyPress = (e) => {
    if (e.key === 'Enter') {
      addIncome();
    }
  };

  if (isLoading) {
    return (
      <div className="financial-app">
        <div className="container">
          <div className="loading-screen">
            <h2>💰 Loading Financial Workbook...</h2>
            <p>Retrieving your data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="financial-app">
      <div className="container">
        <header className="app-header">
          <h1>💰 Financial Workbook</h1>
          <p>Track your bills, income, and financial health</p>
          <div className="save-info">
            <button onClick={handleManualSave} className="manual-save-btn">
              <Save size={16} />
              Save Data
            </button>
            {lastSaved && <span className="last-saved">Last saved: {lastSaved}</span>}
          </div>
        </header>

        {/* Financial Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card income">
            <div className="card-content">
              <div className="card-info">
                <p className="card-label">Monthly Income</p>
                <p className="card-value">${monthlyIncome.toFixed(2)}</p>
              </div>
              <TrendingUp className="card-icon" />
            </div>
          </div>

          <div className="summary-card expenses">
            <div className="card-content">
              <div className="card-info">
                <p className="card-label">Total Bills</p>
                <p className="card-value">${totalBills.toFixed(2)}</p>
              </div>
              <DollarSign className="card-icon" />
            </div>
          </div>

          <div className={`summary-card ${remainingMoney >= 0 ? 'remaining-positive' : 'remaining-negative'}`}>
            <div className="card-content">
              <div className="card-info">
                <p className="card-label">Remaining</p>
                <p className="card-value">${remainingMoney.toFixed(2)}</p>
              </div>
              {remainingMoney >= 0 ? 
                <CheckCircle className="card-icon" /> : 
                <AlertCircle className="card-icon" />
              }
            </div>
          </div>
        </div>

        <div className="main-content">
          {/* Bills Section */}
          <div className="section bills-section">
            <h2 className="section-title">
              <Calendar className="section-icon" />
              Bills & Expenses ({bills.length})
            </h2>

            <div className="add-form">
              <h3>Add New Bill</h3>
              <div className="form-grid mobile-stack">
                <input
                  type="text"
                  placeholder="Bill name"
                  value={newBill.name}
                  onChange={(e) => setNewBill({...newBill, name: e.target.value})}
                  onKeyPress={handleBillKeyPress}
                  className="form-input"
                />
                <input
                  type="number"
                  placeholder="Amount ($)"
                  value={newBill.amount}
                  onChange={(e) => setNewBill({...newBill, amount: e.target.value})}
                  onKeyPress={handleBillKeyPress}
                  className="form-input"
                  inputMode="decimal"
                />
                <input
                  type="number"
                  placeholder="Due day (1-31)"
                  min="1"
                  max="31"
                  value={newBill.dueDay}
                  onChange={(e) => setNewBill({...newBill, dueDay: e.target.value})}
                  onKeyPress={handleBillKeyPress}
                  className="form-input"
                  inputMode="numeric"
                />
                <select
                  value={newBill.category}
                  onChange={(e) => setNewBill({...newBill, category: e.target.value})}
                  className="form-input"
                >
                  <option value="Housing">🏠 Housing</option>
                  <option value="Utilities">⚡ Utilities</option>
                  <option value="Insurance">🛡️ Insurance</option>
                  <option value="Transportation">🚗 Transportation</option>
                  <option value="Food">🍔 Food</option>
                  <option value="Other">📋 Other</option>
                </select>
              </div>
              <button onClick={addBill} className="add-button mobile-button">
                <Plus className="button-icon" />
                Add Bill
              </button>
            </div>

            <div className="items-list">
              {bills.length === 0 ? (
                <div className="empty-state">
                  <p>📋 No bills added yet. Add your first bill above!</p>
                </div>
              ) : (
                bills.map(bill => {
                  const daysUntil = getDaysUntilDue(bill.dueDay);
                  const priorityClass = getPriorityColor(daysUntil);
                  return (
                    <div key={bill.id} className={`item-card ${priorityClass} mobile-card`}>
                      <div className="item-content">
                        <div className="item-info">
                          <div className="item-header">
                            <h4 className="item-name">{bill.name}</h4>
                            <span className="item-category">{bill.category}</span>
                          </div>
                          <p className="item-details">Due: Day {bill.dueDay} ({daysUntil} days)</p>
                        </div>
                        <div className="item-actions">
                          <p className="item-amount">${bill.amount}</p>
                          <button
                            onClick={() => removeBill(bill.id)}
                            className="remove-button mobile-remove"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Income Section */}
          <div className="section income-section">
            <h2 className="section-title">
              <TrendingUp className="section-icon" />
              Income Sources ({income.length})
            </h2>

            <div className="add-form">
              <h3>Add Income Source</h3>
              <div className="form-column mobile-column">
                <input
                  type="text"
                  placeholder="Income source"
                  value={newIncome.source}
                  onChange={(e) => setNewIncome({...newIncome, source: e.target.value})}
                  onKeyPress={handleIncomeKeyPress}
                  className="form-input"
                />
                <div className="form-row mobile-stack">
                  <input
                    type="number"
                    placeholder="Amount ($)"
                    value={newIncome.amount}
                    onChange={(e) => setNewIncome({...newIncome, amount: e.target.value})}
                    onKeyPress={handleIncomeKeyPress}
                    className="form-input"
                    inputMode="decimal"
                  />
                  <select
                    value={newIncome.frequency}
                    onChange={(e) => setNewIncome({...newIncome, frequency: e.target.value})}
                    className="form-input"
                  >
                    <option value="weekly">📅 Weekly</option>
                    <option value="bi-weekly">📅 Bi-weekly</option>
                    <option value="monthly">📅 Monthly</option>
                  </select>
                </div>
              </div>
              <button onClick={addIncome} className="add-button income-button mobile-button">
                <Plus className="button-icon" />
                Add Income
              </button>
            </div>

            <div className="items-list">
              {income.length === 0 ? (
                <div className="empty-state">
                  <p>💰 No income sources added yet. Add your income above!</p>
                </div>
              ) : (
                income.map(inc => (
                  <div key={inc.id} className="item-card income-item mobile-card">
                    <div className="item-content">
                      <div className="item-info">
                        <h4 className="item-name">{inc.source}</h4>
                        <p className="item-details">
                          ${inc.amount} {inc.frequency}
                        </p>
                      </div>
                      <div className="item-actions">
                        <p className="item-amount">
                          ${((inc.frequency === 'weekly' ? inc.amount * 4.33 : 
                              inc.frequency === 'bi-weekly' ? inc.amount * 2.17 : 
                              inc.amount)).toFixed(2)}/mo
                        </p>
                        <button
                          onClick={() => removeIncome(inc.id)}
                          className="remove-button mobile-remove"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="tips-section">
          <h3>💡 Financial Tips</h3>
          <div className="tips-grid mobile-tips">
            <div className="tip-card">
              <h4>Emergency Fund</h4>
              <p>Try to save 3-6 months of expenses for emergencies.</p>
            </div>
            <div className="tip-card">
              <h4>Bill Automation</h4>
              <p>Set up automatic payments to avoid late fees.</p>
            </div>
            <div className="tip-card">
              <h4>Track Spending</h4>
              <p>Review and update this workbook regularly.</p>
            </div>
          </div>
        </div>

        <PWAInstaller />
      </div>
    </div>
  );
};

export default FinancialWorkbook;
