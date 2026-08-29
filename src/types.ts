export type Category = {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: number;
};

export type Contact = {
  id: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  categoryId: string | null;
  createdAt: number;
};
