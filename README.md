# Sykell Fullstack Coding Challenge

This project is a solution to the Sykell Fullstack Coding Challenge. It is a web application that allows users to submit URLs for analysis, view crawl results, and manage the list of analyzed URLs. The stack includes a React frontend and a Go backend with a MySQL database and Docker containerziation.

## Features

- **Add URLs** for analysis (with frontend validation)
- **Crawl URLs** in the background (Go worker)
- **View analysis results**: HTML version, title, headings, internal/external/broken links, login form detection
- **Reanalyze, stop, or delete** selected URLs
- **Real-time status updates** (with polling)
- **Responsive, modern UI** (React + Tailwind CSS)
- **Robust error handling**

## Tech Stack

### Frontend

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [@tailwindcss/vite](https://www.npmjs.com/package/@tailwindcss/vite)
- [@tanstack/react-query](https://tanstack.com/query/latest)
- [Chart.js](https://www.chartjs.org/) & [react-chartjs-2](https://react-chartjs-2.js.org/)
- [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/)

### Backend

- [Go](https://go.dev/)
- [Gin Web Framework](https://gin-gonic.com/)
- [MySQL](https://www.mysql.com/) (via [go-sql-driver/mysql](https://github.com/go-sql-driver/mysql))

### Dev & Tooling

- [Docker](https://www.docker.com/) (for MySQL)
- [ESLint](https://eslint.org/) plugins: jsx-a11y, prettier, react, react-hooks, react-refresh, react-x
- [TypeScript ESLint](https://typescript-eslint.io/)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Go (v1.18+)
- Docker (for MySQL, optional if you have MySQL locally)

### Setup

#### 1. Clone the repository

```bash
git clone "https://github.com/Xenonyy/sykell-assignment"
cd sykell-assignment
```

#### 2. Start the MySQL database

```bash
cd backend
docker-compose up -d
```

#### 3. Initialize the database

```bash
# In backend/
go run main.go
# The app will auto-create tables if not present (see schema.sql)
```

#### 4. Start the backend server

```bash
go run main.go
```

#### 5. Start the frontend

```bash
cd ..
npm install
npm run dev
```

The frontend will be available at [http://localhost:5173](http://localhost:5173) and the backend at [http://localhost:8080](http://localhost:8080).

## Usage

- Enter a valid URL (must start with `http://` or `https://`) and click **Start** to queue it for analysis.
- Select one or more URLs using the checkboxes to **Re-analyze**, **Stop**, or **Delete** them.
- Click on a URL row to view a chart and a list of broken links with status codes.
- The status of each URL updates in real-time.

## Project Structure

```
sykell-assignment/
  backend/         # Go backend (API, worker, DB models)
  frontend/        # React frontend (components, hooks, types)
  ...
```

## Challenge Reference

This project implements all requirements from the official Sykell fullstack challenge:  
[https://github.com/sykell/careers/blob/main/challenges/fullstack/task.md](https://github.com/sykell/careers/blob/main/challenges/fullstack/task.md)
