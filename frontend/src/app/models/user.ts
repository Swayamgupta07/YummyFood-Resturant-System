export interface User {
  id?: string;
  _id?: string;
  name: string;
  email?: string;
  phone?: string;
  role?: 'CUSTOMER' | 'ADMIN';
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  name: string;
  email?: string;
  phone?: string;
  password?: string;
  role?: 'CUSTOMER' | 'ADMIN';
}

export interface AuthResponse {
  token: string;
  user: User;
}
