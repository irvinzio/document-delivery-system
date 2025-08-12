This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Secure Document Delivery System

A secure internal tool for employees to share encrypted, access-controlled documents.

## Features
- JWT/session-based authentication (NextAuth.js)
- Document upload with AES encryption
- Assign documents to recipients
- View limit and expiration
- Access control: only sender/recipient can view
- Document list, view, and download

## Local Deployment Instructions

### Prerequisites
- Node.js and npm installed
- PostgreSQL running locally (default port: 5432)

### Setup Steps
1. **Clone the repository** (if not already in your workspace)
2. **Install dependencies**  
   `npm install`
3. **Configure environment variables**  
   Edit `.env` with your PostgreSQL credentials:
   ```
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/document_delivery"
   NEXTAUTH_SECRET="your_super_secret_key"
   NEXTAUTH_URL="http://localhost:3000"
   ```
4. **Run database migrations**  
   `npx prisma migrate dev --name init`
5. **Seed the database with users**  
   `npx ts-node prisma/seed.ts`
6. **Start the development server**  
   `npm run dev`
7. **Access the app**  
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Setup

1. Build and start the containers:
   ```
   docker-compose up --build
   ```
2. The app will be available at [http://localhost:3000](http://localhost:3000)
3. The PostgreSQL database will run in a separate container.
4. To run migrations and seed users, open a shell in the app container:
   ```
   docker-compose exec app sh
   npx prisma migrate dev --name init
   npx ts-node prisma/seed.ts
   ```

## Security Notes
- Documents are encrypted at rest using AES-256.
- Only sender and recipient can access documents.
- Documents are deleted after expiration or max views.
- Passwords are hashed with bcrypt.

## Seed Users
- alice@example.com / password123
- bob@example.com / password123
- carol@example.com / password123

---
For questions or issues, contact the project maintainer.
