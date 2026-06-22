# Banking & Wealth Management System

A full-stack financial management application built with FastAPI, React, and PostgreSQL that enables users to manage bank accounts, investments, assets, and overall net worth through a centralized dashboard.

## Features

### User Management
- User registration and authentication
- Profile management
- Password update functionality

### Banking Operations
- Create and manage multiple bank accounts
- Deposit funds
- Withdraw funds
- Transfer funds between accounts
- View transaction history
- Real-time balance tracking

### Investment Management

#### Fixed Deposits (FD)
- Create and manage fixed deposits
- Track maturity amounts
- Close deposits

#### Recurring Deposits (RD)
- Create recurring deposits
- Record RD payments
- Track accumulated investments

#### Mutual Funds
- Add and manage mutual fund investments
- Track investment value

#### Stocks
- Add and manage stock investments
- Monitor portfolio holdings

### Asset Management
- Track personal assets such as:
  - Property
  - Vehicles
  - Gold
  - Other valuable assets
- Maintain asset details and values

### Dashboard & Analytics
- Net worth calculation
- Bank balance summary
- Investment portfolio overview
- Asset value tracking
- Consolidated financial insights

### System Features
- RESTful API architecture
- PostgreSQL database integration
- Data validation and integrity checks
- Responsive React user interface
- Secure transaction processing

## Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- Passlib
- Uvicorn

### Frontend
- React
- Axios
- React Router
- Tailwind CSS

### Tools
- Postman
- Git
- GitHub

## Database Schema

The application uses a normalized PostgreSQL database with the following core entities:

- Users
- Accounts
- Transactions
- Fixed Deposits
- Recurring Deposits
- RD Payments
- Mutual Funds
- Stocks
- Assets

Business rules include:
- Balance validation
- Insufficient funds checks
- Transfer validation
- Investment tracking
- Financial calculations
- Data integrity enforcement

## API Modules

### Users
- Register User
- Login User
- Update Profile
- Change Password

### Accounts
- Create Account
- View Accounts
- Account Details

### Transactions
- Deposit Funds
- Withdraw Funds
- Transfer Funds
- View Transaction History

### Fixed Deposits
- Create FD
- View FDs
- Close FD

### Recurring Deposits
- Create RD
- Record RD Payments
- View RDs

### Mutual Funds
- Add Investment
- View Portfolio

### Stocks
- Add Investment
- View Portfolio

### Assets
- Add Asset
- View Assets
- Update Asset Details

### Dashboard
- Financial Summary
- Net Worth Calculation

## Project Structure

```text
banking-wealth-management-system/
│
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routers/
│   │   ├── database/
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── api/
│   │   └── App.jsx
│   │
│   └── package.json
│
└── README.md
```

## Installation

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Key Highlights

- Developed a full-stack banking and wealth management system using React, FastAPI, PostgreSQL, and SQLAlchemy.
- Implemented RESTful APIs for banking operations, investment tracking, and asset management.
- Designed a normalized relational database with financial validation rules and transaction integrity checks.
- Built responsive dashboards for net-worth analysis and portfolio monitoring.
- Performed end-to-end API testing using Postman and integrated frontend-backend communication through Axios.

## Author

**Nandha Biju**  
B.Tech Computer Science and Engineering 
