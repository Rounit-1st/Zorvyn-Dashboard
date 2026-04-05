# Zorvyn-Dashboard

Simple finance dashboard to track income, expenses, and overall balance. Built mainly as a frontend prototype.

# Preview

![Homepage Image](/docs/images/homepage.png)
![Insight Section](/docs/images/insights.png)
![Transaction Section](/docs/images/transactions.png)


# What it does
- Shows balance, income, expenses
- Charts for trends + category breakdown
- Full transaction table (search, filter, sort, paginate)
- Admin mode → add/edit/delete
- Viewer mode → read-only

# Stack
- Next.js + React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts
- Context API (state)

# Run locally

```
git clone https://github.com/Rounit-1st/Zorvyn-Dashboard
cd Zorvyn-Dashboard
npm install
npm run dev
```

# Notes / Trade-offs
Everything is client-side (no backend)
Data resets on refresh
Role system is just a UI toggle
Pagination + filtering are not scalable

Basically optimized for speed + demo, not production.

# If I extend this
- Add DB (Supabase / Postgres)
- Proper auth + roles
- Server-side filtering/pagination
- Better analytics + exports


# Repo Structure
```
├── app/            # pages + layout
├── components/     # UI + dashboard components
├── lib/            # state, utils, data
├── hooks/          # custom hooks
├── public/         # static assets
├── package.json
├── tsconfig.json
└── docs
└── README.md
```