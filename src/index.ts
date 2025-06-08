import Fastify, { FastifyInstance } from 'fastify';
import { userRoutes } from './routes/v1/users';
import jwtPlugin from './plugins/jwt';
import 'dotenv/config';
import { authRoutes } from './routes/v1/auth';
import fastifyQs from 'fastify-qs';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifyHelmet from '@fastify/helmet';

const app: FastifyInstance = Fastify({
  logger: {
    level: 'debug',
    // transport: {
    //   target: 'pino-pretty',
    //   options: {
    //     colorize: true,
    //   },
    // },
  },
});

// Register rate limiting plugin
app.register(fastifyRateLimit, {
  max: 100, // max requests
  timeWindow: '1 minute', // per minute
  allowList: ['127.0.0.1'], // optional: allow unlimited for localhost
});

app.register(jwtPlugin);
app.register(fastifyQs); // enables Fastify to parse nested query string parameters using the qs library
app.register(fastifyHelmet);
app.get('/', async () => {
  return { message: 'Welcome to the API' };
});

// Register routes with /api prefix
app.register(userRoutes, { prefix: '/api/v1' });
app.register(authRoutes, { prefix: '/api/v1' });

// Add custom error handler to remove 'code' from JWT errors
app.setErrorHandler((error, request, reply) => {
  if (error && error.code && error.code.startsWith('FST_JWT_')) {
    const { code, name, ...rest } = error;
    console.log(code, name);
    reply.status(error.statusCode || 401).send(rest);
  } else {
    reply.send(error);
  }
});

app.ready().then(() => {
  console.log(app.printRoutes());
});

const start = async (): Promise<void> => {
  try {
    await app.listen({ port: Number(process.env.SERVER_PORT) || 3000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
