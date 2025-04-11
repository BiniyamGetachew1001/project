# Building an Admin-Controlled Website for TILkTBEB (LaunchPad)

## Purpose
Create a user-friendly admin panel for managing content, payments, and users, with step-by-step instructions for setup and management, ensuring accessibility and security.

---

## Step-by-Step Instructions

### 1. Set Up Supabase
- Sign up on Supabase, create a project, and get the API URL and anon key.
- Enable phone number login with OTP for admin authentication.

### 2. Design Database Schema
- Tables (UUID primary keys):
  - **users**: id, phone (unique), name, is_admin (default false), status (‘active’, ‘suspended’).
  - **books**: id, title, author, price, access_type (‘free’, ‘full’, ‘individual’), category, summary, cover_url.
  - **business_ideas**: id, title, category (‘small’, ‘middle’, ‘large’), access_type (‘free’, ‘category’), description.
  - **blog_posts**: id, title, content, status (‘draft’, ‘published’), tags, cover_url.
  - **payments**: id, user_id, content_id, content_type (‘book’, ‘idea’), amount, proof_url, status (‘pending’, ‘approved’, ‘rejected’).
  - **user_purchases**: id, user_id, content_id, content_type, purchase_date.
- Localization: Add title_am, summary_am (Amharic), title_or, summary_or (Afaan Oromo).

### 3. Set Up Row-Level Security (RLS)
- Enable RLS on all tables.
- Policies: e.g., allow CRUD on books if `auth.uid() = user.id AND is_admin = true`.

### 4. Build React Admin Panel
- Setup: `npx create-react-app tilktbeb-admin --template typescript`
- Install: `npm install @supabase/supabase-js react-router-dom tailwindcss @heroicons/react`
- Tailwind: Configure per guide.
- Supabase Client: `supabaseClient.ts` with API URL and anon key.
- Routes: `/admin/dashboard`, `/admin/books`, `/admin/ideas`, `/admin/blog`, `/admin/payments`, `/admin/users`, `/admin/settings`.

### 5. Authentication
- Admin login with phone (Supabase Auth, `is_admin = true`).
- Protect routes, redirect unauthorized users to login.

### 6. Dashboard
- Cards: Total Books, Ideas, Posts (grid `grid-cols-1 md:grid-cols-3 gap-4`, `bg-blue-100`).
- Pending Payments (`bg-yellow-100`), Active Users (`bg-green-100`).
- Recent Activity: Last 5 actions.

### 7. Content Management (Books, Ideas, Blog)
- CRUD: Tables with title, author/category, price/access, actions.
- Actions: Edit, Delete (confirm dialog), Preview (modal).
- Add: “New” button (`bg-green-600 text-white`), form (title, price, summary, cover upload).
- File Uploads: Use Supabase Storage for book covers, blog thumbnails (store URL in `cover_url`).
- Bulk Actions: Delete or change access.
- Filters: Free vs. Paid, category.

### 8. Payments Management
- Table: User Phone, Book/Idea, Amount, Proof (View link), Status, Actions.
- Actions: Approve (update Supabase, add to `user_purchases`), Reject.
- Telegram Bot Process (Semi-Automatic):
  - Users upload proof to `@TILkTBEBBot`; bot logs to Supabase payments table.
  - Admin notified via Payments section (Pending count increases).
  - Admin views proof in modal, approves/rejects, updates `user_purchases`.
- File Uploads: Store payment proof screenshots in Supabase Storage, link in `proof_url`.
- Filter: Pending/Approved.

### 9. Users Management
- Table: Phone, Name, Purchases, Status, Actions.
- Actions: View Details (modal), Suspend/Activate.
- Search: Phone/name.

### 10. Settings
- Tabs: General (site name, email), Localization (Amharic, Afaan Oromo, RTL), Pricing (Full Access, Books, Categories).

### 11. Localization
- Store translations in Supabase (e.g., `title_am`, `title_or`).
- Support RTL for Amharic.

### 12. Accessibility and Responsiveness
- WCAG 2.1: ARIA labels, keyboard navigation, screen readers.
- Responsive: Collapsible sidebar on mobile.

### 13. Testing
- Unit tests (Jest), integration tests (payment approval).
- Test low-end devices, slow networks.

### 14. Deployment
- Deploy to Vercel with Supabase environment variables.
- Optimize: CDN, compressed assets.

---

## Optional Enhancements
- **Markdown**: Enable Markdown support in blog content (e.g., use `react-markdown` for rendering).
- **Realtime**: Use Supabase Realtime for instant updates on new payments (subscribe to payments table).
- **Telegram Bot Flow**: Future integration - bot auto-notifies admin via Telegram, updates Supabase directly.

---

## Manage from Admin Panel
- Log in with admin credentials.
- Add/edit/delete books, ideas, posts (upload covers to Supabase Storage).
- Approve/reject payments (view proofs from Storage, update `user_purchases`).
- Manage users (suspend/activate).
- Update settings (pricing, localization).
- Monitor dashboard metrics.

---

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS.
- **Backend**: Supabase (Realtime DB, Auth, RLS, Storage).
- **Routing**: React Router DOM (`/admin/*`).
- **State**: React Context API.

---

## Considerations
- **Ethiopia**: Simple UI, mobile support, low-bandwidth.
- **Security**: Supabase Auth, RLS.
- **Feedback**: Toasts (e.g., “Saved!”), spinners.

---

## Deliverables
- Admin panel prototype.
- Components: Sidebar, Table, FormModal.
- Supabase queries for CRUD, payments, uploads.

---

# Supabase Configuration

## Supabase URL
https://usoobxckqvrngfhobfmm.supabase.co

## Supabase Anon Key
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzb29ieGNrcXZybmdmaG9iZm1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNzgzMzUsImV4cCI6MjA1ODc1NDMzNX0.J6U443LUAiYNUHpQ9cVmRP5EUtDzocVvSVXq22o5c-Y