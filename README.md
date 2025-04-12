# JKTech Backend Documentation

## Overview

The JKTech Backend is a server-side application built using the [NestJS](https://nestjs.com/) framework. It provides APIs for user authentication, blog management, and role-based access control.

---

## Features

- User authentication (JWT, Google, Facebook)
- Role-based access control (Admin, User)
- Blog management (CRUD operations)
- Swagger API documentation
- Prisma ORM integration with PostgreSQL
- Unit and E2E testing with Jest
- Environment configuration using `.env`

---

## Project Structure

```
.
├── src/
│   ├── app.module.ts          # Main application module
│   ├── main.ts                # Application entry point
│   ├── modules/
│   │   ├── auth/              # Authentication module
│   │   ├── blog/              # Blog module
│   │   └── users/             # User management module
│   ├── prisma/                # Prisma service and schema
│   ├── common/                # Shared utilities and constants
│   └── configurations/        # Application configurations
├── prisma/
│   ├── schema.prisma          # Prisma schema
│   ├── seed.ts                # Database seeding script
├── test/                      # E2E tests
├── package.json               # Project dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── .env                       # Environment variables
└── README.md                  # Project documentation
```

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/jktech-backend.git
   cd jktech-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the environment variables:

   Create a `.env` file in the root directory and configure the following variables:

   ```env
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=your_google_callback_url
   FACEBOOK_CLIENT_ID=your_facebook_client_id
   FACEBOOK_APP_SECRET=your_facebook_app_secret
   FACEBOOK_CALLBACK_URL=your_facebook_callback_url
   ```

4. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

5. Seed the database:

   ```bash
   npm run prisma:seed
   ```

---

## Running the Application

### Development

```bash
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
```

---

## API Documentation

The API documentation is available at `/api` when the application is running. It is powered by Swagger.

---

## Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

---

## Deployment

To deploy the application, follow these steps:

1. Build the project:

   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your server.

3. Set up the environment variables on the server.

4. Start the application:

   ```bash
   npm run start:prod
   ```

---

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push them to your fork.
4. Submit a pull request.

---

## License

This project is licensed under the MIT License.