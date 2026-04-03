# 🌍 Travelworld - Premium Travel & Community Platform

Travelworld ek professional-grade travel booking aur community platform hai jo React (Vite) aur Django ke saath banaya gaya hai. Isme premium UI/UX, real-time monitoring, aur secure authentication features included hain.

## 🚀 Key Features

- **💎 Premium UI**: Glassmorphism design, smooth animations (Framer Motion), aur Navy/Gold premium color palette.
- **🏨 Hotel Booking**: Streamlined "Quick Booking" modal hotels ke liye.
- **🗺️ Destination Explorer**: Detailed destination pages with high-quality imagery.
- **👥 Community**: User-generated posts aur travel stories share karne ke liye platform.
- **🛡️ Admin Console**: Complete system monitoring dashboard:
  - **Real-time Activity**: WebSocket-based login alerts (username, IP, device info).
  - **System Health**: Infrastructure metrics (CPU, Memory, Disk usage).
  - **Audit Trail**: Detailed security logs for all administrative actions.
  - **Management**: User aur Booking registries manage karne ke liye tools.

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Framer Motion, Redux Toolkit, Lucide React.
- **Backend**: Django REST Framework, Django Channels (WebSockets).
- **Database**: SQLite (Development) / PostgreSQL (Production ready).
- **Storage**: Cloudinary (Media assets management).

## ⚙️ Setup Instructions

### Backend Setup
1. Backend directory mein jayein:
   ```bash
   cd backend
   ```
2. Virtual environment activate karein:
   ```bash
   .\venv\Scripts\activate
   ```
3. Dependencies install karein:
   ```bash
   pip install -r requirements.txt
   ```
4. Migrations apply karein:
   ```bash
   python manage.py migrate
   ```
5. Server start karein:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Frontend directory mein jayein:
   ```bash
   cd frontend
   ```
2. Dependencies install karein:
   ```bash
   npm install
   ```
3. Development server start karein:
   ```bash
   npm run dev
   ```

## 🔐 Admin Access

Admin dashboard access karne ke liye `is_staff` user account ki zaroorat hoti hai.

- **Default Admin Account**:
  - **Email**: `admin@gmail.com`
  - **Password**: `admin@123`

Naya admin banane ke liye backend folder mein ye command chalayein:
```bash
python manage.py createsuperuser
```

## 🌐 Deployment
Project Netlify (Frontend) aur Heroku/Render (Backend) par deploy karne ke liye optimized hai. Netlify ke liye `_redirects` aur `netlify.toml` files include ki gayi hain.
