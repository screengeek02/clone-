export type ApiError = { error: string };

export type SignupInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'USER' | 'PROVIDER';
};
