export type UserAdmin = {
  id: string;
  name: string;
  email: string;
  document: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  updatedAt: string;
};
