# UniSticker 🎯

UniSticker is a web application designed to modernize the vehicle sticker application process at Universiti Teknologi Malaysia (UTM). This system serves as an upgrade to the existing digital platform, introducing enhanced features and improved user experience. The application streamlines the entire process of applying for and managing campus vehicle stickers, offering students and staff a more efficient and user-friendly interface. With features like real-time application tracking, digital document management, and seamless administrative workflows, UniSticker represents the next generation of campus vehicle management systems.

## Tech Stack 🛠️

### Frontend
- Next.js (React Framework)
- TypeScript
- TailwindCSS
- Axios for API calls

### Backend
- Laravel 10
- PHP 8.2
- Apache Web Server
- MySQL 8.0

## Prerequisites 📋

Before you begin, ensure you have the following installed:
- Docker and Docker Compose
- Git
- Node.js and npm (for local development)
- Composer (for local development)

## Installation Steps 🚀

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/unisticker.git
cd unisticker
```

### 2. Environment Setup

#### Frontend Setup
```bash
cd frontend
cp .env.example .env.local
```

Update the `.env.local` file with your configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

#### Backend Setup
```bash
cd backend
cp .env.example .env
```

Update the `.env` file with your configuration:
```env
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=laravel_user
DB_PASSWORD=your_password
```

### 3. Docker Setup and Installation

From the root directory of the project:

```bash
# Build and start the containers
docker-compose up --build -d

# Install backend dependencies
docker-compose exec backend composer install

# Generate application key
docker-compose exec backend php artisan key:generate

# Run database migrations
docker-compose exec backend php artisan migrate

# Install frontend dependencies
docker-compose exec frontend npm install
```

### 4. Accessing the Application

After the installation is complete, you can access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- Database: localhost:3306

## Development 👩‍💻👨‍💻

### Running Tests
```bash
# Backend tests
docker-compose exec backend php artisan test

# Frontend tests
docker-compose exec frontend npm test
```

### Common Commands

```bash
# Start the containers
docker-compose up -d

# Stop the containers
docker-compose down

# View logs
docker-compose logs -f

# Access container shells
docker-compose exec frontend sh
docker-compose exec backend bash
docker-compose exec db mysql -u laravel_user -p
```

## Project Structure 📁

```
unisticker/
├── frontend/                # Next.js frontend application
│   ├── src/
│   ├── public/
│   └── ...
├── backend/                 # Laravel backend application
│   ├── app/
│   ├── database/
│   ├── routes/
│   └── ...
└── docker-compose.yml      # Docker composition file
```

## Support 💬

If you have any questions or issues, please contact oldpistol@gmail.com.

---

Made with ❤️ by [Muhammad Hafiz Bin Mohd Zainal Abidin]