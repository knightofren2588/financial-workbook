import React, { useState, useEffect } from 'react';
import { Plus, Calendar, DollarSign, TrendingUp, AlertCircle, CheckCircle, Save, Trash2, Edit3 } from 'lucide-react';

const FinancialWorkbook = () => {
  // Bills state
  const [bills, setBills] = useState([
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
  ]);

  // Individual paychecks state
  const [paychecks, setPaychecks] = useState([
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
  ]);

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
    // Unassign bills from deleted paycheck
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

  return (
    <div className="app-container">
      <div className="header-card">
        <div className="header-content">
          <h1 className="app-title">💰 Financial Workbook</h1>
          <p className="app-subtitle">Smart budget planning for your financial success</p>
        </div>
        
        {/* View Toggle */}
        <div className="view-toggle">
          <button
            onClick={() => setActiveView('overview')}
            className={`toggle-btn ${activeView === 'overview' ? 'active overview' : ''}`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveView('paychecks')}
            className={`toggle-btn ${activeView === 'paychecks' ? 'active paychecks' : ''}`}
          >
            💰 Paycheck Planning
          </button>
        </div>
      </div>

      {activeView === 'overview' && (
        <div className="content-section">
          {/* Summary Cards */}
          <div className="stats-grid">
            <div className="stat-card income">
              <div className="stat-icon">
                <TrendingUp size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Total Income</span>
                <span className="stat-value">{formatCurrency(totalIncome)}</span>
              </div>
            </div>
            
            <div className="stat-card bills">
              <div className="stat-icon">
                <AlertCircle size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Total Bills</span>
                <span className="stat-value">{formatCurrency(totalBills)}</span>
              </div>
            </div>
            
            <div className="stat-card unpaid">
              <div className="stat-icon">
                <AlertCircle size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Unpaid Bills</span>
                <span className="stat-value">{formatCurrency(totalUnpaid)}</span>
              </div>
            </div>
            
            <div className="stat-card remaining">
              <div className="stat-icon">
                <DollarSign size={24} />
              </div>
              <div className="stat-content">
                <span className="stat-label">Remaining</span>
                <span className="stat-value">{formatCurrency(totalIncome - totalBills)}</span>
              </div>
            </div>
          </div>

          {/* Bills Section */}
          <div className="section-card">
            <h2 className="section-title">💳 Bills & Expenses</h2>
            
            {/* Add New Bill */}
            <div className="add-form">
              <input
                type="text"
                placeholder="Bill name"
                value={newBill.name}
                onChange={(e) => setNewBill({...newBill, name: e.target.value})}
                className="form-input"
              />
              <input
                type="number"
                placeholder="Amount"
                value={newBill.amount}
                onChange={(e) => setNewBill({...newBill, amount: e.target.value})}
                className="form-input"
              />
              <input
                type="date"
                value={newBill.dueDate}
                onChange={(e) => setNewBill({...newBill, dueDate: e.target.value})}
                className="form-input"
              />
              <button
                onClick={addBill}
                className="add-btn primary"
              >
                <Plus size={16} /> Add Bill
              </button>
            </div>

            {/* Bills List */}
            <div className="bills-list">
              {bills.map(bill => (
                <div key={bill.id} className={`bill-item ${bill.isPaid ? 'paid' : 'unpaid'}`}>
                  <div className="bill-info">
                    <div className="bill-name">{bill.name}</div>
                    <div className="bill-due">Due: {formatDate(bill.dueDate)}</div>
                  </div>
                  <div className="bill-amount">{formatCurrency(bill.amount)}</div>
                  <div className="bill-actions">
                    <select
                      value={bill.assignedPaycheckId || ''}
                      onChange={(e) => assignBillToPaycheck(bill.id, e.target.value)}
                      className="bill-select"
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
                      className={`status-btn ${bill.isPaid ? 'paid' : 'unpaid'}`}
                    >
                      {bill.isPaid ? '✅ Paid' : '⏳ Unpaid'}
                    </button>
                    <button
                      onClick={() => deleteBill(bill.id)}
                      className="delete-btn"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeView === 'paychecks' && (
        <div className="content-section">
          {/* Add New Paycheck */}
          <div className="section-card">
            <h2 className="section-title">➕ Add New Paycheck</h2>
            <div className="add-form">
              <input
                type="date"
                value={newPaycheck.date}
                onChange={(e) => setNewPaycheck({...newPaycheck, date: e.target.value})}
                className="form-input"
                placeholder="Pay date"
              />
              <input
                type="number"
                placeholder="Amount"
                value={newPaycheck.amount}
                onChange={(e) => setNewPaycheck({...newPaycheck, amount: e.target.value})}
                className="form-input"
              />
              <input
                type="text"
                placeholder="Source (e.g., Equitas Health)"
                value={newPaycheck.source}
                onChange={(e) => setNewPaycheck({...newPaycheck, source: e.target.value})}
                className="form-input"
              />
              <button
                onClick={addPaycheck}
                className="add-btn success"
              >
                <Plus size={16} /> Add Paycheck
              </button>
            </div>
          </div>

          {/* Paycheck Cards */}
          <div className="paychecks-grid">
            {paychecks.map(paycheck => {
              const details = getPaycheckDetails(paycheck);
              return (
                <div key={paycheck.id} className="paycheck-card">
                  <div className="paycheck-header">
                    <div className="paycheck-info">
                      <h3 className="paycheck-source">{paycheck.source}</h3>
                      <p className="paycheck-date">{formatDate(paycheck.date)}</p>
                    </div>
                    <div className="paycheck-controls">
                      <div className="paycheck-amount">{formatCurrency(paycheck.amount)}</div>
                      <button
                        onClick={() => deletePaycheck(paycheck.id)}
                        className="delete-btn"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Assigned Bills */}
                  <div className="assigned-bills">
                    <h4 className="bills-title">Assigned Bills:</h4>
                    {details.assignedBills.length > 0 ? (
                      details.assignedBills.map(bill => (
                        <div key={bill.id} className={`assigned-bill ${bill.isPaid ? 'paid' : ''}`}>
                          <span className="assigned-bill-name">{bill.name}</span>
                          <span className="assigned-bill-amount">{formatCurrency(bill.amount)}</span>
                        </div>
                      ))
                    ) : (
                      <p className="no-bills">No bills assigned</p>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="paycheck-summary">
                    <div className="summary-row">
                      <span>Paycheck Amount:</span>
                      <span className="amount">{formatCurrency(paycheck.amount)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Assigned Bills:</span>
                      <span className="amount negative">-{formatCurrency(details.totalAssigned)}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Remaining:</span>
                      <span className={`amount ${details.remaining >= 0 ? 'positive' : 'negative'}`}>
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
            <div className="section-card warning">
              <h3 className="section-title">⚠️ Unassigned Bills</h3>
              <div className="unassigned-bills">
                {bills.filter(bill => !bill.assignedPaycheckId).map(bill => (
                  <div key={bill.id} className="unassigned-bill">
                    <div className="unassigned-info">
                      <span className="unassigned-name">{bill.name}</span>
                      <span className="unassigned-due">Due: {formatDate(bill.dueDate)}</span>
                    </div>
                    <span className="unassigned-amount">{formatCurrency(bill.amount)}</span>
                  </div>
                ))}
              </div>
              <p className="warning-text">
                💡 Assign these bills to specific paychecks in the Overview tab for better planning!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FinancialWorkbook;