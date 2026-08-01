# URL Shortener

A modern, full-stack URL Shortener web application built with **React 19**, **Vite**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

## 🚀 Features

- **Custom URL Shortening**: Create short links for long URLs with optional custom slugs.
- **QR Code Generation**: Automatically generate and download QR codes for created short links.
- **Click Analytics & Insights**: Track total clicks, device usage, location data, and referrers visualized with interactive charts.
- **User Authentication**: Secure user login and registration powered by Supabase Auth.
- **Dashboard & Link Management**: Manage, copy, search, and delete saved short links in an intuitive dashboard interface.
- **Fast Redirection**: Instant redirection from short URLs to original target URLs.

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
- **Backend & Database**: [Supabase](https://supabase.com/)
- **Analytics & Charts**: [Recharts](https://recharts.org/), [ua-parser-js](https://github.com/faisalman/ua-parser-js)
- **QR Codes**: [react-qrcode-logo](https://www.npmjs.com/package/react-qrcode-logo)

## 📋 Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (v18 or higher recommended)
- **npm** (or yarn / pnpm / bun)

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/msadiq7786/redirect-url-shortener.git
cd redirect-url-shortener
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

### 4. Run Development Server

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

## 📜 Available Scripts

- `npm run dev` — Starts the Vite development server.
- `npm run build` — Runs TypeScript type checks and builds the project for production.
- `npm run preview` — Locally previews the production build.
- `npm run lint` — Runs ESLint to check for code quality and formatting issues.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
