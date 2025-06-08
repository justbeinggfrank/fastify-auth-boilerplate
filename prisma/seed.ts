import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const superAdminPassword = await bcrypt.hash('superadmin@gmail.com', 10);
    const adminPassword = await bcrypt.hash('admin@gmail.com', 10);
    const userPassword = await bcrypt.hash('user@gmail.com', 10);

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
