import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data (optional)
  await prisma.blog.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  // Create Roles
  const adminRole = await prisma.role.create({
    data: {
      name: 'Admin',
    },
  });

  const userRole = await prisma.role.create({
    data: {
      name: 'User',
    },
  });

  // Hashed passwords
  const password1 = await bcrypt.hash('admin123', 10);
  const password2 = await bcrypt.hash('user123', 10);

  // Create Users
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin One',
      email: 'admin@example.com',
      password: password1,
      roleId: adminRole.id,
      isVerified: true,
      isDeleted: false,
    },
  });

  const regularUser = await prisma.user.create({
    data: {
      name: 'Regular User',
      email: 'user@example.com',
      password: password2,
      roleId: userRole.id,
      isVerified: true,
      isDeleted: false,
    },
  });

  // Create Blogs
  await prisma.blog.createMany({
    data: [
      {
        title: 'First Blog Post',
        content: 'This is the content for the first blog.',
        userId: adminUser.id, // Link to Admin User
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Second Blog Post',
        content: 'This is the content for the second blog.',
        userId: regularUser.id, // Link to Regular User
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  });

  console.log('Seed completed with users, roles, and blogs.');
}

main()
  .catch((e) => {
    console.error('Error while seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });