import Fastify from 'fastify';
import { userRoutes } from '../src/routes/v1/users';
import { prisma } from '../src/prisma/client';
import jwtPlugin from '../src/plugins/jwt';

const build = () => {
    const app = Fastify();
    app.register(jwtPlugin);
    app.register(userRoutes);
    return app;
};

describe('User Routes', () => {
    let app: ReturnType<typeof build>;
    let userId: number;

    beforeAll(async () => {
        app = build();
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    afterEach(async () => {
        // Clean up users after each test
        await prisma.user.deleteMany({
            where: {
                email: { contains: 'example-jest.com' } // or another test-only pattern
            }
        });
    });

    it('should create a user', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/users',
            payload: { name: 'Test User', email: 'test@example-jest.com' },
        });
        expect(response.statusCode).toBe(201);
        const body = JSON.parse(response.body);
        expect(body).toHaveProperty('id');
        expect(body.name).toBe('Test User');
        expect(body.email).toBe('test@example-jest.com');
        userId = body.id;
    });

    it('should get all users', async () => {
        await prisma.user.create({ data: { name: 'User1', email: 'user1@example-jest.com' } });
        const response = await app.inject({
            method: 'GET',
            url: '/users',
        });
        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);
    });



    it('should get a single user', async () => {
        const user = await prisma.user.create({ data: { name: 'User2', email: 'user2@example-jest.com' } });
        const response = await app.inject({
            method: 'GET',
            url: `/users/${user.id}`,
        });
        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);
        expect(body).toHaveProperty('id', user.id);
        expect(body.name).toBe('User2');
    });

    it('should return 404 for non-existing user', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/users/999999', // Assuming this ID does not exist
        });
        expect(response.statusCode).toBe(404);
        const body = JSON.parse(response.body);
        expect(body.message).toBe('User not found');
    });

    it('should return 400 for invalid user ID', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/users/invalid-format', // Invalid ID format
        });
        expect(response.statusCode).toBe(400);
        const body = JSON.parse(response.body);
        expect(body.message).toBe('Invalid user id');
        expect(body.errors).toBeDefined();
    }
    );

    it('should update a user', async () => {
        const user = await prisma.user.create({ data: { name: 'User3', email: 'user3@example-jest.com' } });
        const response = await app.inject({
            method: 'PUT',
            url: `/users/${user.id}`,
            payload: { name: 'Updated User3' },
        });
        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);
        expect(body.name).toBe('Updated User3');
    });

    it('should delete a user', async () => {
        const user = await prisma.user.create({ data: { name: 'User4', email: 'user4@example-jest.com' } });
        const response = await app.inject({
            method: 'DELETE',
            url: `/users/${user.id}`,
        });
        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);
        expect(body).toHaveProperty('id', user.id);
    });

    it('should get paginated users', async () => {
        // Seed some users for pagination
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
            url: '/users-paginated?start=0&length=2',
        });

        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);

        expect(body).toHaveProperty('data');
        expect(Array.isArray(body.data)).toBe(true);
        expect(body.data.length).toBeLessThanOrEqual(2);

        expect(body).toHaveProperty('recordsTotal');
        expect(body).toHaveProperty('recordsFiltered');
        expect(body.recordsTotal).toBeGreaterThanOrEqual(3);
        expect(body.recordsFiltered).toBeGreaterThanOrEqual(3);
    });

});