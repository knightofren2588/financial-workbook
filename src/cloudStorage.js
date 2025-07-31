import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// You'll need to replace these with your actual Supabase credentials
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

class CloudStorage {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncQueue = [];
    this.lastSyncTime = null;
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncPendingChanges();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Generate a unique user ID for privacy
  generateUserId() {
    let userId = localStorage.getItem('financeHubUserId');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('financeHubUserId', userId);
    }
    return userId;
  }

  // Save data both locally and to cloud
  async saveData(data) {
    const userId = this.generateUserId();
    
    try {
      // Always save locally first for immediate access
      localStorage.setItem('financeHubProData', JSON.stringify(data));
      
      // Check if Supabase is properly configured
      if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
        console.warn('Supabase not configured - using local storage only');
        return { success: true, synced: false, reason: 'Supabase not configured' };
      }
      
      // If online, save to cloud
      if (this.isOnline) {
        try {
          await this.saveToCloud(userId, data);
          this.lastSyncTime = new Date().toISOString();
          localStorage.setItem('financeHubLastSync', this.lastSyncTime);
        } catch (cloudError) {
          console.error('Cloud save failed:', cloudError);
          // Queue for later sync
          this.syncQueue.push({ userId, data, timestamp: Date.now() });
          localStorage.setItem('financeHubSyncQueue', JSON.stringify(this.syncQueue));
        }
      } else {
        // Queue for later sync
        this.syncQueue.push({ userId, data, timestamp: Date.now() });
        localStorage.setItem('financeHubSyncQueue', JSON.stringify(this.syncQueue));
      }
      
      return { success: true, synced: this.isOnline };
    } catch (error) {
      console.error('Error saving data:', error);
      return { success: false, error: error.message };
    }
  }

  // Load data with cloud sync
  async loadData() {
    const userId = this.generateUserId();
    
    try {
      // First try to load from local storage
      const localData = localStorage.getItem('financeHubProData');
      
      // Check if Supabase is properly configured
      if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
        console.warn('Supabase not configured - using local storage only');
        if (localData) {
          return JSON.parse(localData);
        }
        return this.getDefaultData();
      }
      
      if (this.isOnline) {
        try {
          // Try to get latest from cloud
          const { data: cloudData, error } = await supabase
            .from('user_data')
            .select('*')
            .eq('user_id', userId)
            .single();
          
          if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            console.error('Error loading from cloud:', error);
          }
          
          if (cloudData) {
            const cloudTimestamp = new Date(cloudData.updated_at).getTime();
            const localTimestamp = localStorage.getItem('financeHubLastSync') 
              ? new Date(localStorage.getItem('financeHubLastSync')).getTime() 
              : 0;
            
            // Use cloud data if it's newer
            if (cloudTimestamp > localTimestamp) {
              localStorage.setItem('financeHubProData', cloudData.data);
              this.lastSyncTime = cloudData.updated_at;
              localStorage.setItem('financeHubLastSync', this.lastSyncTime);
              return JSON.parse(cloudData.data);
            }
          }
        } catch (cloudError) {
          console.error('Cloud sync failed, using local data:', cloudError);
        }
      }
      
      // Return local data if available, otherwise return default
      if (localData) {
        return JSON.parse(localData);
      }
      
      return this.getDefaultData();
    } catch (error) {
      console.error('Error loading data:', error);
      return this.getDefaultData();
    }
  }

  // Save to Supabase cloud
  async saveToCloud(userId, data) {
    const { error } = await supabase
      .from('user_data')
      .upsert({
        user_id: userId,
        data: JSON.stringify(data),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });
    
    if (error) {
      throw new Error(`Cloud save failed: ${error.message}`);
    }
  }

  // Sync pending changes when coming back online
  async syncPendingChanges() {
    const queue = JSON.parse(localStorage.getItem('financeHubSyncQueue') || '[]');
    if (queue.length === 0) return;
    
    const userId = this.generateUserId();
    
    for (const item of queue) {
      try {
        await this.saveToCloud(userId, item.data);
        console.log('Synced pending change from', new Date(item.timestamp));
      } catch (error) {
        console.error('Failed to sync pending change:', error);
      }
    }
    
    // Clear the queue after successful sync
    localStorage.removeItem('financeHubSyncQueue');
    this.syncQueue = [];
  }

  // Get sync status
  getSyncStatus() {
    const lastSync = localStorage.getItem('financeHubLastSync');
    const queue = JSON.parse(localStorage.getItem('financeHubSyncQueue') || '[]');
    
    return {
      isOnline: this.isOnline,
      lastSync: lastSync ? new Date(lastSync) : null,
      pendingChanges: queue.length,
      userId: this.generateUserId()
    };
  }

  // Export data for backup
  exportData() {
    const data = localStorage.getItem('financeHubProData');
    if (!data) return null;
    
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-hub-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Import data from backup
  async importData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          localStorage.setItem('financeHubProData', JSON.stringify(data));
          this.saveData(data); // Sync to cloud
          resolve(data);
        } catch (error) {
          reject(new Error('Invalid backup file'));
        }
      };
      reader.readAsText(file);
    });
  }

  // Clear all data (for privacy)
  async clearAllData() {
    const userId = this.generateUserId();
    
    try {
      // Clear from cloud
      if (this.isOnline) {
        await supabase
          .from('user_data')
          .delete()
          .eq('user_id', userId);
      }
      
      // Clear local storage
      localStorage.removeItem('financeHubProData');
      localStorage.removeItem('financeHubUserId');
      localStorage.removeItem('financeHubLastSync');
      localStorage.removeItem('financeHubSyncQueue');
      
      return { success: true };
    } catch (error) {
      console.error('Error clearing data:', error);
      return { success: false, error: error.message };
    }
  }

  // Get default data structure
  getDefaultData() {
    return {
      user: {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@equitashealth.com',
        company: 'Equitas Health',
        createdAt: '2025-07-01',
        settings: {
          notifications: true,
          darkMode: false,
          currency: 'USD'
        }
      },
      currentMonthId: 'july-2025',
      months: {
        'july-2025': {
          id: 'july-2025',
          name: 'July',
          year: 2025,
          bills: [
            { id: 1, name: 'Rent', amount: 826.00, dueDate: 11, category: 'Housing', assignedPaycheck: 1, isPaid: false, isSubscription: false },
            { id: 2, name: 'Electric', amount: 46.00, dueDate: 18, category: 'Utilities', assignedPaycheck: 2, isPaid: false, isSubscription: false },
            { id: 3, name: 'Gas', amount: 46.00, dueDate: 3, category: 'Utilities', assignedPaycheck: 2, isPaid: false, isSubscription: false },
            { id: 4, name: 'Internet', amount: 50.00, dueDate: 20, category: 'Utilities', assignedPaycheck: 2, isPaid: false, isSubscription: false },
            { id: 5, name: 'Car Payment', amount: 570.00, dueDate: 28, category: 'Transportation', assignedPaycheck: null, isPaid: false, isSubscription: false },
            { id: 6, name: 'Health Insurance', amount: 160.00, dueDate: 28, category: 'Health', assignedPaycheck: 1, isPaid: false, isSubscription: false },
            { id: 7, name: 'Dental Insurance', amount: 80.00, dueDate: 21, category: 'Health', assignedPaycheck: 2, isPaid: false, isSubscription: false },
            { id: 8, name: 'Netflix', amount: 15.99, dueDate: 4, category: 'Entertainment', assignedPaycheck: null, isPaid: false, isSubscription: true },
            { id: 9, name: 'Spotify Premium', amount: 10.99, dueDate: 13, category: 'Entertainment', assignedPaycheck: null, isPaid: false, isSubscription: true },
            { id: 10, name: 'Student Loan', amount: 50.32, dueDate: 29, category: 'Debt', assignedPaycheck: 2, isPaid: false, isSubscription: false },
            { id: 11, name: 'Groceries', amount: 400.00, dueDate: 15, category: 'Food', assignedPaycheck: 1, isPaid: false, isSubscription: false }
          ],
          paychecks: [
            { id: 1, date: '2025-07-11', amount: 1600.00, source: 'Equitas Health', label: 'First Paycheck' },
            { id: 2, date: '2025-07-25', amount: 2100.00, source: 'Equitas Health', label: 'Second Paycheck' }
          ]
        }
      },
      subscriptions: [
        {
          id: 'sub-1',
          name: 'Netflix',
          amount: 15.99,
          billingCycle: 'monthly',
          nextBilling: '2025-08-04',
          category: 'Entertainment',
          status: 'active',
          provider: 'Netflix',
          cancellationUrl: 'https://netflix.com/cancelplan',
          description: 'Standard Plan',
          connectedAccount: 'Chase Credit Card ****1234',
          lastCharged: '2025-07-04',
          autoRenew: true,
          trialEnds: null,
          yearlyDiscount: 0
        },
        {
          id: 'sub-2',
          name: 'Spotify Premium',
          amount: 10.99,
          billingCycle: 'monthly',
          nextBilling: '2025-08-13',
          category: 'Entertainment',
          status: 'active',
          provider: 'Spotify',
          cancellationUrl: 'https://spotify.com/account/subscription',
          description: 'Individual Plan',
          connectedAccount: 'Chase Credit Card ****1234',
          lastCharged: '2025-07-13',
          autoRenew: true,
          trialEnds: null,
          yearlyDiscount: 10.99 * 2
        }
      ],
      connectedAccounts: [
        {
          id: 'acc-1',
          type: 'credit_card',
          name: 'Chase Freedom',
          last4: '1234',
          provider: 'Chase',
          status: 'connected'
        },
        {
          id: 'acc-2',
          type: 'bank_account',
          name: 'Checking Account',
          last4: '5678',
          provider: 'Wells Fargo',
          status: 'connected'
        }
      ]
    };
  }
}

const cloudStorageInstance = new CloudStorage();
export default cloudStorageInstance; 