import { Blog, Role, User } from "./mock.type";

//  password for: 'adminpass'
const hashedPassword = '$2b$10$hhcRKn4sZFr9j8jPq6jq4e4FyHgWX06gL2aPybQOgtD7r2ipS8PY6';

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
      password: hashedPassword,
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
