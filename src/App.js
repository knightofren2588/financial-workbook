import React, { useState, useEffect } from 'react';

const FinanceHubPro = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMonth, setSelectedMonth] = useState('July 2025');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  
  // Initialize with default data structure
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('financeData');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      user: {
        id: 'user-1',
        name: 'John Doe',
        email: 'john.doe@equitashealth.com',
        company: 'Equitas Health',
        createdAt: new Date().toISOString(),
        settings: {
          notifications: true,
          darkMode: false
        },
        connectedAccounts: []
      },
      months: {
        'July 2025': {
          paychecks: [
            {
              id: 'paycheck-1',
              name: '1st Paycheck',
              amount: '1600.00',
              date: 'Aug 7'
            },
            {
              id: 'paycheck-2', 
              name: '2nd Paycheck',
              amount: '1600.00',
              date: 'Aug 21'
            }
          ],
          bills: [
            {
              id: 'bill-1',
              name: 'Planet Fitness',
              amount: '26.86',
              dueDate: 'Aug 5',
              category: 'Health & Fitness',
              paycheckId: 'paycheck-1',
              isPaid: false,
              actualAmount: null
            },
            {
              id: 'bill-2',
              name: 'FitBod - Workout App',
              amount: '15.99',
              dueDate: 'Aug 10',
              category: 'Health & Fitness',
              paycheckId: 'paycheck-1',
              isSubscription: true,
              isPaid: false,
              actualAmount: null
            },
            {
              id: 'bill-3',
              name: 'Peacock - Stream App',
              amount: '7.99',
              dueDate: 'Aug 12',
              category: 'Entertainment',
              paycheckId: 'paycheck-1',
              isSubscription: true,
              isPaid: false,
              actualAmount: null
            },
            {
              id: 'bill-4',
              name: 'ChatGPT',
              amount: '20.00',
              dueDate: 'Aug 15',
              category: 'Productivity',
              paycheckId: 'paycheck-1',
              isSubscription: true,
              isPaid: false,
              actualAmount: null
            },
            {
              id: 'bill-5',
              name: 'Disney Plus',
              amount: '18.22',
              dueDate: 'Aug 18',
              category: 'Entertainment',
              paycheckId: 'paycheck-1',
              isSubscription: true,
              isPaid: false,
              actualAmount: null
            },
            {
              id: 'bill-6',
              name: 'Amazon Prime',
              amount: '16.00',
              dueDate: 'Aug 20',
              category: 'Shopping',
              paycheckId: 'paycheck-1',
              isSubscription: true,
              isPaid: false,
              actualAmount: null
            },
            {
              id: 'bill-7',
              name: 'Electric',
              amount: '46.00',
              dueDate: 'Aug 22',
              category: 'Utilities',
              paycheckId: 'paycheck-2',
              isPaid: false,
              actualAmount: null
            },
            {
              id: 'bill-8',
              name: 'Gas',
              amount: '46.00',
              dueDate: 'Aug 24',
              category: 'Utilities',
              paycheckId: 'paycheck-2',
              isPaid: false,
              actualAmount: null
            },
            {
              id: 'bill-9',
              name: 'Water, Sewer, Trash',
              amount: '50.00',
              dueDate: 'Aug 26',
              category: 'Utilities',
              paycheckId: 'paycheck-2',
              isPaid: false,
              actualAmount: null
            },
            {
              id: 'bill-10',
              name: 'GloFiber - Internet',
              amount: '80.00',
              dueDate: 'Aug 28',
              category: 'Utilities',
              paycheckId: 'paycheck-2',
              isPaid: false,
              actualAmount: null
            },
            {
              id: 'bill-11',
              name: 'Claude AI',
              amount: '100.00',
              dueDate: 'Aug 30',
              category: 'Productivity',
              paycheckId: 'paycheck-2',
              isSubscription: true,
              isPaid: false,
              actualAmount: null
            },
            {
              id: 'bill-12',
              name: 'Choice Home Warranty',
              amount: '50.32',
              dueDate: 'Aug 31',
              category: 'Insurance',
              paycheckId: 'paycheck-2',
              isPaid: false,
              actualAmount: null
            }
          ]
        }
      },
      subscriptions: [
        {
          id: 'sub-1',
          name: 'Netflix',
          provider: 'Netflix',
          amount: 15.49,
          billingCycle: 'Monthly',
          nextBilling: '2025-08-15',
          status: 'active',
          description: 'Standard Plan',
          category: 'Entertainment'
        },
        {
          id: 'sub-2',
          name: 'Spotify Premium',
          provider: 'Spotify',
          amount: 9.99,
          billingCycle: 'Monthly',
          nextBilling: '2025-08-20',
          status: 'active',
          description: 'Individual Plan',
          category: 'Entertainment'
        },
        {
          id: 'sub-3',
          name: 'Adobe Creative Cloud',
          provider: 'Adobe',
          amount: 52.99,
          billingCycle: 'Monthly',
          nextBilling: '2025-08-10',
          status: 'trial',
          description: 'All Apps',
          category: 'Productivity'
        }
      ]
    };
  });

  // Modal states
  const [showBillModal, setShowBillModal] = useState(false);
  const [showPaycheckModal, setShowPaycheckModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [editingPaycheck, setEditingPaycheck] = useState(null);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [editingAccount, setEditingAccount] = useState(null);

  // Form states
  const [newBill, setNewBill] = useState({
    name: '',
    amount: '',
    dueDate: '',
    category: 'Utilities'
  });

  const [newPaycheck, setNewPaycheck] = useState({
    name: '',
    amount: '',
    date: ''
  });

  const [newSubscription, setNewSubscription] = useState({
    name: '',
    provider: '',
    amount: '',
    billingCycle: 'Monthly',
    nextBilling: '',
    description: '',
    category: 'Entertainment'
  });

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    company: ''
  });

  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'checking',
    lastFour: '',
    balance: ''
  });

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Save data whenever it changes
  useEffect(() => {
    localStorage.setItem('financeData', JSON.stringify(data));
  }, [data]);

  const currentMonthData = data.months[selectedMonth] || { paychecks: [], bills: [] };

  // Handle add new bill
  const handleAddBill = () => {
    if (!newBill.name || !newBill.amount) return;

    const updatedData = { ...data };
    if (!updatedData.months[selectedMonth]) {
      updatedData.months[selectedMonth] = { paychecks: [], bills: [] };
    }

    const bill = {
      id: 'bill-' + Date.now(),
      name: newBill.name,
      amount: newBill.amount,
      dueDate: newBill.dueDate,
      category: newBill.category,
      paycheckId: null,
      isPaid: false,
      actualAmount: null
    };

    updatedData.months[selectedMonth].bills.push(bill);
    setData(updatedData);
    setNewBill({ name: '', amount: '', dueDate: '', category: 'Utilities' });
    setShowBillModal(false);
  };

  // Handle add new paycheck
  const handleAddPaycheck = () => {
    if (!newPaycheck.name || !newPaycheck.amount) return;

    const updatedData = { ...data };
    if (!updatedData.months[selectedMonth]) {
      updatedData.months[selectedMonth] = { paychecks: [], bills: [] };
    }

    const paycheck = {
      id: 'paycheck-' + Date.now(),
      name: newPaycheck.name,
      amount: newPaycheck.amount,
      date: newPaycheck.date
    };

    updatedData.months[selectedMonth].paychecks.push(paycheck);
    setData(updatedData);
    setNewPaycheck({ name: '', amount: '', date: '' });
    setShowPaycheckModal(false);
  };

  // Handle add new subscription
  const handleAddSubscription = () => {
    if (!newSubscription.name || !newSubscription.amount || !newSubscription.provider) return;

    const updatedData = { ...data };
    const subscription = {
      id: 'sub-' + Date.now(),
      name: newSubscription.name,
      provider: newSubscription.provider,
      amount: parseFloat(newSubscription.amount),
      billingCycle: newSubscription.billingCycle,
      nextBilling: newSubscription.nextBilling,
      status: 'active',
      description: newSubscription.description,
      category: newSubscription.category
    };

    updatedData.subscriptions.push(subscription);
    setData(updatedData);
    setNewSubscription({
      name: '',
      provider: '',
      amount: '',
      billingCycle: 'Monthly',
      nextBilling: '',
      description: '',
      category: 'Entertainment'
    });
    setShowSubscriptionModal(false);
  };

  // Handle assign bill to paycheck
  const handleAssignBill = (billId, paycheckId) => {
    const updatedData = { ...data };
    if (updatedData.months[selectedMonth]) {
      updatedData.months[selectedMonth].bills = updatedData.months[selectedMonth].bills.map(bill => {
        if (bill.id === billId) {
          return { ...bill, paycheckId: paycheckId };
        }
        return bill;
      });
      setData(updatedData);
    }
  };

  // Handle edit bill
  const handleEditBill = (bill) => {
    setEditingBill(bill);
    setNewBill({
      name: bill.name,
      amount: bill.amount,
      dueDate: bill.dueDate,
      category: bill.category
    });
    setShowBillModal(true);
  };

  // Handle save edited bill
  const handleSaveEditedBill = () => {
    if (!newBill.name || !newBill.amount) return;

    const updatedData = { ...data };
    if (updatedData.months[selectedMonth]) {
      updatedData.months[selectedMonth].bills = updatedData.months[selectedMonth].bills.map(bill => {
        if (bill.id === editingBill.id) {
          return {
            ...bill,
            name: newBill.name,
            amount: newBill.amount,
            dueDate: newBill.dueDate,
            category: newBill.category
          };
        }
        return bill;
      });
      setData(updatedData);
    }
    
    setEditingBill(null);
    setNewBill({ name: '', amount: '', dueDate: '', category: 'Utilities' });
    setShowBillModal(false);
  };

  // Handle edit paycheck
  const handleEditPaycheck = (paycheck) => {
    setEditingPaycheck(paycheck);
    setNewPaycheck({
      name: paycheck.name,
      amount: paycheck.amount,
      date: paycheck.date
    });
    setShowPaycheckModal(true);
  };

  // Handle save edited paycheck
  const handleSaveEditedPaycheck = () => {
    if (!newPaycheck.name || !newPaycheck.amount) return;

    const updatedData = { ...data };
    if (updatedData.months[selectedMonth]) {
      updatedData.months[selectedMonth].paychecks = updatedData.months[selectedMonth].paychecks.map(paycheck => {
        if (paycheck.id === editingPaycheck.id) {
          return {
            ...paycheck,
            name: newPaycheck.name,
            amount: newPaycheck.amount,
            date: newPaycheck.date
          };
        }
        return paycheck;
      });
      setData(updatedData);
    }
    
    setEditingPaycheck(null);
    setNewPaycheck({ name: '', amount: '', date: '' });
    setShowPaycheckModal(false);
  };

  // Handle delete bill
  const handleDeleteBill = (billId) => {
    const updatedData = { ...data };
    if (updatedData.months[selectedMonth]) {
      updatedData.months[selectedMonth].bills = updatedData.months[selectedMonth].bills.filter(bill => bill.id !== billId);
      setData(updatedData);
    }
  };

  // Handle delete paycheck
  const handleDeletePaycheck = (paycheckId) => {
    const updatedData = { ...data };
    if (updatedData.months[selectedMonth]) {
      updatedData.months[selectedMonth].paychecks = updatedData.months[selectedMonth].paychecks.filter(paycheck => paycheck.id !== paycheckId);
      // Also remove paycheck assignment from bills
      updatedData.months[selectedMonth].bills = updatedData.months[selectedMonth].bills.map(bill => {
        if (bill.paycheckId === paycheckId) {
          return { ...bill, paycheckId: null };
        }
        return bill;
      });
      setData(updatedData);
    }
  };

  // Handle remove bill from paycheck
  const handleRemoveBillFromPaycheck = (billId) => {
    const updatedData = { ...data };
    if (updatedData.months[selectedMonth]) {
      updatedData.months[selectedMonth].bills = updatedData.months[selectedMonth].bills.map(bill => {
        if (bill.id === billId) {
          return { ...bill, paycheckId: null };
        }
        return bill;
      });
      setData(updatedData);
    }
  };

  // Handle toggle paid status
  const handleTogglePaid = (billId, isPaid) => {
    const updatedData = { ...data };
    
    // Find and update the bill in the current month's data
    if (updatedData.months[selectedMonth]) {
      updatedData.months[selectedMonth].bills = updatedData.months[selectedMonth].bills.map(bill => {
        if (bill.id === billId) {
          return { ...bill, isPaid: isPaid, actualAmount: isPaid ? bill.actualAmount : null };
        }
        return bill;
      });
      setData(updatedData);
    }
  };

  // Handle update actual amount paid
  const handleUpdateActualAmount = (billId, actualAmount) => {
    const updatedData = { ...data };
    
    // Find and update the bill in the current month's data
    if (updatedData.months[selectedMonth]) {
      updatedData.months[selectedMonth].bills = updatedData.months[selectedMonth].bills.map(bill => {
        if (bill.id === billId) {
          return { ...bill, actualAmount: actualAmount };
        }
        return bill;
      });
      setData(updatedData);
    }
  };

  // Handle create new month
  const handleCreateNewMonth = () => {
    const monthOptions = [
      'January 2025', 'February 2025', 'March 2025', 'April 2025', 
      'May 2025', 'June 2025', 'July 2025', 'August 2025', 
      'September 2025', 'October 2025', 'November 2025', 'December 2025',
      'January 2026', 'February 2026', 'March 2026', 'April 2026', 
      'May 2026', 'June 2026', 'July 2026', 'August 2026', 
      'September 2026', 'October 2026', 'November 2026', 'December 2026'
    ];
    
    const nextMonth = monthOptions.find(month => !data.months[month]);
    if (nextMonth) {
      const updatedData = { ...data };
      updatedData.months[nextMonth] = { paychecks: [], bills: [] };
      setData(updatedData);
      setSelectedMonth(nextMonth);
    }
  };

  // Handle copy from previous month
  const handleCopyFromPreviousMonth = () => {
    const monthOrder = Object.keys(data.months).sort();
    const currentIndex = monthOrder.indexOf(selectedMonth);
    if (currentIndex > 0) {
      const previousMonth = monthOrder[currentIndex - 1];
      const previousData = data.months[previousMonth];
      
      const updatedData = { ...data };
      if (!updatedData.months[selectedMonth]) {
        updatedData.months[selectedMonth] = { paychecks: [], bills: [] };
      }
      
      // Copy bills (but reset paid status and actual amounts)
      const copiedBills = previousData.bills.map(bill => ({
        ...bill,
        id: 'bill-' + Date.now() + Math.random(),
        paycheckId: null,
        isPaid: false,
        actualAmount: null
      }));
      
      updatedData.months[selectedMonth].bills = [...updatedData.months[selectedMonth].bills, ...copiedBills];
      setData(updatedData);
    }
  };

  // Handle subscription actions
  const handleSubscriptionAction = (subscriptionId, action) => {
    const updatedData = { ...data };
    updatedData.subscriptions = updatedData.subscriptions.map(sub => {
      if (sub.id === subscriptionId) {
        return { ...sub, status: action };
      }
      return sub;
    });
    setData(updatedData);
  };

  // Handle add subscription to budget
  const handleAddSubscriptionToBudget = (subscription) => {
    const updatedData = { ...data };
    if (!updatedData.months[selectedMonth]) {
      updatedData.months[selectedMonth] = { paychecks: [], bills: [] };
    }

    const bill = {
      id: 'bill-' + Date.now(),
      name: subscription.name,
      amount: subscription.amount.toString(),
      dueDate: new Date(subscription.nextBilling).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      category: subscription.category,
      paycheckId: null,
      isSubscription: true,
      isPaid: false,
      actualAmount: null
    };

    updatedData.months[selectedMonth].bills.push(bill);
    setData(updatedData);
  };

  // Handle update user profile
  const handleUpdateUserProfile = (updatedUser) => {
    const updatedData = { ...data };
    updatedData.user = { ...updatedData.user, ...updatedUser };
    setData(updatedData);
  };

  // Handle toggle settings
  const handleToggleSetting = (setting) => {
    const updatedData = { ...data };
    updatedData.user.settings[setting] = !updatedData.user.settings[setting];
    
    if (setting === 'darkMode') {
      setIsDarkMode(updatedData.user.settings[setting]);
    }
    
    setData(updatedData);
  };

  // Handle add connected account
  const handleAddConnectedAccount = () => {
    if (!newAccount.name || !newAccount.lastFour) return;

    const updatedData = { ...data };
    const account = {
      id: 'account-' + Date.now(),
      name: newAccount.name,
      type: newAccount.type,
      lastFour: newAccount.lastFour,
      balance: newAccount.balance || '0',
      addedAt: new Date().toISOString()
    };

    updatedData.user.connectedAccounts.push(account);
    setData(updatedData);
    setNewAccount({ name: '', type: 'checking', lastFour: '', balance: '' });
    setShowAccountModal(false);
  };

  // Handle delete connected account
  const handleDeleteConnectedAccount = (accountId) => {
    const updatedData = { ...data };
    updatedData.user.connectedAccounts = updatedData.user.connectedAccounts.filter(account => account.id !== accountId);
    setData(updatedData);
  };

  // Handle add new user
  const handleAddNewUser = () => {
    if (!newUser.name || !newUser.email) return;

    // For now, just replace current user (in a real app, this would create a new user session)
    const updatedData = {
      user: {
        id: 'user-' + Date.now(),
        name: newUser.name,
        email: newUser.email,
        company: newUser.company,
        createdAt: new Date().toISOString(),
        settings: {
          notifications: true,
          darkMode: false
        },
        connectedAccounts: []
      },
      months: {},
      subscriptions: []
    };

    setData(updatedData);
    setNewUser({ name: '', email: '', company: '' });
    setShowAddUserModal(false);
    setShowUserManagement(false);
    setSelectedMonth('July 2025');
  };

  // Handle delete current user
  const handleDeleteCurrentUser = () => {
    // Reset to default data
    const defaultData = {
      user: {
        id: 'user-1',
        name: 'New User',
        email: 'user@example.com',
        company: 'Company Name',
        createdAt: new Date().toISOString(),
        settings: {
          notifications: true,
          darkMode: false
        },
        connectedAccounts: []
      },
      months: {},
      subscriptions: []
    };

    setData(defaultData);
    setShowDeleteUserModal(false);
    setShowUserManagement(false);
    setSelectedMonth('July 2025');
  };

  const unassignedBills = currentMonthData.bills.filter(bill => !bill.paycheckId);

  const categories = ['Utilities', 'Food', 'Transportation', 'Entertainment', 'Health & Fitness', 'Shopping', 'Insurance', 'Debt', 'Savings', 'Other', 'Productivity'];
  const accountTypes = ['checking', 'savings', 'credit', 'investment'];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-white to-cyan-50'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">FinanceHub Pro</h1>
            <p className="text-gray-600 dark:text-gray-400">Complete Financial Management System</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Month Navigation */}
            <div className="flex items-center space-x-2">
              {Object.keys(data.months).map(month => (
                <button
                  key={month}
                  onClick={() => setSelectedMonth(month)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedMonth === month
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {month}
                </button>
              ))}
              <button
                onClick={handleCreateNewMonth}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                + New Month
              </button>
            </div>
            
            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowUserModal(true)}
                className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  {data.user.name.charAt(0)}
                </div>
                <span className="text-gray-900 dark:text-white font-medium">{data.user.name}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'subscriptions', label: 'Subscriptions', icon: '📱' },
            { id: 'manage', label: 'Manage', icon: '⚙️' },
            { id: 'history', label: 'History', icon: '📈' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {(() => {
                const totalIncome = currentMonthData.paychecks.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
                const budgetedExpenses = currentMonthData.bills.reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);
                const actualExpenses = currentMonthData.bills.reduce((sum, bill) => {
                  if (bill.isPaid && bill.actualAmount) {
                    return sum + parseFloat(bill.actualAmount || 0);
                  }
                  return sum + (bill.isPaid ? parseFloat(bill.amount || 0) : 0);
                }, 0);
                const paidBills = currentMonthData.bills.filter(b => b.isPaid).length;
                const totalBills = currentMonthData.bills.length;
                
                return (
                  <>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">${totalIncome.toFixed(2)}</div>
                      <div className="text-gray-600 dark:text-gray-400">Total Income</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">${budgetedExpenses.toFixed(2)}</div>
                      <div className="text-gray-600 dark:text-gray-400">Budgeted Expenses</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">${actualExpenses.toFixed(2)}</div>
                      <div className="text-gray-600 dark:text-gray-400">Actual Expenses</div>
                      {actualExpenses > 0 && budgetedExpenses !== actualExpenses && (
                        <div className={`text-sm ${budgetedExpenses > actualExpenses ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {budgetedExpenses > actualExpenses ? 'Under' : 'Over'} by ${Math.abs(budgetedExpenses - actualExpenses).toFixed(2)}
                        </div>
                      )}
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className={`text-2xl font-bold ${(totalIncome - (actualExpenses > 0 ? actualExpenses : budgetedExpenses)) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        ${(totalIncome - (actualExpenses > 0 ? actualExpenses : budgetedExpenses)).toFixed(2)}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {actualExpenses > 0 ? 'Actual' : 'Projected'} Remaining
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Bills paid: {paidBills}/{totalBills}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Paychecks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {currentMonthData.paychecks.map(paycheck => (
                <div key={paycheck.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 p-4 text-white">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold">{paycheck.name} • {paycheck.date}</h3>
                        <div className="text-2xl font-bold">${paycheck.amount}</div>
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => handleEditPaycheck(paycheck)}
                          className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-sm transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePaycheck(paycheck.id)}
                          className="bg-red-500/20 hover:bg-red-500/30 px-3 py-1 rounded-lg text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    {currentMonthData.bills.filter(bill => bill.paycheckId === paycheck.id).map(bill => (
                      <div key={bill.id} className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border ${bill.isPaid ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={bill.isPaid || false}
                              onChange={(e) => handleTogglePaid(bill.id, e.target.checked)}
                              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            {bill.isSubscription && <span className="text-sm">📱</span>}
                            <span className={`font-medium ${bill.isPaid ? 'text-green-700 dark:text-green-300 line-through' : 'text-gray-900 dark:text-white'}`}>{bill.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-red-600 dark:text-red-400">${bill.amount}</span>
                            {bill.isPaid && bill.actualAmount && (
                              <div className="text-sm text-green-600 dark:text-green-400">
                                Paid: ${bill.actualAmount}
                              </div>
                            )}
                          </div>
                        </div>
                        {bill.isPaid && (
                          <div className="mb-2">
                            <input
                              type="number"
                              placeholder="Actual amount paid"
                              value={bill.actualAmount || ''}
                              onChange={(e) => handleUpdateActualAmount(bill.id, e.target.value)}
                              className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                          </div>
                        )}
                        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                          <span>Due: {bill.dueDate} | {bill.category}</span>
                          <div className="space-x-2">
                            <button
                              onClick={() => handleEditBill(bill)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleRemoveBillFromPaycheck(bill.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/50">
                    {(() => {
                      const paycheckBills = currentMonthData.bills.filter(b => b.paycheckId === paycheck.id);
                      const budgetedTotal = paycheckBills.reduce((sum, bill) => sum + parseFloat(bill.amount || 0), 0);
                      const actualTotal = paycheckBills.reduce((sum, bill) => {
                        if (bill.isPaid && bill.actualAmount) {
                          return sum + parseFloat(bill.actualAmount || 0);
                        }
                        return sum + (bill.isPaid ? parseFloat(bill.amount || 0) : 0);
                      }, 0);
                      const budgetedRemaining = parseFloat(paycheck.amount) - budgetedTotal;
                      const actualRemaining = parseFloat(paycheck.amount) - actualTotal;
                      const paidBills = paycheckBills.filter(b => b.isPaid).length;
                      const totalBills = paycheckBills.length;
                      
                      return (
                        <div className={`p-3 rounded-lg ${budgetedRemaining >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Budgeted:</span>
                            <span className={`font-bold ${budgetedRemaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              ${budgetedRemaining.toFixed(2)}
                            </span>
                          </div>
                          {actualTotal > 0 && (
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Actual:</span>
                              <span className={`font-bold ${actualRemaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                ${actualRemaining.toFixed(2)}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
                            <span>Bills paid: {paidBills}/{totalBills}</span>
                            {budgetedTotal !== actualTotal && actualTotal > 0 && (
                              <span className={budgetedTotal > actualTotal ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                {budgetedTotal > actualTotal ? 'Under' : 'Over'} by ${Math.abs(budgetedTotal - actualTotal).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>

            {/* Unassigned Bills */}
            {unassignedBills.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Unassigned Bills</h3>
                <div className="space-y-4">
                  {unassignedBills.map(bill => (
                    <div key={bill.id} className={`bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 ${bill.isPaid ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20' : ''}`}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={bill.isPaid || false}
                            onChange={(e) => handleTogglePaid(bill.id, e.target.checked)}
                            className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          {bill.isSubscription && <span className="text-sm">📱</span>}
                          <span className={`font-medium ${bill.isPaid ? 'text-green-700 dark:text-green-300 line-through' : 'text-gray-900 dark:text-white'}`}>{bill.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-red-600 dark:text-red-400">${bill.amount}</span>
                          {bill.isPaid && bill.actualAmount && (
                            <div className="text-sm text-green-600 dark:text-green-400">
                              Paid: ${bill.actualAmount}
                            </div>
                          )}
                        </div>
                      </div>
                      {bill.isPaid && (
                        <div className="mb-2">
                          <input
                            type="number"
                            placeholder="Actual amount paid"
                            value={bill.actualAmount || ''}
                            onChange={(e) => handleUpdateActualAmount(bill.id, e.target.value)}
                            className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      )}
                      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>Due: {bill.dueDate} | {bill.category}</span>
                        <div className="space-x-2">
                          <button
                            onClick={() => handleEditBill(bill)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBill(bill.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <select
                        value={bill.paycheckId || ''}
                        onChange={(e) => handleAssignBill(bill.id, e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Assign to paycheck...</option>
                        {currentMonthData.paychecks.map(paycheck => (
                          <option key={paycheck.id} value={paycheck.id}>
                            {paycheck.name} (${paycheck.amount})
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Subscription Management</h2>
              <button
                onClick={() => setShowSubscriptionModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                + Add New Subscription
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.subscriptions.map(subscription => (
                <div key={subscription.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{subscription.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{subscription.provider}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      subscription.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      subscription.status === 'trial' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      subscription.status === 'paused' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {subscription.status}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
                      <span className="font-medium text-gray-900 dark:text-white">${subscription.amount}/{subscription.billingCycle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Next billing:</span>
                      <span className="text-sm text-gray-900 dark:text-white">{new Date(subscription.nextBilling).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Category:</span>
                      <span className="text-sm text-gray-900 dark:text-white">{subscription.category}</span>
                    </div>
                    {subscription.description && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Plan:</span>
                        <span className="text-sm text-gray-900 dark:text-white">{subscription.description}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {subscription.status === 'active' && (
                      <>
                        <button
                          onClick={() => handleSubscriptionAction(subscription.id, 'paused')}
                          className="flex-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 px-3 py-1 rounded text-sm hover:bg-yellow-200 dark:hover:bg-yellow-900/30 transition-colors"
                        >
                          Pause
                        </button>
                        <button
                          onClick={() => handleSubscriptionAction(subscription.id, 'cancelled')}
                          className="flex-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 px-3 py-1 rounded text-sm hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    
                    {subscription.status === 'paused' && (
                      <button
                        onClick={() => handleSubscriptionAction(subscription.id, 'active')}
                        className="flex-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-3 py-1 rounded text-sm hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"
                      >
                        Resume
                      </button>
                    )}
                    
                    {subscription.status === 'cancelled' && (
                      <span className="flex-1 text-center text-sm text-gray-500 dark:text-gray-400 py-1">
                        Cancelled
                      </span>
                    )}
                    
                    <button
                      onClick={() => handleAddSubscriptionToBudget(subscription)}
                      className="flex-1 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-400 px-3 py-1 rounded text-sm hover:bg-indigo-200 dark:hover:bg-indigo-900/30 transition-colors"
                    >
                      Add to Budget
                    </button>
                  </div>

                  {subscription.billingCycle === 'Monthly' && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-sm text-blue-800 dark:text-blue-400">
                        💰 Save ${((subscription.amount * 12) - (subscription.amount * 10)).toFixed(2)}/year with annual billing
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manage Tab */}
        {activeTab === 'manage' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Add Bill */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Bill</h3>
                <button
                  onClick={() => setShowBillModal(true)}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  + Add Bill
                </button>
              </div>

              {/* Add Paycheck */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Paycheck</h3>
                <button
                  onClick={() => setShowPaycheckModal(true)}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  + Add Paycheck
                </button>
              </div>
            </div>

            {/* Copy from Previous Month */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Copy Recurring Bills</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Copy bills from your previous month to save time on recurring expenses.
              </p>
              <button
                onClick={handleCopyFromPreviousMonth}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                disabled={Object.keys(data.months).length <= 1}
              >
                Copy from Previous Month
              </button>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Financial History</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(data.months).map(([month, monthData]) => {
                const totalIncome = monthData.paychecks.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
                const totalExpenses = monthData.bills.reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);
                const remaining = totalIncome - totalExpenses;
                
                return (
                  <div key={month} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">{month}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Income:</span>
                        <span className="font-medium text-green-600 dark:text-green-400">${totalIncome.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Expenses:</span>
                        <span className="font-medium text-red-600 dark:text-red-400">${totalExpenses.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-2">
                        <span className="font-medium text-gray-900 dark:text-white">Remaining:</span>
                        <span className={`font-bold ${remaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          ${remaining.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {monthData.bills.length} bills • {monthData.paychecks.length} paychecks
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bill Modal */}
        {showBillModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {editingBill ? 'Edit Bill' : 'Add New Bill'}
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Bill name"
                  value={newBill.name}
                  onChange={(e) => setNewBill({ ...newBill, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={newBill.amount}
                  onChange={(e) => setNewBill({ ...newBill, amount: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Due date (e.g., Aug 15)"
                  value={newBill.dueDate}
                  onChange={(e) => setNewBill({ ...newBill, dueDate: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <select
                  value={newBill.category}
                  onChange={(e) => setNewBill({ ...newBill, category: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={editingBill ? handleSaveEditedBill : handleAddBill}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {editingBill ? 'Save Changes' : 'Add Bill'}
                </button>
                <button
                  onClick={() => {
                    setShowBillModal(false);
                    setEditingBill(null);
                    setNewBill({ name: '', amount: '', dueDate: '', category: 'Utilities' });
                  }}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Paycheck Modal */}
        {showPaycheckModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {editingPaycheck ? 'Edit Paycheck' : 'Add New Paycheck'}
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Paycheck name (e.g., 1st Paycheck)"
                  value={newPaycheck.name}
                  onChange={(e) => setNewPaycheck({ ...newPaycheck, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={newPaycheck.amount}
                  onChange={(e) => setNewPaycheck({ ...newPaycheck, amount: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Date (e.g., Aug 15)"
                  value={newPaycheck.date}
                  onChange={(e) => setNewPaycheck({ ...newPaycheck, date: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={editingPaycheck ? handleSaveEditedPaycheck : handleAddPaycheck}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  {editingPaycheck ? 'Save Changes' : 'Add Paycheck'}
                </button>
                <button
                  onClick={() => {
                    setShowPaycheckModal(false);
                    setEditingPaycheck(null);
                    setNewPaycheck({ name: '', amount: '', date: '' });
                  }}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Modal */}
        {showSubscriptionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add New Subscription</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Subscription name (e.g., Netflix)"
                  value={newSubscription.name}
                  onChange={(e) => setNewSubscription({ ...newSubscription, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Provider (e.g., Netflix Inc.)"
                  value={newSubscription.provider}
                  onChange={(e) => setNewSubscription({ ...newSubscription, provider: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Monthly amount"
                  value={newSubscription.amount}
                  onChange={(e) => setNewSubscription({ ...newSubscription, amount: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Description (e.g., Basic Plan)"
                  value={newSubscription.description}
                  onChange={(e) => setNewSubscription({ ...newSubscription, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <select
                  value={newSubscription.category}
                  onChange={(e) => setNewSubscription({ ...newSubscription, category: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="Entertainment">Entertainment</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Health & Fitness">Health & Fitness</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Other">Other</option>
                </select>
                <select
                  value={newSubscription.billingCycle}
                  onChange={(e) => setNewSubscription({ ...newSubscription, billingCycle: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Annual">Annual</option>
                  <option value="Weekly">Weekly</option>
                </select>
                <input
                  type="date"
                  placeholder="Next billing date"
                  value={newSubscription.nextBilling}
                  onChange={(e) => setNewSubscription({ ...newSubscription, nextBilling: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleAddSubscription}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add Subscription
                </button>
                <button
                  onClick={() => {
                    setShowSubscriptionModal(false);
                    setNewSubscription({
                      name: '',
                      provider: '',
                      amount: '',
                      billingCycle: 'Monthly',
                      nextBilling: '',
                      description: '',
                      category: 'Entertainment'
                    });
                  }}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Profile Modal */}
        {showUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {data.user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{data.user.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{data.user.email}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">{data.user.company}</p>
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 dark:text-white">Dark Mode</span>
                  <button
                    onClick={() => {
                      setIsDarkMode(!isDarkMode);
                      handleToggleSetting('darkMode');
                    }}
                    className={`w-12 h-6 rounded-full transition-colors ${isDarkMode ? 'bg-indigo-600' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 dark:text-white">Notifications</span>
                  <button
                    onClick={() => handleToggleSetting('notifications')}
                    className={`w-12 h-6 rounded-full transition-colors ${data.user.settings.notifications ? 'bg-indigo-600' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${data.user.settings.notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>

              {/* Connected Accounts */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">Connected Accounts</h4>
                  <button
                    onClick={() => setShowAccountModal(true)}
                    className="text-indigo-600 dark:text-indigo-400 text-sm hover:text-indigo-800 dark:hover:text-indigo-300"
                  >
                    + Add Account (Manual)
                  </button>
                </div>
                {data.user.connectedAccounts.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    No accounts connected. Add accounts manually for tracking purposes only.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {data.user.connectedAccounts.map(account => (
                      <div key={account.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">{account.name}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">****{account.lastFour}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteConnectedAccount(account.id)}
                          className="text-red-600 dark:text-red-400 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-xs text-yellow-800 dark:text-yellow-400">
                    ⚠️ For Demo/Personal Use Only - No real bank connections
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowUserModal(false);
                    setShowUserManagement(true);
                  }}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  ⚙️ Manage Users
                </button>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="w-full bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Management Modal */}
        {showUserManagement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">User Management</h3>
              
              {/* Current User */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Current User</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-600 dark:text-gray-400">Name:</span> {data.user.name}</p>
                  <p><span className="text-gray-600 dark:text-gray-400">Email:</span> {data.user.email}</p>
                  <p><span className="text-gray-600 dark:text-gray-400">Company:</span> {data.user.company}</p>
                  <p><span className="text-gray-600 dark:text-gray-400">Created:</span> {new Date(data.user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    // Edit current user - for now just show an alert
                    const newName = prompt('Enter new name:', data.user.name);
                    const newEmail = prompt('Enter new email:', data.user.email);
                    const newCompany = prompt('Enter new company:', data.user.company);
                    
                    if (newName && newEmail) {
                      handleUpdateUserProfile({
                        name: newName,
                        email: newEmail,
                        company: newCompany || data.user.company
                      });
                    }
                  }}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Current User
                </button>
                
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  + Add New User
                </button>
                
                <button
                  onClick={() => setShowDeleteUserModal(true)}
                  className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Current User
                </button>
                
                <button
                  onClick={() => setShowUserManagement(false)}
                  className="w-full bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add New User</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Company name"
                  value={newUser.company}
                  onChange={(e) => setNewUser({ ...newUser, company: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleAddNewUser}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Create User
                </button>
                <button
                  onClick={() => {
                    setShowAddUserModal(false);
                    setNewUser({ name: '', email: '', company: '' });
                  }}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete User Modal */}
        {showDeleteUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4">⚠️ Delete User Account</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                This will permanently delete your user account and ALL associated data including:
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 mb-6 space-y-1">
                <li>• All months and financial data ({Object.keys(data.months).length} months)</li>
                <li>• All subscriptions ({data.subscriptions.length} subscriptions)</li>
                <li>• All connected accounts ({data.user.connectedAccounts.length} accounts)</li>
                <li>• User profile and settings</li>
              </ul>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Consider creating a new user instead if you want to start fresh while keeping your current data.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteCurrentUser}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Yes, Delete Everything
                </button>
                <button
                  onClick={() => setShowDeleteUserModal(false)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Account Modal */}
        {showAccountModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add Connected Account (Manual)</h3>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg mb-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-400">
                  ⚠️ This is for tracking purposes only. No real bank connection is made.
                </p>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Account name (e.g., Wells Fargo Checking)"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <select
                  value={newAccount.type}
                  onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {accountTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Last 4 digits (e.g., 1234)"
                  value={newAccount.lastFour}
                  onChange={(e) => setNewAccount({ ...newAccount, lastFour: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  maxLength="4"
                />
                <input
                  type="number"
                  placeholder="Current balance (optional)"
                  value={newAccount.balance}
                  onChange={(e) => setNewAccount({ ...newAccount, balance: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleAddConnectedAccount}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add Account
                </button>
                <button
                  onClick={() => {
                    setShowAccountModal(false);
                    setNewAccount({ name: '', type: 'checking', lastFour: '', balance: '' });
                  }}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceHubPro;