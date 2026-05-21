# PRAVAC Mock Admin Test Instructions

1. Install dependencies:

```bash
npm install
```

2. Start the local project:

```bash
npm run dev
```

3. Open the hidden mock admin URL:

```text
http://127.0.0.1:5173/sk/admin-pravac
```

4. Login with test credentials:

```text
email: admin@pravac.local
password: PravacMVP2026!
```

5. Test data is stored in browser `localStorage`. New bookings, edited cars, pricing tiers, locations, extra services and manual availability blocks persist after reload in the same browser.

Security note: this is test authorization without real protection. Before production, replace it with backend/Directus authentication, roles and permissions.
