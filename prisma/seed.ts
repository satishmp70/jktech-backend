import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data (respecting relations)
  await prisma.blog.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  // Create roles
  const adminRole = await prisma.role.create({
    data: { name: 'Admin' },
  });

  const userRole = await prisma.role.create({
    data: { name: 'User' },
  });

  // Hash passwords
  const adminPassword = await bcrypt.hash('secureadminpass', 10);
  const userPassword = await bcrypt.hash('secureuserpass', 10);

  // Create Admin user
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      roleId: adminRole.id,
      avatar: 'https://i.pravatar.cc/150?img=1',
      isVerified: true,
    },
  });

  // Create Regular user
  const user = await prisma.user.create({
    data: {
      name: 'Regular User',
      email: 'user@example.com',
      password: userPassword,
      roleId: userRole.id,
      avatar: 'https://i.pravatar.cc/150?img=2',
      isVerified: true,
    },
  });

  // Create blogs
  await prisma.blog.create({
    data: {
      title: 'Admin Blog Post',
      content: 'This is an admin blog post.',
      userId: admin.id,
    },
  });

  await prisma.blog.create({
    data: {
      title: 'User Blog Post',
      content: 'This is a user blog post.',
      userId: user.id,
    },
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
