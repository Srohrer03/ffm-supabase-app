# Facilities Management Auth & Users Backend

A complete NestJS + Prisma backend module for authentication and user management with Azure AD integration.

## Features

- **Azure AD OAuth 2.0 Authentication**
- **Role-based Authorization** (ADMIN, FM, TECH, VENDOR, VIEWER)
- **Site-scoped Permissions**
- **Comprehensive Audit Logging**
- **JWT Token Management**
- **Swagger API Documentation**

## Quick Start

### 1. Environment Setup

Copy the environment file and configure your settings:

```bash
cp .env.example .env
```

Update `.env` with your Azure AD and database configuration:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/facilities_db?schema=public"
AZURE_TENANT_ID="your-tenant-id"
AZURE_CLIENT_ID="your-client-id"
AZURE_CLIENT_SECRET="your-client-secret"
AZURE_REDIRECT_URI="http://localhost:3001/api/auth/callback"
JWT_SECRET="your-super-secret-jwt-key"
```

### 2. Database Setup

```bash
# Install dependencies
npm install

# Push database schema
npm run db:push

# Seed initial roles
npm run db:seed
```

### 3. Start Development Server

```bash
npm run dev:server
```

The server will start on `http://localhost:3001`

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3001/api/docs

## API Endpoints

### Authentication
- `GET /api/auth/login` - Initiate Azure AD login
- `GET /api/auth/callback` - Handle Azure AD callback
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get current user profile

### Users (ADMIN only)
- `GET /api/users` - List all users with roles
- `POST /api/users/:id/roles` - Assign role to user

### Roles
- `GET /api/roles` - List all available roles

### Audit (ADMIN only)
- `GET /api/audit/logs` - Get audit logs with pagination

## Database Models

### User
- `id`, `name`, `email`, `azureAdId`, `createdAt`, `updatedAt`

### Role
- `id`, `name` (ADMIN, FM, TECH, VENDOR, VIEWER), `createdAt`, `updatedAt`

### UserRoleAssignment
- `userId`, `roleId`, `siteId` (nullable for site-scoped permissions), `createdAt`

### AuditLog
- `id`, `userId`, `action`, `entity`, `entityId`, `timestamp`

## Role Hierarchy

- **ADMIN**: Full system access
- **FM**: Facility Manager - site management
- **TECH**: Technician - work order execution
- **VENDOR**: External vendor access
- **VIEWER**: Read-only access

## Security Features

- **JWT tokens expire in 1 hour**
- **Role-based route protection**
- **Site-scoped permissions**
- **Comprehensive audit logging**
- **Azure AD integration**

## Development Commands

```bash
# Start development server
npm run dev:server

# Database operations
npm run db:push      # Push schema changes
npm run db:seed      # Seed initial data
npm run db:studio    # Open Prisma Studio

# Build and production
npm run build        # Build for production
npm run start:prod   # Start production server
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `AZURE_TENANT_ID` | Azure AD tenant ID | Yes |
| `AZURE_CLIENT_ID` | Azure AD application ID | Yes |
| `AZURE_CLIENT_SECRET` | Azure AD client secret | Yes |
| `AZURE_REDIRECT_URI` | OAuth callback URL | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `PORT` | Server port (default: 3001) | No |

## Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure production database
3. Set secure JWT secret
4. Configure Azure AD for production domain
5. Build and start: `npm run build && npm run start:prod`