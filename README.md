# Polling Heroes 🗳️

**Polling Heroes** is a robust, full-stack, real-time polling application designed for creators to gather feedback, track engagement, and analyze data in real-time. Built with a focus on speed, reliability, and a premium monochrome aesthetic.

---

## 🚀 Key Features

- **Real-time Analytics**: Live poll updates via Socket.io with dynamic charts powered by Recharts.
- **Secure Authentication**: JWT-based authentication with secure cookie storage.
- **Flexible Email Verification**: Register and start using the app immediately with a grace period for email verification.
- **Dynamic Poll Creation**: Support for mandatory/optional questions, expiry times, and private/public result visibility.
- **User Dashboard**: Manage your polls, view active participations, and track historical data.
- **Premium Design**: A sleek, monochrome interface built with Tailwind CSS v4 and Lucide icons.
- **Type-Safe Development**: Full TypeScript implementation across the entire stack.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v4
- **State/Logic**: React Hook Form, Zod (Validation)
- **Navigation**: React Router 7
- **Charts**: Recharts
- **Icons**: Lucide React
- **Real-time**: Socket.io-client

### Backend
- **Environment**: Node.js (Express 5)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: JWT, Bcryptjs
- **Communication**: Socket.io (Real-time events), Nodemailer (Email verification)
- **Infrastructure**: Docker (PostgreSQL container)

---

## 📂 Project Structure

```text
Polling-Heroes/
├── backend/                # Express server and Database logic
│   ├── drizzle/            # Database migrations
│   ├── src/                # Backend source code
│   ├── docker-compose.yaml # PostgreSQL configuration
│   └── .env.example        # Environment variables template
├── frontend/               # React application
│   ├── src/                # Frontend source code
│   ├── public/             # Static assets
│   └── .env.example        # Frontend environment variables
└── README.md               # You are here
```

---

## 🏁 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) (for running the database)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Polling-Heroes
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   pnpm install
   cp .env.example .env  # Update with your credentials
   docker-compose up -d  # Start PostgreSQL
   pnpm db:generate
   pnpm db:migrate
   pnpm dev
   ```

3. **Setup Frontend**:
   ```bash
   cd ../frontend
   pnpm install
   cp .env.example .env  # Update with VITE_API_URL
   pnpm dev
   ```

---

## 🔑 Environment Variables

### Backend (.env)
| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `SMTP_HOST` | Email server host (e.g., Mailtrap) |
| `SMTP_USER` | Email server username |
| `SMTP_PASS` | Email server password |
| `CORS_ORIGIN` | Frontend URL (default: http://localhost:5173) |

### Frontend (.env)
| Variable | Description |
| :--- | :--- |
| `VITE_API_URL` | Backend server URL (default: http://localhost:8000) |

---

## 📊 Database Management

This project uses **Drizzle ORM** for type-safe database interactions.

- **Generate Migrations**: `pnpm db:generate`
- **Apply Migrations**: `pnpm db:migrate`
- **Drizzle Studio**: `pnpm studio` (GUI to view your database)

---

## 📡 Real-time Communication

Socket.io is used to broadcast live poll results to all connected clients. When a user votes, the server calculates the updated percentages and emits a `pollUpdate` event, ensuring all participants see the data change in real-time without refreshing.

---

## 📄 License

This project is licensed under the ISC License.

Developed with ❤️ by the Polling Heroes Team.

---

## 🤝 Connect with the Developer

Feel free to reach out for collaborations or just a tech chat!

- **X (Twitter)**: [@Ved_PandeyOG](https://x.com/Ved_PandeyOG)
- **LinkedIn**: [Ved Pandey](https://www.linkedin.com/in/ved-pandey/)
- **GitHub**: [@vpdevs001](https://github.com/vpdevs001)
- **YouTube**: [@DevWithVed](https://www.youtube.com/@DevWithVed)
- **Instagram**: [@vedpandey_dev](https://www.instagram.com/vedpandey_dev)
