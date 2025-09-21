export type AdminStudio = {
  id: string;
  name: string;
  city?: string;
  province?: string;
  status?: string;
  owner?: { id: string; email: string };
  avatarUrl?: string;
  photos?: string[];
  createdAt?: string;
};
