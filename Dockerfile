FROM node:18-alpine as builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Prisma generate
COPY prisma ./prisma
RUN npx prisma generate

# Build NestJS
RUN npm run build


# === FINAL IMAGE ===
FROM node:18-alpine

WORKDIR /app

# Install only prod dependencies (bcrypt gets installed here)
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled files and Prisma stuff
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/start.sh ./

# Make startup script executable
RUN chmod +x start.sh

CMD ["./start.sh"]
