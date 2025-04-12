import { Blog, Role, User } from "./mock.type";

export const mockDB: {
  users: User[];
  blogs: Blog[];
  roles: Role[];
} = {
  users: [
    {
      id: 1,
      name: 'Admin',
      email: 'admin@example.com',
      password: 'adminpass',
      roleId: 1,
    },
  ],
  blogs: [],
  roles: [
    {
      id: 1,
      name: 'Admin',
    },
    {
      id: 2,
      name: 'User',
    },
  ],
};
