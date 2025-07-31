# JWT Authentication Implementation

This document describes the JWT authentication system implemented for the URL shortener.

## Backend Implementation

### JWT Middleware
- **File**: `apps/api/middleware/auth.go`
- **Functions**: 
  - `JWTAuth()` - Required authentication middleware
  - `OptionalJWTAuth()` - Optional authentication middleware (for backward compatibility)
  - `GetUserID(c *gin.Context)` - Helper to extract user ID from context
  - `GetUserEmail(c *gin.Context)` - Helper to extract user email from context

### Authentication Endpoints
- **POST /api/auth/register** - User registration
- **POST /api/auth/login** - User login
- **GET /api/auth/profile** - Get user profile (requires JWT)

### User-Specific Link Operations
- **POST /api/links** - Create link (optional JWT, associates with user if authenticated)
- **GET /api/links** - Get links (optional JWT, returns user-specific links if authenticated)

### JWT Token Structure
```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "exp": 1234567890,
  "iat": 1234567890,
  "nbf": 1234567890
}
```

## Frontend Implementation

### Authentication Context
- **File**: `apps/web/src/contexts/auth-context.tsx`
- **Provider**: `AuthProvider` - Manages authentication state
- **Hook**: `useAuth()` - Access authentication state and methods

### API Integration
- **File**: `apps/web/src/lib/api.ts`
- **Token Management**: Local storage based JWT token management
- **Auto-headers**: Automatically includes JWT token in API requests

### Authentication Components
- **AuthForm**: Combined login/register form with tabs
- **UserProfile**: User profile display with logout functionality
- **Login/Register Forms**: Individual authentication forms

## Environment Configuration

### Backend (.env)
```bash
# Required
SUPABASE_DB_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-here

# Optional
PORT=8080
BASE_URL=http://localhost:8080
GIN_MODE=debug
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Database Schema

The existing `users` and `links` tables support the JWT authentication:

```sql
-- Users table (already exists)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Links table with user relationship (already exists)
CREATE TABLE links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    slug TEXT UNIQUE NOT NULL,
    original TEXT NOT NULL,
    clicks INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    last_updated TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    active_from TIMESTAMP,
    password TEXT,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE  -- NULL for anonymous links
);
```

## Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### Create authenticated link
```bash
curl -X POST http://localhost:8080/api/links \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"url": "https://example.com", "name": "My Link"}'
```

### Get user's links
```bash
curl -X GET http://localhost:8080/api/links \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Security Features

1. **Password Hashing**: bcrypt with default cost
2. **JWT Expiration**: 24-hour token expiration
3. **CORS Protection**: Configured for local development
4. **Input Validation**: Email and password validation
5. **SQL Injection Protection**: Parameterized queries
6. **Error Handling**: Secure error messages without sensitive data exposure

## Backward Compatibility

The system maintains backward compatibility:
- Anonymous links are still supported (user_id = NULL)
- Optional JWT middleware allows both authenticated and anonymous usage
- Existing anonymous links remain accessible
- Frontend works for both authenticated and anonymous users