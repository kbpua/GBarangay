# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## GBarangay — Project Specification

GBarangay is a digital service application prototype integrated with GCash to let residents request barangay documents, pay fees securely, and receive digital receipts and notifications. It supports two primary roles: `User` (residents) and `Barangay Admin` (staff). The application is designed with modular, multi-tenant expansion in mind so it can scale to additional LGUs and regions.

### High-level Features

- **User Dashboard:** announcements, events, alerts, notifications, request tracking.
- **Request Documents:** request types (Barangay Clearance, Barangay ID, Certificate of Residency, Certificate of Indigency), show requirements, processing time, fees; upload supporting documents; pay with GCash; lifecycle: `submitted → processing → ready → completed`.
- **FAQ / AI Chatbot:** answers about requirements, fees, processing, pick-up/digital copies.
- **Barangay Dashboard:** post announcements, basic analytics, manage requests (view user info, documents, payment), upload digital certificates, schedule pick-ups, update status.
- **Staff Chatbot:** assists staff with workflows and requirements.

### Additional Requirements

- Secure digital payments and data privacy (TLS, tokenization, least privilege).
- Assisted digital window (kiosk/terminal and staff-assisted flows) for residents without devices or low digital literacy.
- Modular design for LGU/region expansion (multi-tenant patterns, per-LGU configs).
- Notifications and digital receipts (email/SMS/push; PDF receipts).

### Recommended Architecture & Tech Stack

- **Frontend:** React (current), React Router, context/state (Redux or React Query), component library (Material UI / Tailwind).
- **Backend:** Node.js + Express / NestJS or Python FastAPI — exposes REST/GraphQL API, handles business logic, payment webhook verification, and file uploads.
- **Database:** PostgreSQL (primary), Redis (caching, notification queue/state), S3-compatible storage for files.
- **Messaging:** RabbitMQ / cloud PubSub for long-running jobs (receipt generation, notifications).
- **AI/Chatbot:** OpenAI or local LLM + knowledge base (documents, FAQs).

### Data Model (summary)

- `users`: id, name, contact (email, phone), devicePrefs, kycStatus
- `requests`: id, userId, type, requirements[], files[], amount, paymentStatus, status, timestamps
- `payments`: id, requestId, provider, providerReference, amount, status,rawWebhook
- `receipts`: id, requestId, pdfUrl, issuedAt
- `announcements`: id, lguId, title, body, expiresAt
- `lgus`: id, name, config (fees, services, staff)

### Key API Endpoints (examples)

- `POST /api/requests` — create request + upload files
- `GET /api/requests/:id` — fetch request + status
- `POST /api/payments/gcash/create` — create payment order (server -> GCash)
- `POST /api/payments/gcash/webhook` — verify payment event (webhook)
- `POST /api/admin/requests/:id/status` — admin updates status
- `GET /api/announcements` — public announcements

### GCash Integration Notes

- Use server-side integration for payment initiation and webhook verification; never embed secret keys in the client.
- Tokenize payment references and store only non-sensitive metadata. Follow GCash merchant integration docs and PCI-relevant controls when handling card-like data (if any).

### Security & Privacy

- Require TLS everywhere; use strong auth (OAuth2 / JWT with short expiry and refresh tokens).
- Encrypt sensitive fields at rest where required (PII) and log minimally.
- Implement role-based access control (RBAC) — `user`, `staff`, `admin`.
- Data retention and consent flows for receipts and user documents.

### Assisted Digital Window

- Provide a kiosk mode web UI (fullscreen, limited navigation) plus a staff terminal to assist residents.
- Staff-assisted request flow: staff opens a secure assistant panel, captures minimal PII, uploads files on behalf, and initiates payment via QR or staff device.

### Notifications & Receipts

- Generate receipts (PDF) server-side after payment confirmation and attach to user record.
- Deliver via push (web push / FCM), email (SMTP or transactional service), and SMS (3rd-party provider).

### Modular / Multi-LGU Expansion

- Multi-tenant data partitioning or per-LGU schema; configurable fees and services per `lgus` record.
- Feature flags and per-LGU theme/config for localized workflows.

### Minimal Next Steps (implementation MVP)

1. Create backend API skeleton with user, requests, payments, announcements models.
2. Add frontend routes: `/dashboard`, `/requests/new`, `/requests/:id`, `/admin`.
3. Implement file uploads and store to S3-compatible storage.
4. Implement GCash payment stub + webhook receiver (test mode).
5. Add notifications (email + web push) and receipt PDF generator.

### Ultra-short AI-agent prompt (one paragraph)

"Implement a React+Node prototype called GBarangay that lets residents request barangay documents (clearance, ID, residency, indigency), upload supporting files, pay fees via GCash (server-side payment initiation + webhook verification), track request status, and receive notifications and PDF receipts. Include an admin dashboard to manage requests, upload digital certificates, and schedule pick-ups. Design the backend with PostgreSQL, protect secrets server-side, support kiosk staff-assisted flows, and make the app multi-tenant-ready for future LGU expansion."

If you'd like, I can scaffold the frontend routes and backend API stubs next. Tell me whether you prefer Node/Express or FastAPI for the backend and whether to add a simple mock GCash integration for local testing.
