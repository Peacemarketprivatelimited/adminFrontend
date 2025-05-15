interface Permissions {
    manageUsers: boolean;
    manageProducts: boolean;
    manageCategories: boolean;
    manageOrders: boolean;
    manageSubscriptions: boolean;
  }
  
  interface Referral {
    totalEarnings: number;
    earningsByLevel: { [key: string]: number };
    // level1?: any[];
    // level2?: any[];
    // level3?: any[];
    // level4?: any[];
    // level5?: any[];
    // level6?: any[];
    // level7?: any[];
    // level8?: any[];
    // level9?: any[];
    // level10?: any[];
    [key: `level${number}`]: any[]; 

  }

  
  
  interface Subscription {
    isActive: boolean;
    amountPaid: number;
  }
  
  interface Withdrawals {
    pendingRequest: boolean;
    totalWithdrawn: number;
  }
  
  export interface User {
    _id: string;
    name: string;
    email: string;
    username: string;
    role: string;
    permissions: Permissions;
    referral: Referral;
    subscription: Subscription;
    withdrawals: Withdrawals;
    createdAt: string;
    updatedAt: string;
  }