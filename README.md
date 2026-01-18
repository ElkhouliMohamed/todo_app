# 🚀 Smart Task & Reminder App

**A modern productivity application built with Laravel 12, Inertia.js, and React**

[![Laravel](https://img.shields.io/badge/Laravel-12.0-FF2D20?style=flat&logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react)](https://reactjs.org)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-2.0-9553E9?style=flat)](https://inertiajs.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📖 Overview

**Smart Task & Reminder App** helps you organize daily work, manage recurring tasks, and receive intelligent reminders before deadlines. Built with modern technologies for a fast, clean, and professional user experience.

---

## ✨ Features

### 🗂 Task Management
- ✅ Create, edit, and delete tasks
- ✅ One-time and recurring tasks
- ✅ All-day or time-based tasks
- ✅ Task priorities and statuses
- ✅ Clean and intuitive interface

### 🔁 Advanced Recurring Tasks
- 📅 Daily, weekly, and monthly repeats
- 🔄 Custom intervals (every 3 days, every 2 weeks, etc.)
- 📆 Specific days (e.g., every Monday)
- ⏹️ End after X occurrences or on a specific date
- ⏭️ Skip single occurrences without breaking schedule
- 🔀 Smart postponing with automatic rescheduling

### 🔔 Smart Notifications
- 🌐 Real-time browser notifications
- 📧 Email reminders
- ⏰ Multiple reminders per task
- ⚡ Flexible timing (30 min, 1 hour, 1 day before)
- 💤 Snooze and reschedule options

### 📊 Productivity Insights
- 📈 Productivity dashboard
- ✔️ Task completion tracking
- 📅 Weekly and monthly reports
- 🎯 Performance trends
- 📉 Activity insights

### 🎨 Modern UI/UX
- 🎭 Built with shadcn/ui, Radix UI, Framer Motion
- 📱 Responsive and mobile-friendly
- 🌙 Dark mode support
- 📅 Calendar and timeline views
- 🖱️ Drag-and-drop task management

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Laravel 12
- **Database:** MySQL/PostgreSQL
- **Queue:** Redis/Database
- **Scheduler:** Laravel Task Scheduler
- **Auth:** Laravel Sanctum

### Frontend
- **Framework:** React 18+
- **Bridge:** Inertia.js 2.0
- **UI Library:** shadcn/ui, Radix UI
- **Animation:** Framer Motion
- **State:** TanStack Query
- **Styling:** Tailwind CSS 3

---

## 🚀 Getting Started

### Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- MySQL or PostgreSQL
- Redis (optional, for queues)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TODO_ADV
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install JavaScript dependencies**
   ```bash
   npm install
   ```

4. **Setup environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Configure database**
   
   Edit `.env` file with your database credentials:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=todo_adv
   DB_USERNAME=root
   DB_PASSWORD=
   ```

6. **Run migrations**
   ```bash
   php artisan migrate
   ```

7. **Build frontend assets**
   ```bash
   npm run build
   ```

### Development

Run the development servers:

```bash
# Option 1: Use composer script (recommended)
composer dev

# Option 2: Run servers separately
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Vite dev server
npm run dev

# Terminal 3: Queue worker (optional)
php artisan queue:work

# Terminal 4: Scheduler (optional)
php artisan schedule:work
```

Visit: `http://localhost:8000`

---

## 📁 Project Structure

```
TODO_ADV/
├── app/
│   ├── Models/              # Eloquent models
│   ├── Http/Controllers/    # Controllers
│   ├── Jobs/                # Queue jobs
│   └── Services/            # Business logic
├── database/
│   ├── migrations/          # Database migrations
│   └── seeders/             # Database seeders
├── resources/
│   └── js/
│       ├── Pages/           # Inertia pages
│       ├── Components/      # React components
│       └── Layouts/         # Layout components
├── routes/
│   ├── web.php              # Web routes
│   └── api.php              # API routes
└── tests/                   # Tests
```

---

## 🧪 Testing

Run tests:

```bash
# Run all tests
composer test

# Run specific test
php artisan test --filter TaskTest
```

---

## 📝 Available Scripts

```bash
# Development
composer dev          # Start all dev servers
npm run dev          # Start Vite dev server

# Production
npm run build        # Build for production

# Testing
composer test        # Run PHPUnit tests

# Code Quality
./vendor/bin/pint    # Format code (Laravel Pint)
```

---

## 🔮 Roadmap

### Phase 1 (Current)
- [x] Core task management
- [ ] Recurring tasks engine
- [ ] Email notifications
- [ ] Browser notifications

### Phase 2
- [ ] Advanced analytics
- [ ] Team collaboration
- [ ] Shared tasks

### Phase 3
- [ ] Smart time suggestions
- [ ] Behavior-based insights

### Phase 4
- [ ] PWA support
- [ ] Multi-language support

---

## 🚀 Deployment

For detailed deployment instructions (Ubuntu, Nginx, Supervisor), please refer to the **[Deployment Guide](.gemini/antigravity/brain/5c37e738-84a3-468c-af46-cfcfc129cf82/deployment_guide.md)**.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Laravel](https://laravel.com) - The PHP framework
- [React](https://reactjs.org) - The JavaScript library
- [Inertia.js](https://inertiajs.com) - The modern monolith
- [Tailwind CSS](https://tailwindcss.com) - The utility-first CSS framework

---

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for productivity enthusiasts**
