# Texly - SMS SaaS Platform

Texly is a modern SaaS platform for sending, scheduling, and managing SMS campaigns for businesses and individuals. It features a professional web dashboard, mobile app, and robust backend with role-based access, subscription management, and full API documentation.

## Features
- Send individual and bulk SMS (Twilio integration)
- SMS scheduling
- Contact management (manual and CSV/Excel upload)
- SMS templates
- Delivery reports and history
- Subscription plans (Free, Pay-as-you-go, Premium)
- Stripe payment integration
- JWT authentication and role-based access
- Admin dashboard
- Professional, responsive UI/UX (web & mobile)
- API documentation (Swagger)

## Tech Stack
- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB
- **Mobile:** React Native

## Folder Structure
- `frontend/` - React web app
- `backend/` - Node.js API server
- `mobile/` - React Native mobile app

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas)
- Yarn or npm

### 1. Backend
```
cd backend
cp .env.example .env # or edit .env with your credentials
npm install
npm run seed # (optional) seed sample data
npm run dev
```
API docs: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

### 2. Frontend
```
cd frontend
npm install
npm run dev
```

### 3. Mobile
```
cd mobile
npm install
npx react-native run-android # or run-ios
```

## Sample Data
Run `npm run seed` in backend to populate sample users, contacts, templates, and subscriptions.

## API Documentation
See [backend/src/utils/swagger.yaml](backend/src/utils/swagger.yaml) or [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

## License
MIT
