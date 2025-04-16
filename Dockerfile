# 1. Use the Node.js LTS Alpine image
FROM node:18-alpine

# 2. Set working directory in the container
WORKDIR /app

# 3. Copy package.json and package-lock.json
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the project files (including Prisma)
COPY . .

# 6. Generate Prisma client (required before build) 

RUN npx prisma generate

# 7. Build the NestJS project
RUN npm run build

# 8. Copy and prepare start script (optional but good for Docker startup)
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# 9. Expose the port your app runs on
EXPOSE 3000

# 10. Run the start script to start app and migrations
CMD ["./start.sh"]
