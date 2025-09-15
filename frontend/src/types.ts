export interface User {
  id: string;
  name: string;
  email: string;
  language: string;
  rank: number;
  keymap: string;
}

export interface LoginCredentials {
  useremail: string;
  password: string;
}
