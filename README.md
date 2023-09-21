# AgileWebApplication / TicketCut

TicketCut or originally AgileWebApplication is an application website created in JavaScript, using the Next.JS web framework (App Router), that can be used by companies to track issues. It enables the creation of tickets and assignment of personel.

### Dependencies
- Web Framework
  - next
  - react
  - react-dom
- Form Validation
  - react-hook-form
  - @hookform/resolvers
  - zod
- UI
  - @radix-ui/react-avatar
  - @radix-ui/react-checkbox
  - @radix-ui/react-dialog
  - @radix-ui/react-dropdown-menu
  - @radix-ui/react-label
  - @radix-ui/react-navigation-menu
  - @radix-ui/react-separator
  - @radix-ui/react-slider
  - @radix-ui/react-slot
  - @radix-ui/react-tooltip
  - @tanstack/react-table
  - autoprefixer
  - class-variance-authority
  - clsx
  - dayjs
  - lucide-react
  - postcss
  - tailwind-merge
  - tailwindcss
- Database
  - knex
  - sqlite3
  - better-sqlite3
  - Only present to satisfy knex dependencies, not used:
    - mysql
    - mysql2
    - oracledb
    - pg
    - pg-query-stream
    - tedious
- Database Generation
  - lorem-ipsum
- Linting
  - eslint
  - eslint-config-next
  - eslint-plugin-react

All can be found on https://www.npmjs.com/

## Getting Started

First, run the development server:

```bash
npm install
node genDb.js
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
