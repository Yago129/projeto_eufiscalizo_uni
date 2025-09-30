export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  matricula?: string;
  curso?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<boolean>;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'admin';
  matricula?: string;
  curso?: string;
}