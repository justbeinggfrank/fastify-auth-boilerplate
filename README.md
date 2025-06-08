# Fastify TypeScript MySQL Prisma Nodemailer Boilerplate
This is a boilerplate setup for a backend app using **Fastify**, **TypeScript**, **MySQL**, **Nodemailer** and **Prisma** — complete with live reload (Nodemon) and testing (Jest).

## 📦 Dependencies

### Runtime
fastify
nodemailer

### Development
nodemon
typescript
ts-node
@types/node
dotenv

### Testing
jest
ts-jest
@types/jest

### Logging 
pino-pretty

## 🚀 Scripts
npm run dev     # Start dev server with ts-node + nodemon
npm run build   # Compile TypeScript to JS
npm start       # Run compiled JS
npm test        # Run tests using Jest

## Quickscripts
npx prisma migrate dev --name describe_migration_file  # Create a migration file
npx prisma migrate dev                                 # Run migration
npx prisma generate                                    # Run after prisma commands