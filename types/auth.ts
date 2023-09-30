export type User = {
  id: number;
  name: string;
  email: string;
};

export type SignInResponse = {
  user: User;
  token: string;
};

export type ValidationErrors = {
  message: string;
  errors: object;
};

export type signUpCredentials = {
  name: string | null;
  email: string | null;
  password: string | null;
  password_confirmation: string | null;
};

export type signInCredentials = {
  email: string | null;
  password: string | null;
};

export interface InputErrors {
  name: Array<string> | null;
  email: Array<string>;
  password: Array<string>;
}
export interface AuthStore {
  user: User | null;
  token: string | null;
  errors: {
    message: string;
    errors: InputErrors | null;
  } | null;
  getUser: () => Promise<void>;
  signInUser: (credentials: signInCredentials) => Promise<boolean>;
  signUpUser: (credentials: signUpCredentials) => Promise<boolean>;
  signOutUser: () => Promise<void>;
  clearErrors: () => void;
}
