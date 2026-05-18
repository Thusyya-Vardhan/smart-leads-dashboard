// Shared TypeScript interfaces used across the app
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'sales';
  createdAt: Date;
}

export interface ILead {
  _id: string;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdAt: Date;
  createdBy: string;
}

// What gets attached to req after auth middleware
export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'sales';
  };
}