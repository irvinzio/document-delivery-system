This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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
   Open [http://localhost:3000/login](http://localhost:3000/login) in your browser.

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
