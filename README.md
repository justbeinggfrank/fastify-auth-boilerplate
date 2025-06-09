# Fastify Auth Boilerplate

A boilerplate backend app using **Fastify**, **TypeScript**, **MySQL**, **Prisma**, **JWT**, **Zod**, and **Nodemailer** — with live reload (Nodemon), security (Helmet, rate limiting), and testing (Jest).

---

## 📦 Dependencies

### Runtime
- [fastify](https://github.com/fastify/fastify)
- [@fastify/helmet](https://github.com/fastify/fastify-helmet)
- [@fastify/rate-limit](https://github.com/fastify/fastify-rate-limit)
- [fastify-qs](https://github.com/vanodevium/fastify-qs)
- [fastify-jwt](https://github.com/fastify/fastify-jwt)
- [prisma](https://github.com/prisma/prisma)
- [@prisma/client](https://github.com/prisma/prisma)
- [mysql2](https://github.com/sidorares/node-mysql2)
- [nodemailer](https://github.com/nodemailer/nodemailer)
- [argon2](https://github.com/ranisalt/node-argon2)
- [dotenv](https://github.com/motdotla/dotenv)
- [@fastify/cors](https://github.com/fastify/fastify-cors)

### Validation
- [zod](https://github.com/colinhacks/zod)

### Role-Based Access Control (RBAC)
- [@casl/ability](https://casl.js.org/)

### Development
- [nodemon](https://nodemon.io/)
- [typescript](https://www.typescriptlang.org/)
- [ts-node](https://typestrong.org/ts-node/)
- [@types/node](https://www.npmjs.com/package/@types/node)

### Testing
- [jest](https://jestjs.io/)
- [ts-jest](https://kulshekhar.github.io/ts-jest/)
- [@types/jest](https://www.npmjs.com/package/@types/jest)

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
- Log file that can be used for monitoring (app.log)
- Limit on Payload Size
- Centralized Error Handling
- Input Validation & Sanitization
- Pagination for List Endpoints
- Simple Role-Based Access Control

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
  v1/
```

---

## 🔨 Todo
- Monitoring: use Datadog
- RBAC using db
- Queing for mail

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