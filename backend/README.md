# UniSticker Backend

Laravel backend API for the UTM Vehicle Sticker Application System.

## Features

- RESTful API endpoints for vehicle sticker applications
- Google OAuth authentication
- Database management for user and application data
- Secure file storage for documents
- API integration with frontend

## Prerequisites

- PHP 8.1 or higher
- Composer
- MySQL/MariaDB
- Google OAuth credentials
- SQLite (for testing)

## Setup

1. Install dependencies:
```bash
composer install
```

2. Configure environment:
- Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
- Generate application key:
```bash
php artisan key:generate
```

3. Configure database:
- Update database credentials in `.env`
- Run migrations:
```bash
php artisan migrate
```
- (Optional) Seed database:
```bash
php artisan db:seed
```

4. Configure Google OAuth:
- Add credentials to `.env`:
  ```
  GOOGLE_CLIENT_ID=your_client_id
  GOOGLE_CLIENT_SECRET=your_client_secret
  GOOGLE_REDIRECT_URI="${APP_URL}/api/auth/google/callback"
  ```

5. Configure frontend URL:
```
SANCTUM_STATEFUL_DOMAINS=localhost:3000
FRONTEND_URL=http://localhost:3000
```

6. Start development server:
```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| APP_NAME | Application name | Laravel |
| APP_ENV | Environment | local |
| APP_KEY | Application key | Generated |
| DB_CONNECTION | Database type | sqlite |
| GOOGLE_CLIENT_ID | Google OAuth client ID | - |
| GOOGLE_CLIENT_SECRET | Google OAuth client secret | - |
| FRONTEND_URL | Frontend application URL | http://localhost:3000 |

## API Endpoints

### Authentication
- `GET /api/auth/check`: Check authentication status
- `POST /api/auth/login`: Login with credentials
- `POST /api/auth/register`: Register new user
- `POST /api/auth/logout`: Logout user
- `GET /api/auth/google`: Initiate Google OAuth
- `GET /api/auth/google/callback`: Google OAuth callback
- `POST /api/auth/forgot-password`: Request password reset
- `POST /api/auth/reset-password`: Reset password
- `GET /api/auth/user`: Get current user info

### Admin
- `GET /api/admin/auth/check`: Check admin status
- `POST /api/admin/auth/login`: Admin login
- `POST /api/admin/auth/logout`: Admin logout

### Sticker Applications
- `GET /api/sticker-applications`: List all applications
- `POST /api/sticker-applications`: Submit new application
- `GET /api/sticker-applications/{id}`: Get specific application

### Vehicle Information
- `GET /api/vehicle-brand-models`: Get list of vehicle brands and models

### Documents
- `GET /api/documents/{document}`: View specific document

## Testing

Run tests with:
```bash
php artisan test
```

For specific test suite:
```bash
php artisan test --testsuite=Feature
```

## Commands

- `php artisan serve`: Start development server
- `php artisan migrate`: Run database migrations
- `php artisan db:seed`: Seed database
- `php artisan route:list`: List all routes
- `php artisan cache:clear`: Clear application cache

## Contributing

1. Follow Laravel coding standards
2. Write tests for new features
3. Update documentation as needed
4. Use feature branches for changes

## Related Services

- Frontend: Next.js application at `http://localhost:3000`
- Chat Service: Python WebSocket at `ws://localhost:8080`
