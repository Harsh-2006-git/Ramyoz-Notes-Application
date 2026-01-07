# 📓 Ramyoz Notes Application

Ramyoz Notes Application is a high-performance, premium note-taking workspace designed for professionals who value speed, security, and aesthetics. Built with Next.js 15, it features a minimalist dark-theme interface, instant "optimistic" UI updates, and secure Google Authentication.

![Premium Design](https://img.shields.io/badge/Design-Premium%20Dark-blueviolet)
![Next.js](https://img.shields.io/badge/Framework-Next.js%2015-black)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![NextAuth](https://img.shields.io/badge/Auth-NextAuth.js-blue)

---

<img width="1864" height="892" alt="image" src="https://github.com/user-attachments/assets/f190a12b-62ad-4834-8e12-97d0212deeba" />

---
Live Working Link: https://ramyoz-notes-application-harsh.vercel.app/

---
## ✨ Key Features

- **🚀 Instant Interaction**: Powered by Optimistic UI updates. Notes appear, update, and disappear locally the millisecond you click, syncing with the cloud in the background.
- **🛡️ Secure Vault**: Full integration with NextAuth.js and Google OAuth for enterprise-grade security.
- **📱 Ultra-Responsive**: A custom-built grid system that adapts perfectly to desktop, tablet, and mobile browsers.
- **🎨 Glassmorphic Aesthetic**: Premium dark mode UI with soft blurs, vibrant gradients, and smooth Framer Motion animations.
- **📧 Personalized Space**: A dedicated dashboard (the "Personal Vault") for every user.
- **🔔 Smart Notifications**: Color-coded, non-intrusive toast system for real-time feedback (Success, Update, Delete).

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19, Framer Motion
- **Icons**: Lucide React
- **Styling**: Vanilla CSS (CSS Modules & Global Variables)
- **Backend**: Next.js API Routes (Edge-ready)
- **Database**: MongoDB (Direct Driver integration)
- **Authentication**: NextAuth.js (JWT Strategy)

---

<img width="1885" height="894" alt="image" src="https://github.com/user-attachments/assets/78d0b13c-9a44-444b-8bdb-559114b2fd01" />

---


## 🚦 Getting Started

### Prerequisites

- Node.js 18.x or later
- MongoDB Atlas account (or local MongoDB)
- Google Cloud Console Project (for Credentials)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Harsh-2006-git/Ramyoz-Notes-Application.git
   cd Ramyoz-Notes-Application
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=your_mongodb_connection_string
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=generate_a_random_string
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the result.

## 🚀 Deployment

The easiest way to deploy this app is using the [Vercel Platform](https://vercel.com/new).

1. Push your code to GitHub.
2. Import the project into Vercel.
3. Add your Environment Variables in the project settings.
4. Update your Google Cloud Console "Authorized JavaScript origins" and "Redirect URIs" with your production URL.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Created by Harsh for the Ramyoz ecosystem.*
