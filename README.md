# UniSticker 🎯

UniSticker is a web application designed to modernize the vehicle sticker application process at Universiti Teknologi Malaysia (UTM). This system serves as an upgrade to the existing digital platform, introducing enhanced features and improved user experience. The application streamlines the entire process of applying for and managing campus vehicle stickers, offering students and staff a more efficient and user-friendly interface. With features like real-time application tracking, digital document management, and seamless administrative workflows, UniSticker represents the next generation of campus vehicle management systems.

## Tech Stack 🛠️

### Frontend
- Next.js (React Framework)
- TypeScript
- TailwindCSS
- Axios for API calls

### Backend
- Laravel 11
- PHP 8.2
- Apache Web Server
- MySQL 8.0

## Prerequisites 📋

Before you begin, ensure you have the following installed:
- PHP 8.2 or higher
- Composer
- Node.js (v18 or higher)
- npm
- MySQL 8.0
- Apache/Nginx web server
- Git

## Installation Steps 🚀

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/unisticker.git
cd unisticker
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install PHP dependencies
composer install

# Create environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure your database in .env file
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=unisticker
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# Start Laravel development server
php artisan serve
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Update API URL in .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Start development server
npm run dev
```

### 4. Accessing the Application

After the installation is complete, you can access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api

## Development 👩‍💻👨‍💻

### Running Tests

```bash
# Backend tests (in backend directory)
php artisan test

# Frontend tests (in frontend directory)
npm test
```

### Common Commands

#### Backend Commands
```bash
# Start Laravel server
php artisan serve

# Create new migration
php artisan make:migration create_table_name

# Run migrations
php artisan migrate

# Rollback migrations
php artisan migrate:rollback

# Create new controller
php artisan make:controller ControllerName
```

#### Frontend Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Project Structure 📁

```
unisticker/
├── frontend/                # Next.js frontend application
│   ├── src/
│   ├── public/
│   └── ...
└── backend/                 # Laravel backend application
    ├── app/
    ├── database/
    ├── routes/
    └── ...
```

## Support 💬

If you have any questions or issues, please contact oldpistol@gmail.com.

---

Made with ❤️ by:
- Muhammad Hafizuddin Shah Bin Abdul Rahman Shah
- Ismail bin Aman 
- Mohamad Fuaezzin Zaini
- Mohammed Satippiddin Safid b Hamzah
- Mohamad Azmi Bin Anduwar