export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  name: {
    firstname: string;
    lastname: string;
  };
}