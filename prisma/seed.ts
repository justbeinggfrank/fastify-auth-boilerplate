import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
    const superAdminPassword = await argon2.hash('superadmin@gmail.com');
    const adminPassword = await argon2.hash('admin@gmail.com');
    const userPassword = await argon2.hash('user@gmail.com');

    await prisma.user.createMany({
        data: [
            {
                name: 'Super Admin User',
                email: 'superadmin@gmail.com',
                role: 'superadmin',
                password: superAdminPassword
            },
            {
                name: 'Admin User',
                email: 'admin@gmail.com',
                role: 'admin',
                password: adminPassword
            },
            {
                name: 'Regular User',
                email: 'user@gmail.com',
                role: 'user',
                password: userPassword
            },
        ],
        skipDuplicates: true, // avoids errors if emails already exist
    });
}

main()
    .then(() => {
        console.log('🌱 Seeding complete');
        return prisma.$disconnect();
    })
    .catch((e) => {
        console.error(e);
        return prisma.$disconnect().finally(() => process.exit(1));
    });
