import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@vivahbandhan.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123456';
  const name = process.env.ADMIN_NAME || 'Admin';

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    // Update to admin role if not already
    if (existingAdmin.role !== 'admin') {
      await prisma.user.update({
        where: { email },
        data: { role: 'admin' },
      });
      console.log(`✅ Updated user ${email} to admin role`);
    } else {
      console.log(`✅ Admin user ${email} already exists`);
    }
    return;
  }

  // Create new admin user
  const passwordHash = await argon2.hash(password);

  const admin = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: 'admin',
      emailVerified: true,
      isActive: true,
      profile: {
        create: {
          name,
          gender: 'other',
          dateOfBirth: new Date('1990-01-01'),
        },
      },
    },
    include: {
      profile: true,
    },
  });

  console.log(`✅ Created admin user:`);
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);
  console.log(`   Please change the password after first login!`);
}

main()
  .catch((e) => {
    console.error('Error creating admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });