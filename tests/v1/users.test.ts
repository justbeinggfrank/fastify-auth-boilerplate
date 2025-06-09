import { app } from '../../src/index';
import { prisma } from '../../src/prisma/client';

const adminToken = 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDk0NjI2NjJ9.jxOptr0RFNH86ofzR2bns21XMj_8ZDr-V3DLHFUm_1s';
const userToken = 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTc0LCJlbWFpbCI6ImZyYW5rbGlubWFuY2FvQGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ5NDYxODkxfQ.Q0jsZrzjYB3sXXG6Bebs23xLkBLgIkzGsb_yJ9IV08g';
const superadminToken = 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzdXBlcmFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzQ5NDEyNTE4fQ.1Es0e16XI6jVlDLDM9u05WSBjBwGwBQSUApff4GoiX4';

describe('User Routes with RBAC', () => {
    let userId: number;

    afterEach(async () => {
        // Clean up users after each test
        await prisma.user.deleteMany({
            where: {
                email: { contains: 'example-jest.com' }
            }
        });
    });

    afterAll(async () => {
        await app.close();
        await prisma.$disconnect();
    });

    it('superadmin should create a user', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/api/v1/users',
            payload: { name: 'Test User 0', email: 'test0@xample-jest.com' },
            headers: { authorization: superadminToken },
        });
        expect(response.statusCode).toBe(201);
        const body = JSON.parse(response.body);
        expect(body).toHaveProperty('id');
        expect(body.name).toBe('Test User 0');
        expect(body.email).toBe('test0@xample-jest.com');
    });

    it('admin should NOT create a user', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/api/v1/users',
            payload: { name: 'Test User', email: 'test@example-jest.com' },
            headers: { authorization: adminToken },
        });
        expect(response.statusCode).toBe(403);
    });

    it('user should NOT create a user', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/api/v1/users',
            payload: { name: 'Test User', email: 'test2@example-jest.com' },
            headers: { authorization: userToken },
        });
        expect(response.statusCode).toBe(403);
    });

    it('should get all users (admin)', async () => {
        await prisma.user.create({ data: { name: 'User1', email: 'user1@example-jest.com' } });
        const response = await app.inject({
            method: 'GET',
            url: '/api/v1/users',
            headers: { authorization: adminToken },
        });
        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);
    });

    it('should get a single user (user)', async () => {
        const user = await prisma.user.create({ data: { name: 'User2', email: 'user2@example-jest.com' } });
        const response = await app.inject({
            method: 'GET',
            url: `/api/v1/users/${user.id}`,
            headers: { authorization: userToken },
        });
        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);
        expect(body).toHaveProperty('id', user.id);
        expect(body.name).toBe('User2');
    });

    it('should return 404 for non-existing user (admin)', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/api/v1/users/999999',
            headers: { authorization: adminToken },
        });
        expect(response.statusCode).toBe(404);
        const body = JSON.parse(response.body);
        expect(body.message).toBe('User not found');
    });

    it('should return 400 for invalid user ID (admin)', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/api/v1/users/invalid-format',
            headers: { authorization: adminToken },
        });
        expect(response.statusCode).toBe(400);
        const body = JSON.parse(response.body);
        expect(body.message).toBe('Invalid user id');
        expect(body.errors).toBeDefined();
    });

    it('admin should NOT update a user', async () => {
        const user = await prisma.user.create({ data: { name: 'User3', email: 'user3@example-jest.com' } });
        const response = await app.inject({
            method: 'PUT',
            url: `/api/v1/users/${user.id}`,
            payload: { name: 'Updated User3' },
            headers: { authorization: adminToken },
        });
        expect(response.statusCode).toBe(403);
    });

    it('user should NOT update another user', async () => {
        const user = await prisma.user.create({ data: { name: 'User4', email: 'user4@example-jest.com' } });
        const response = await app.inject({
            method: 'PUT',
            url: `/api/v1/users/${user.id}`,
            payload: { name: 'Updated User4' },
            headers: { authorization: userToken },
        });
        expect(response.statusCode).toBe(403);
    });

    it('superadmin should delete a user', async () => {
        const user = await prisma.user.create({ data: { name: 'User5', email: 'user5@example-jest.com' } });
        const response = await app.inject({
            method: 'DELETE',
            url: `/api/v1/users/${user.id}`,
            headers: { authorization: superadminToken },
        });
        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);
        expect(body).toHaveProperty('id', user.id);
    });

    it('admin should NOT delete a user', async () => {
        const user = await prisma.user.create({ data: { name: 'User6', email: 'user6@example-jest.com' } });
        const response = await app.inject({
            method: 'DELETE',
            url: `/api/v1/users/${user.id}`,
            headers: { authorization: adminToken },
        });
        expect(response.statusCode).toBe(403);
    });

    it('should get paginated users (admin)', async () => {
        await prisma.user.createMany({
            data: [
                { name: 'Paginate User 1', email: 'paginate1@example-jest.com' },
                { name: 'Paginate User 2', email: 'paginate2@example-jest.com' },
                { name: 'Paginate User 3', email: 'paginate3@example-jest.com' },
            ],
            skipDuplicates: true,
        });

        const response = await app.inject({
            method: 'GET',
            url: '/api/v1/users-paginated?skip=0&take=2&orderBy=name&orderDir=asc',
            headers: { authorization: adminToken },
        });

        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);

        expect(body).toHaveProperty('data');
        expect(Array.isArray(body.data)).toBe(true);
        expect(body.data.length).toBeLessThanOrEqual(2);

        expect(body).toHaveProperty('total');
        expect(typeof body.total).toBe('number');
        expect(body.total).toBeGreaterThanOrEqual(3);

        // Check ordering is ascending by name
        if (body.data.length === 2) {
            expect(body.data[0].name <= body.data[1].name).toBe(true);
        }
    });
});