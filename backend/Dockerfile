FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 3000

# Use the start script from package.json
CMD ["npm", "start"]
