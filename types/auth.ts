export type User = {
  id: number;
  name: string;
  email: string;
};

export type SignInResponse = {
  user: User;
  token: string;
}

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
