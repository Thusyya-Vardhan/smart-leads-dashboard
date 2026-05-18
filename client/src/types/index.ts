export interface IUser {
  id: string;
  name: string;
  role: 'admin' | 'sales';
}

export interface ILead {
  _id: string;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdAt: string;
}

export interface IPagination {
  total: number;
  page: number;
  pages: number;
}

export interface ILeadsResponse {
  success: boolean;
  data: ILead[];
  pagination: IPagination;
}

export interface IAuthResponse {
  success: boolean;
  token: string;
  user: IUser;
}