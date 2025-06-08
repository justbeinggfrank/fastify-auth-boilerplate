# Fastify TypeScript MySQL Prisma Nodemailer Boilerplate

A boilerplate backend app using **Fastify**, **TypeScript**, **MySQL**, **Prisma**, and **Nodemailer** — with live reload (Nodemon), security (Helmet, rate limiting), and testing (Jest).

---

## 📦 Dependencies

### Runtime
- [fastify](https://github.com/fastify/fastify)
- [@fastify/helmet](https://github.com/fastify/fastify-helmet)
- [@fastify/rate-limit](https://github.com/fastify/fastify-rate-limit)
- [fastify-qs](https://github.com/vanodevium/fastify-qs)
- [prisma](https://github.com/prisma/prisma)
- [@prisma/client](https://github.com/prisma/prisma)
- [mysql2](https://github.com/sidorares/node-mysql2)
- [nodemailer](https://github.com/nodemailer/nodemailer)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [dotenv](https://github.com/motdotla/dotenv)
- [@fastify/cors](https://github.com/fastify/fastify-cors)

### Development
- [nodemon](https://nodemon.io/)
- [typescript](https://www.typescriptlang.org/)
- [ts-node](https://typestrong.org/ts-node/)
- [@types/node](https://www.npmjs.com/package/@types/node)

### Testing
- [jest](https://jestjs.io/)
- [ts-jest](https://kulshekhar.github.io/ts-jest/)
- [@types/jest](https://www.npmjs.com/package/@types/jest)

### Logging
- [pino-pretty](https://github.com/pinojs/pino-pretty)

---

## 🚀 Scripts

```bash
npm run dev        # Start dev server with ts-node + nodemon
npm run build      # Compile TypeScript to JS
npm start          # Run compiled JS
npm test           # Run tests using Jest
npm run lint       # Run ESLint on source files
npm run lint:fix   # Run ESLint and auto-fix problems
npm run format     # Format code using Prettier
```

---

## 🛡️ Features

- API versioning structure
- Security headers via Helmet
- Rate limiting for abuse protection
- JWT authentication
- Nodemailer for email sending (Gmail SMTP ready)
- Prisma ORM for MySQL
- Jest for testing
- Environment variable support with dotenv
- CORS to control which domains can access API

---

## 📁 Project Structure

```
src/
  routes/
    v1/
      users.ts
      auth.ts
  controllers/
  services/
  middleware/
  plugins/
  prisma/
  utils/
  index.ts
tests/
  users.test.ts
```

---

## 🔨 Todo

- Input Validation & Sanitization: Validate and sanitize all incoming data (query, body, params) to prevent injection attacks and bad data.
- Centralized Error Handling: Use a global error handler to catch and format errors consistently.
- Logging & Monitoring: Log important events and errors
- Pagination for List Endpoints: Paginate endpoints that return lists to avoid performance issues.
- Security Headers: Use headers like Content-Security-Policy, X-Content-Type-Options, etc. (Helmet helps with this).
- Limit Payload Size: Restrict the size of incoming requests to prevent abuse.
- Database Security: Use parameterized queries/ORMs, least-privilege DB users, and never expose raw errors.

---

## ⚡ Other Scripts

```bash
npx prisma migrate dev --name <migration_name>  # Create a migration file
npx prisma migrate dev                          # Run migration
npx prisma generate                             # Generate Prisma client
```

---

## 📄 License

MIT