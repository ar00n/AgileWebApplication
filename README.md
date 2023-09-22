# AgileWebApplication / TicketCut

![image](https://github.com/ar00n/AgileWebApplication/assets/29901295/70a3bdd5-fd71-4c38-a82b-42f403f00fe6)

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
  - zxcvbn
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
- Database Dummy Data Generation
  - lorem-ipsum
- Linting
  - eslint
  - eslint-config-next
  - eslint-plugin-react
  - eslint-config-standard
- Logging
  - pino 

All can be found on https://www.npmjs.com/

## Getting Started

First, run the development server:

```bash
npm install
node genDb.js
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Screenshots

![image](https://github.com/ar00n/AgileWebApplication/assets/29901295/728c1e12-ab89-4386-8841-dae0523f8e19)
![image](https://github.com/ar00n/AgileWebApplication/assets/29901295/7e7a95e2-6248-41c9-845a-60e0b6e46d6f)
![image](https://github.com/ar00n/AgileWebApplication/assets/29901295/94d7427d-fbe8-487d-8f35-a1c1e75b0890)
![image](https://github.com/ar00n/AgileWebApplication/assets/29901295/2903022e-7b67-4eb6-9ef7-5b41483abee0)
![image](https://github.com/ar00n/AgileWebApplication/assets/29901295/c5eb3b35-8307-4551-91d3-c55c02f29dc4)


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
