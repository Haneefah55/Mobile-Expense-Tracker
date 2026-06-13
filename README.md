# 💰 Mobile Expense Tracker

A cross-platform personal finance app built with React Native (Expo) and Node.js — featuring real-time budget alerts, Google OAuth login, and Redis caching for a fast, seamless experience on both iOS and Android.

📲 **Download APK:** [Install on Android](https://github.com/Haneefah55/Mobile-Expense-Tracker/releases/download/V1.0/wallet.apk)
📂 **GitHub:** [github.com/Haneefah55/Mobile-Expense-Tracker](https://github.com/Haneefah55/Mobile-Expense-Tracker.git)

---

## 📸 Screenshots



---

## ✨ Features

- 📊 **Track income and expenses** across customizable categories
- 🔔 **Real-time budget alerts** — get notified when you're approaching or exceeding your budget
- 🔐 **Google OAuth 2.0 login** with secure JWT session management
- ⚡ **Redis caching** for fast data fetching and reduced API load
- ☁️ **Cloudinary integration** for profile image uploads
- 📱 **Cross-platform** — runs on both iOS and Android via Expo
- 📦 **Installable APK** — distributed via GitHub Releases (no app store needed)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Mobile (Frontend) | React Native, Expo |
| Styling | Tailwind CSS (NativeWind) |
| State Management | Zustand |
| Backend | Node.js, Express.js, REST API |
| Database | MongoDB |
| Caching | Redis |
| Auth | Google OAuth 2.0, JWT |
| Media | Cloudinary |
| Distribution | GitHub Releases (APK) |

---

## 📲 Installation

### Option A — Install APK directly (Android)

1. Download the APK: [wallet.apk](https://github.com/Haneefah55/Mobile-Expense-Tracker/releases/download/V1.0/wallet.apk)
2. On your Android device, go to **Settings → Security → Enable "Install from unknown sources"**
3. Open the downloaded APK and tap **Install**
4. Launch the app and sign in with Google

---

### Option B — Run locally with Expo

#### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Redis](https://redis.io/) (local or Redis Cloud)
- Expo Go app on your phone (for testing)

#### 1. Clone the Repository

```bash
git clone https://github.com/Haneefah55/Mobile-Expense-Tracker.git
cd Mobile-Expense-Tracker
```

#### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install mobile app dependencies
cd ../mobile
npm install
```

#### 3. Set Up Environment Variables

Create a `.env` file in the `/backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
REDIS_URL=your_redis_url

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

NODE_ENV=development
```

Create a `.env` file in the `/mobile` directory:

```env
EXPO_PUBLIC_API_BASE_URL=http://your-local-ip:5000/api
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

#### 4. Run the App

```bash
# Start backend (from /backend)
npm run dev

# Start Expo (from /mobile)
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone.

---

## 📁 Project Structure

```
Mobile-Expense-Tracker/
├── backend/
│   ├── controllers/        # Route logic
│   ├── middleware/         # Auth & error middleware
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── lib/                # Redis, Cloudinary config
│   └── server.js           # Entry point
│
├── mobile/
│   ├── app/                # Expo Router screens
│   │   ├── (auth)/         # Login / signup screens
│   │   └── (tabs)/         # Main tab screens
│   ├── components/         # Reusable UI components
│   ├── store/              # Zustand state management
│   └── app.json            # Expo config
│
└── README.md
```

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/google` | Google OAuth login |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user |

### Transactions
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/transactions` | Get all user transactions |
| POST | `/api/transactions` | Add a transaction |
| PUT | `/api/transactions/:id` | Update a transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |

### Budget
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/budget` | Get user budget |
| POST | `/api/budget` | Set or update budget |

### User
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/user/profile` | Get user profile |
| PUT | `/api/user/profile` | Update profile & avatar |

---

## 🔔 How Budget Alerts Work

1. User sets a monthly budget in the app
2. Every time a new expense is added, the backend calculates the total spending for the month
3. If spending exceeds **80%** of the budget, an alert is triggered in the app
4. If spending exceeds **100%**, a critical alert is shows

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Olasupo Haneefah Omotayo**

- Portfolio: [haneefah55.vercel.app](https://haneefah55.vercel.app)
- GitHub: [@Haneefah55](https://github.com/Haneefah55)
- LinkedIn: [olasupo-haneefah](https://www.linkedin.com/in/olasupo-haneefah-5259b7a3)
- Email: olasupoomotayo@gmail.com

---

⭐ **If you found this project helpful, please give it a star!**
