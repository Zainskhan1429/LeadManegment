
# 🚀 LeadFlow AI — Intelligent CRM Platform with Visual Editor & Supabase

LeadFlow AI is a fully featured, AI-powered Customer Relationship Management (CRM) platform built with modern frontend technologies and a professional-grade visual editor plugin system.

This project includes a complete lead pipeline system, analytics, authentication, and customizable plugin support — ideal for startups, sales teams, and SaaS products looking to scale customer acquisition intelligently.

---

## 🌟 Features

✅ Smart Lead Management with AI scoring  
✅ Visual Lead Editor (Plugin-powered)  
✅ Role-Based Authentication (Signup/Login)  
✅ Fully Responsive Dark UI (TailwindCSS)  
✅ Analytics Dashboard with performance insights  
✅ Supabase/PostgreSQL-ready backend integration  
✅ Modular, extendable component system  
✅ Vite-powered lightning-fast builds

---

## 🧱 Tech Stack

| Layer        | Tech                          |
|--------------|-------------------------------|
| Frontend     | React 18 + Vite               |
| Styling      | Tailwind CSS + ShadCN UI      |
| Animations   | Framer Motion + Lucide Icons  |
| State Mgmt   | React Hooks / Context API     |
| Plugins      | Custom Visual Editor System   |
| Auth         | Supabase Auth (JWT, RBAC)     |
| DB Ready     | Supabase / PostgreSQL         |
| Deployment   | Vercel, Netlify, or static    |

---

## 🖼️ UI Preview

- Responsive 3-column dashboard layout  
- Lead scoring cards with AI insights & confetti effects  
- Smooth modals for create/edit lead  
- Sidebar navigation + theme support  
- Visual Editor Plugin integrated (src/plugins/visual-editor)

---

## 🔐 Authentication

- Signup / Login / Logout flow  
- JWT-based authentication  
- Role-based dashboard rendering  
- Protected routes and secure API usage  

---

## 📁 Folder Structure

```
plugins/                  # Custom visual editor plugin
src/
├── components/
│   ├── auth/             # Login / Signup Forms
│   ├── dashboard/        # Analytics & Reporting
│   ├── leads/            # Create/Edit/View Lead modals
│   ├── layout/           # Header, Sidebar
│   └── ui/               # Shared UI components
├── App.jsx               # Main routing and layout
├── index.css             # Tailwind base styles
├── main.jsx              # Entry point
public/
dist/                     # Production build
```

---

## ⚙️ Getting Started

1. Clone the repo:

```bash
git clone https://github.com/your-username/leadflow-ai.git
cd leadflow-ai
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

Copy .env and update values (Supabase keys, VITE_* URLs):

```bash
cp .env.example .env
```

4. Run development server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

---

## 🔌 Plugins System

This project supports plugins via the /plugins directory.  
The visual-editor plugin includes:

- Inline editor support for fields
- Hot-reload via Vite plugin
- Customizable component overlays

Plugin entry: plugins/visual-editor/vite-plugin-edit-mode.js

---

## 📊 Analytics

AnalyticsDashboard.jsx shows real-time:

- Lead breakdown (Hot, Warm, Cold)
- Agent follow-up metrics
- Lead sources summary
- Conversion funnel charts (if backend connected)

---

## 📦 Deployment

- Supports deployment to Vercel, Netlify, Firebase, or any static host
- For Supabase backend:
  - Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env
- For full SSR + API: hook with Node.js or serverless functions

---

## 🛡 Security & Best Practices

- Passwords are hashed (via Supabase)
- JWT securely stored in localStorage/session
- Role-based access enforced at route/component level
- Rate limiting and input validation suggested for production

---

## 🙌 Contributors

This project was created as part of a world-class AI CRM initiative.  
Contributions welcome via PR or issues!

---

## 📃 License

MIT License. Free for personal and commercial use. Attribution appreciated.

---

Made with 💻 by Boss & AI 🚀
