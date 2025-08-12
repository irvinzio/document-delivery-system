# Dockerfile for Secure Document Delivery System
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_ENV=production
EXPOSE 3000
RUN npm run build
CMD ["npm", "run", "start"]