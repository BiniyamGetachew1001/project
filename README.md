# 🚀 TILkTBEB (LaunchPad)

TILkTBEB is a modern, multilingual web platform that offers summarized business books and categorized business ideas for aspiring entrepreneurs and professionals. With a sleek, app-like reading experience and local payment integrations, it’s designed for accessibility and ease — especially within the Ethiopian context.

---

## 🧩 Features

### 📚 Core Content
- **Business Book Summaries**
  - Curated summaries of best-selling and niche business books.
  - View summaries for free (3 books) or unlock all with a one-time payment.
  - Option to **purchase books individually** via a dedicated page.

- **Business Ideas (Plans)**
  - Ideas structured as business plans for different scales:
    - **Small**
    - **Middle**
    - **Large**
  - 1 idea from each category is free.
  - Purchase per **category** (e.g., buy "Small" to access all current + future small plans).

- **Interactive Reading**
  - Font size, line spacing, night mode.
  - Highlight & take notes.
  - Dictionary support.
  - Mobile gestures (swipe, pinch to zoom).
  - Battery saver mode.

- **Offline Reading (Lite)**
  - Cache the last-read content for offline access (no full download support).

---

### 🔐 Authentication

- **Phone Number Sign-In Only**
  - No social login (e.g., Google, Facebook, etc.)
  - OTP-based authentication through Supabase

---

### 💸 Payment System

- **Manual / Semi-Automated via Telegram Bot**
  - No TIN or merchant ID required
  - Users pay via Telebirr, CBE, or local transfer
  - Upload payment receipt to Telegram bot
  - Bot verifies manually or semi-automatically, then updates user access via Supabase

---

### 🧠 Additional Pages

- **Home Page**
  Introduces features, explains the model (free vs premium), showcases highlighted content.

- **Book Summaries Page**
  Filter & browse all available books
  - Tabs: Free, Full Access, Individual
  - Individual purchases redirect to a custom reading UI

- **Business Ideas Page**
  Filter ideas by Small, Middle, Large
  - Purchase per category to unlock all plans under it

- **Blog**
  Articles, business insights, summaries, and guides
  - Social share and copy link functionality

- **Pricing Page**
  Clear layout of:
    - Full book access (one-time)
    - Individual book price
    - Business category prices

- **Settings / Account Page**
  - Profile
  - Access info
  - Language & UI preferences

---

## ⚙️ Admin Panel

Admin can:
- Add/edit/delete:
  - Book summaries (free, full-access, or individual)
  - Business ideas (free or per category)
  - Blog posts
- Set access types & pricing
- Assign category tags
- Approve manual payments (after bot verification)
- Manage multilingual content
- View user payment status
- Upload book covers and rich content files

---

## 🌍 Multilingual Support (Optional)

- **Amharic**
- **Afaan Oromo**
- Future support for more languages via Supabase internationalization

---

## 🧑‍💻 Tech Stack

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Backend**: Supabase MCP Server
  - Realtime DB
  - Phone auth
  - Row-level security for content access
- **State Management**: Context API

---

## 🛠 Installation & Setup

```bash
git clone <repository-url>
cd <repository-folder>
npm install
npm run dev
```
