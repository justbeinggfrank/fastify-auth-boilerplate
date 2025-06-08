# Fastify TypeScript MySQL Prisma Nodemailer Boilerplate

A boilerplate backend app using **Fastify**, **TypeScript**, **MySQL**, **Prisma**, and **Nodemailer** — with live reload (Nodemon), security (Helmet, rate limiting), and testing (Jest).

---

## 📦 Dependencies

### Runtime
- [fastify](https://www.fastify.io/)
- [@fastify/helmet](https://github.com/fastify/fastify-helmet)
- [@fastify/rate-limit](https://github.com/fastify/fastify-rate-limit)
- [fastify-qs](https://github.com/fastify/fastify-qs)
- [@prisma/client](https://www.prisma.io/)
- [prisma](https://www.prisma.io/)
- [mysql2](https://github.com/sidorares/node-mysql2)
- [nodemailer](https://nodemailer.com/about/)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [dotenv](https://github.com/motdotla/dotenv)

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

## 🛠️ Quickscripts

```bash
npx prisma migrate dev --name <migration_name>  # Create a migration file
npx prisma migrate dev                          # Run migration
npx prisma generate                             # Generate Prisma client
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

## 📄 License

MIT