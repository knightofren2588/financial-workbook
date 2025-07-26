import React, { useState } from 'react';
import { Plus, DollarSign, TrendingUp, AlertCircle, Trash2 } from 'lucide-react';
import './App.css';

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
  const unpaidBills = bills.filter(bill => !bill.isPaid);
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
    <div className="max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Financial Workbook</h1>
        <p className="text-gray-600">Track your bills, paychecks, and budget planning</p>
        
        {/* View Toggle */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setActiveView('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'overview'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveView('paychecks')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'paychecks'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            💰 Paycheck Planning
          </button>
        </div>
      </div>

      {activeView === 'overview' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-100 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-green-600" size={20} />
                <span className="font-medium text-green-800">Total Income</span>
              </div>
              <div className="text-2xl font-bold text-green-800">{formatCurrency(totalIncome)}</div>
            </div>
            
            <div className="bg-red-100 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-red-600" size={20} />
                <span className="font-medium text-red-800">Total Bills</span>
              </div>
              <div className="text-2xl font-bold text-red-800">{formatCurrency(totalBills)}</div>
            </div>
            
            <div className="bg-orange-100 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-orange-600" size={20} />
                <span className="font-medium text-orange-800">Unpaid Bills</span>
              </div>
              <div className="text-2xl font-bold text-orange-800">{formatCurrency(totalUnpaid)}</div>
            </div>
            
            <div className="bg-blue-100 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="text-blue-600" size={20} />
                <span className="font-medium text-blue-800">Remaining</span>
              </div>
              <div className="text-2xl font-bold text-blue-800">{formatCurrency(totalIncome - totalBills)}</div>
            </div>
          </div>

          {/* Bills List */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Bills & Expenses</h2>
            
            {/* Add New Bill */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 p-4 bg-gray-50 rounded-lg">
              <input
                type="text"
                placeholder="Bill name"
                value={newBill.name}
                onChange={(e) => setNewBill({...newBill, name: e.target.value})}
                className="px-3 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Amount"
                value={newBill.amount}
                onChange={(e) => setNewBill({...newBill, amount: e.target.value})}
                className="px-3 py-2 border rounded-lg"
              />
              <input
                type="date"
                value={newBill.dueDate}
                onChange={(e) => setNewBill({...newBill, dueDate: e.target.value})}
                className="px-3 py-2 border rounded-lg"
              />
              <button
                onClick={addBill}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
              >
                <Plus size={16} /> Add Bill
              </button>
            </div>

            {/* Bills List */}
            <div className="space-y-3">
              {bills.map(bill => (
                <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="font-medium">{bill.name}</div>
                    <div className="text-sm text-gray-600">Due: {formatDate(bill.dueDate)}</div>
                  </div>
                  <div className="text-lg font-bold">{formatCurrency(bill.amount)}</div>
                  <div className="flex items-center gap-2">
                    <select
                      value={bill.assignedPaycheckId || ''}
                      onChange={(e) => assignBillToPaycheck(bill.id, e.target.value)}
                      className="px-2 py-1 border rounded text-sm"
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
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        bill.isPaid
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {bill.isPaid ? '✅ Paid' : '⏳ Unpaid'}
                    </button>
                    <button
                      onClick={() => deleteBill(bill.id)}
                      className="text-red-500 hover:text-red-700"
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
        <div className="space-y-6">
          {/* Add New Paycheck */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Add New Paycheck</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="date"
                value={newPaycheck.date}
                onChange={(e) => setNewPaycheck({...newPaycheck, date: e.target.value})}
                className="px-3 py-2 border rounded-lg"
                placeholder="Pay date"
              />
              <input
                type="number"
                placeholder="Amount"
                value={newPaycheck.amount}
                onChange={(e) => setNewPaycheck({...newPaycheck, amount: e.target.value})}
                className="px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Source (e.g., Equitas Health)"
                value={newPaycheck.source}
                onChange={(e) => setNewPaycheck({...newPaycheck, source: e.target.value})}
                className="px-3 py-2 border rounded-lg"
              />
              <button
                onClick={addPaycheck}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
              >
                <Plus size={16} /> Add Paycheck
              </button>
            </div>
          </div>

          {/* Paycheck Planning */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {paychecks.map(paycheck => {
              const details = getPaycheckDetails(paycheck);
              return (
                <div key={paycheck.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{paycheck.source}</h3>
                      <p className="text-gray-600">{formatDate(paycheck.date)}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(paycheck.amount)}
                      </div>
                      <button
                        onClick={() => deletePaycheck(paycheck.id)}
                        className="text-red-500 hover:text-red-700 mt-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Assigned Bills */}
                  <div className="space-y-2 mb-4">
                    <h4 className="font-medium text-gray-700">Assigned Bills:</h4>
                    {details.assignedBills.length > 0 ? (
                      details.assignedBills.map(bill => (
                        <div key={bill.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className={bill.isPaid ? 'line-through text-gray-500' : ''}>
                            {bill.name}
                          </span>
                          <span className="font-medium">{formatCurrency(bill.amount)}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No bills assigned</p>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="border-t pt-3 space-y-1">
                    <div className="flex justify-between">
                      <span>Paycheck Amount:</span>
                      <span className="font-medium">{formatCurrency(paycheck.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Assigned Bills:</span>
                      <span className="font-medium text-red-600">-{formatCurrency(details.totalAssigned)}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-1">
                      <span>Remaining:</span>
                      <span className={details.remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
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
            <div className="bg-yellow-50 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 text-yellow-800">Unassigned Bills</h3>
              <div className="space-y-2">
                {bills.filter(bill => !bill.assignedPaycheckId).map(bill => (
                  <div key={bill.id} className="flex justify-between items-center p-3 bg-yellow-100 rounded">
                    <div>
                      <span className="font-medium">{bill.name}</span>
                      <span className="text-sm text-gray-600 ml-2">Due: {formatDate(bill.dueDate)}</span>
                    </div>
                    <span className="font-bold">{formatCurrency(bill.amount)}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-yellow-700 mt-3">
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