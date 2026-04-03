# Travelworld - Full Stack Travel Community & Booking Platform

Travelworld ek modern travel community aur booking application hai jise **React (Vite)** aur **Django (DRF)** ka use karke banaya gaya hai. Isme aap destinations explore kar sakte hain, hotels book kar sakte hain aur community stories share kar sakte hain.

---

## 🚀 Quick Setup (Kaise chalayein?)

Is project ko chalane ke liye aapko 2 alag terminals open karne honge:

### **1. Backend Setup (Django)**
Pehle backend server start karein:
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Install requirements:
pip install -r requirements.txt
# Run migrations:
python manage.py migrate
# Seed initial data (optional):
python manage.py seed_data
# Start server:
python manage.py runserver
```
*Backend URL: http://127.0.0.1:8000/*

### **2. Frontend Setup (React + Vite)**
Naya terminal open karein aur frontend start karein:
```bash
cd frontend
npm install
npm run dev
```
*Frontend URL: http://localhost:5173/*

---

## ✨ Main Features (Isme kya-kya hai?)

- **Premium UI/UX**: Ekdum modern design with glassmorphism, smooth animations (Framer Motion) aur dark mode support.
- **Advanced Booking System**: 
  - **Unified Wizard**: Destination, Hotel, Transport aur Add-ons sab ek hi flow me book karein.
  - **Quick Hotel Booking**: Dedicated modal for fast hotel-only reservations.
- **Community Module**: Photos, Stories, Tips aur Reviews filter karne ke liye categories.
- **Interactive Home Page**: Floating offer cards, booking stats aur premium hero section.
- **Mock Payment**: PCI-compliant validated card forms aur GPay/PayPal options.

---

## 🛠 Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Redux Toolkit, Lucide Icons, Framer Motion.
- **Backend**: Django, Django Rest Framework (DRF), SQLite.
- **Auth**: JWT Authentication.

---

## 🔑 Note for Friend
- Make sure aapke system me **Python 3.10+** aur **Node.js** installed ho.
- Backend me `.env` file check kar lena (agar Cloudinary use karna hai images ke liye).
- Project open karte hi pehle **Login** ya **Sign up** karein taaki aap saare features (Booking, Posting) access kar saken.

Enjoy Exploring! 🌍✈️
