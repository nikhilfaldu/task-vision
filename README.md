# Task Management

A modern task management app built with React, Vite, Tailwind CSS, and Prisma. This monorepo contains both the frontend (`next-task-vision`) and backend (`next-task-vision-server`).

## Project Structure

```
next-task-vision/           # Frontend (React + Vite)
next-task-vision-server/    # Backend (Node.js + Express + Prisma)
```

## Prerequisites

- Node.js (v18+ recommended)
- npm or bun
- PostgreSQL (or your preferred database)

## Setup Instructions

### 1. Clone the repository

```sh
git clone <your-repo-url>
cd next-task-vision
```

### 2. Install dependencies

#### Frontend

```sh
cd next-task-vision
npm install # or bun install
```

#### Backend

```sh
cd ../next-task-vision-server
npm install
```

### 3. Setup environment variables

Copy  `.env` in **both** folders and set your variables.

**PostgreSQL (recommended)**
```env
# Prisma expects a standard Postgres connection string
# Format:
# postgresql://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>?schema=<SCHEMA>

DATABASE_URL="postgresql://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>?schema=<SCHEMA>"


### 4. Setup Prisma (Backend)

```sh
cd next-task-vision-server
npx prisma generate
npx prisma db push
```

### 5. Start the servers

#### Backend

```sh
npm run dev
```

#### Frontend

```sh
cd ../next-task-vision
npm run dev
```

## Usage

- Frontend runs on `localhost:8080` (or as configured)
- Backend runs on `localhost:4000` (or as configured)

## Features

- **Task lists & tasks**: Organize your work with multiple lists and tasks, each supporting due dates, completion, and starring for priority.
- **Modern UI**: Enjoy a clean, responsive interface with a custom sidebar, header, and beautiful design powered by Tailwind CSS.
- **Cascading delete**: Deleting a list automatically removes all its associated tasks, keeping your workspace tidy.
- **API endpoints**: Full REST API for creating, reading, updating, and deleting lists and tasks, making integration and automation easy.
- **Prisma ORM**: Robust database layer with migrations, type safety, and easy schema management.
- **Easy setup**: Simple instructions for cloning, installing, and running both frontend and backend, including Prisma setup.

## Contributing

Feel free to open issues or PRs for improvements!

## License

MIT
