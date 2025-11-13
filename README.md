# API Bookstore

Enterprise-grade RESTful API for library management systems, built with Node.js, TypeScript, Express, and PostgreSQL. Features comprehensive book, client, and loan management with automated image processing and containerized deployment.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Management](#database-management)
- [API Documentation](#api-documentation)
- [Docker Deployment](#docker-deployment)
- [Development](#development)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Overview

The API Bookstore is a robust backend solution designed for library and bookstore management. It implements a complete MVC architecture with TypeORM for database abstraction, automated image optimization, comprehensive validation, and production-ready containerization.

### Key Capabilities

- Full CRUD operations for books, clients, and loans
- Automated book cover image processing with Sharp (WebP/JPEG compression, intelligent resizing)
- Real-time inventory tracking and loan status management
- RESTful API design with comprehensive error handling
- TypeScript for type safety and enhanced developer experience
- Docker containerization with multi-service orchestration
- Database migrations and seeding utilities
- Production-ready configuration with graceful shutdown handlers

## Architecture

### Design Pattern

The application follows the **Model-View-Controller (MVC)** architectural pattern:

- **Models (Entities)**: TypeORM entities representing database tables with validation decorators
- **Controllers**: Business logic layer handling HTTP requests and responses
- **Routes**: API endpoint definitions with middleware integration
- **DTOs**: Data Transfer Objects for request/response validation
- **Middlewares**: Request validation, error handling, and file upload processing

### Component Layers

1. **Presentation Layer** (Routes + Controllers)
   - RESTful endpoint definitions
   - Request/response handling
   - HTTP status code management

2. **Business Logic Layer** (Controllers + Services)
   - Data validation and transformation
   - Business rule enforcement
   - Transaction management

3. **Data Access Layer** (TypeORM + Entities)
   - Database abstraction
   - Query optimization
   - Relationship management

4. **Infrastructure Layer** (Config + Middlewares)
   - Database connections
   - File upload handling
   - Error management
   - Logging

## Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18.x | JavaScript runtime environment |
| TypeScript | 5.1+ | Type-safe JavaScript superset |
| Express | 4.18+ | Web application framework |
| PostgreSQL | 16.x | Relational database system |
| TypeORM | 0.3+ | ORM for database operations |
| Docker | Latest | Containerization platform |

### Key Dependencies

**Production:**
- `express` - Web framework
- `typeorm` - ORM with TypeScript support
- `pg` - PostgreSQL client
- `class-validator` - Decorator-based validation
- `class-transformer` - Object transformation
- `multer` - Multipart form data handling
- `sharp` - High-performance image processing
- `dotenv` - Environment variable management
- `cors` - Cross-Origin Resource Sharing
- `reflect-metadata` - Metadata reflection API

**Development:**
- `typescript` - TypeScript compiler
- `ts-node` - TypeScript execution engine
- `ts-node-dev` - Development server with auto-reload
- `@types/*` - TypeScript type definitions

## Features

### Book Management

- **Comprehensive CRUD Operations**
  - Create, read, update, and delete books
  - 30 predefined book categories (Romance, Science Fiction, Technology, etc.)
  - Real-time inventory tracking
  - Rental status management

- **Advanced Image Processing**
  - Automatic image compression (60-80% size reduction)
  - WebP and JPEG format support
  - Intelligent resizing (max 1200px, maintains aspect ratio)
  - EXIF metadata removal for privacy
  - Temporary file cleanup
  - Support for JPG, PNG, WebP uploads (max 15MB)

- **Validation Rules**
  - Required fields: title, author, publication year
  - Year range validation
  - Category enumeration
  - Stock quantity constraints

### Client Management

- **Client Registration**
  - Full CRUD operations
  - Unique email validation
  - Contact information storage
  - Loan history tracking

- **Data Validation**
  - Email format validation
  - Required field enforcement
  - String length constraints

### Loan Management

- **Loan Operations**
  - Create and manage book loans
  - Three-state status system (active, returned, overdue)
  - Automatic stock updates
  - Date-based validation
  - Overdue detection

- **Business Rules**
  - Availability verification before loan creation
  - Stock decrement on loan creation
  - Stock increment on loan return
  - Rental status synchronization

### Infrastructure Features

- **Error Handling**
  - Centralized error middleware
  - HTTP status code standardization
  - Detailed error messages
  - Request validation errors
  - File upload error handling

- **Database Management**
  - Automatic schema synchronization
  - Migration system
  - Database seeding utilities
  - Connection pooling
  - Query logging

- **File Management**
  - Automatic directory creation
  - Unique filename generation
  - Static file serving
  - Temporary file cleanup
  - Path security

## Project Structure

```
api-bookstore/
├── src/
│   ├── config/
│   │   ├── database.ts          # TypeORM configuration
│   │   └── multer.ts            # File upload and image processing
│   ├── controllers/
│   │   ├── BaseController.ts    # Abstract base controller
│   │   ├── BookController.ts    # Book operations
│   │   ├── ClientController.ts  # Client operations
│   │   └── LoanController.ts    # Loan operations
│   ├── database/
│   │   ├── init.ts              # Database initialization
│   │   ├── seed.ts              # Sample data seeding
│   │   └── cli.ts               # CLI utilities
│   ├── dtos/
│   │   ├── BookDTO.ts           # Book data transfer object
│   │   ├── ClientDTO.ts         # Client data transfer object
│   │   └── LoanDTO.ts           # Loan data transfer object
│   ├── entities/
│   │   ├── Book.ts              # Book entity model
│   │   ├── Client.ts            # Client entity model
│   │   └── Loan.ts              # Loan entity model
│   ├── middlewares/
│   │   └── validation.middleware.ts  # Request validation
│   ├── routes/
│   │   ├── index.ts             # Route aggregator
│   │   ├── bookRoutes.ts        # Book endpoints
│   │   ├── clientRoutes.ts      # Client endpoints
│   │   └── loanRoutes.ts        # Loan endpoints
│   ├── app.ts                   # Express application setup
│   └── server.ts                # Application entry point
├── uploads/
│   └── covers/                  # Book cover images
│       └── temp/                # Temporary upload directory
├── doc/                         # Comprehensive documentation
├── docker-compose.yml           # Multi-container orchestration
├── Dockerfile                   # Container build instructions
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── .env                         # Environment variables
└── README.md                    # Project documentation
```

## Installation

### Prerequisites

- Node.js 18.x or higher
- PostgreSQL 15.x or higher (or Docker)
- npm or pnpm package manager

### Local Setup

1. **Clone the repository**
```bash
git clone https://github.com/EdmirSoares/api-bookstore.git
cd api-bookstore
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration (see [Configuration](#configuration) section).

4. **Build the application**
```bash
npm run build
```

5. **Initialize the database**
```bash
npm run migration:run
npm run db:seed  # Optional: populate with sample data
```

6. **Start the server**
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3000`.

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Application
NODE_ENV=development          # development | production
PORT=3000                     # Server port

# Database (Local Development)
DB_HOST=localhost
DB_PORT=5434                  # External port (Docker: 5434, Local: 5432)
DB_USERNAME=user_example
DB_PASSWORD=password_example
DB_NAME=bookstore

# PostgreSQL (Docker)
POSTGRES_USER=user_example
POSTGRES_PASSWORD=user_example
POSTGRES_DB=bookstore

# File Upload
UPLOAD_PATH=./uploads         # Base directory for uploads
```

### Database Configuration

The application uses TypeORM with the following settings:

- **Type**: PostgreSQL
- **Synchronize**: `true` (auto-sync schema in development)
- **Logging**: `true` (log all queries)
- **Entities**: Automatically loaded from `entities/` directory
- **Migrations**: Located in `src/migrations/`

## Database Management

### Migrations

```bash
# Run pending migrations
npm run migration:run

# Generate new migration
npm run migration:generate -- -n MigrationName

# Create empty migration
npm run migration:create -- -n MigrationName
```

### Database Utilities

```bash
# Initialize database schema
npm run db:init

# Seed database with sample data
npm run db:seed

# Initialize and seed in one command
npm run db:init-seed
```

### Sample Data

The seeding utility creates:
- 10 sample books across different categories
- 5 sample clients
- Various loan records with different statuses

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Books Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/books` | List all books | - |
| GET | `/books/:id` | Get book by ID | - |
| POST | `/books` | Create new book |
| PUT | `/books/:id` | Update book |
| DELETE | `/books/:id` | Delete book | - |

**Book Object Schema:**
```json
{
  "title": "string (required)",
  "author": "string (required)",
  "publicationYear": "number (required)",
  "gender": "enum (required)",
  "qttEstoque": "number (default: 0)",
  "sobre": "string (optional)",
  "coverImage": "file (optional, max 15MB)"
}
```

**Book Categories:**
Romance, Ficção, Ficção Científica, Fantasia, Mistério, Thriller, Terror, Biografia, Autobiografia, História, Ciência, Filosofia, Psicologia, Autoajuda, Negócios, Tecnologia, Culinária, Viagem, Poesia, Drama, Comédia, Infantil, Jovem Adulto, Educação, Religião, Saúde, Esportes, Arte, Música, Outros

### Clients Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/clients` | List all clients | - |
| GET | `/clients/:id` | Get client by ID | - |
| POST | `/clients` | Create new client | Client object |
| PUT | `/clients/:id` | Update client | Client object |
| DELETE | `/clients/:id` | Delete client | - |

**Client Object Schema:**
```json
{
  "name": "string (required)",
  "email": "string (required, unique)",
  "phone": "string (optional)",
  "address": "string (optional)"
}
```

### Loans Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/loans` | List all loans | - |
| GET | `/loans/:id` | Get loan by ID | - |
| POST | `/loans` | Create new loan | Loan object |
| PUT | `/loans/:id` | Update loan | Loan object |
| DELETE | `/loans/:id` | Delete loan | - |

**Loan Object Schema:**
```json
{
  "bookId": "number (required)",
  "clientId": "number (required)",
  "loanDate": "date (required)",
  "returnDate": "date (required)",
  "actualReturnDate": "date (optional)",
  "status": "active | returned | overdue"
}
```

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | API health status |

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-11-13T00:00:00.000Z"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Successful operation |
| 201 | Resource created successfully |
| 400 | Bad request (validation error) |
| 404 | Resource not found |
| 413 | Payload too large (>15MB) |
| 500 | Internal server error |

## Docker Deployment

### Architecture

The application uses Docker Compose with two services:

1. **PostgreSQL Database** (postgres:16-alpine)
   - Port mapping: 5434:5432 (external:internal)
   - Persistent data volume
   - Automatic initialization

2. **Node.js API** (custom build)
   - Port mapping: 3000:3000
   - Depends on database service
   - Auto-restart policy
   - Automatic migrations on startup

### Quick Start

```bash
# Start all services
docker compose up -d

# View logs
docker logs -f bookstore_api
docker logs -f bookstore_db

# Stop all services
docker compose down

# Stop and remove volumes (reset database)
docker compose down -v
```

### Service Details

**PostgreSQL Service:**
```yaml
- Image: postgres:16-alpine
- Container: bookstore_db
- External Port: 5434
- Internal Port: 5432
- Volume: postgres_data (persistent)
- Network: bookstore_network
```

**API Service:**
```yaml
- Build: Dockerfile (multi-stage)
- Container: bookstore_api
- Port: 3000
- Restart: unless-stopped
- Command: migrations + start server
- Volume: ./uploads (host mounted)
```

### Database Access

**From Host (Beekeeper, pgAdmin, etc.):**
```
Host: localhost
Port: 5434
User: user_example
Password: password_example
Database: bookstore
```

**From API Container:**
```
Host: postgres (service name)
Port: 5432 (internal)
```

### Production Considerations

1. **Environment Variables**: Use Docker secrets or external configuration management
2. **SSL/TLS**: Enable PostgreSQL SSL in production
3. **Image Scanning**: Scan images for vulnerabilities before deployment
4. **Resource Limits**: Set CPU and memory limits in production
5. **Logging**: Configure external log aggregation
6. **Backups**: Implement automated database backups
7. **Monitoring**: Add health checks and monitoring

## Development

### Available Scripts

```bash
# Development
npm run dev              # Start with auto-reload (ts-node-dev)

# Build
npm run build            # Compile TypeScript to JavaScript

# Production
npm start                # Run compiled application

# Database
npm run migration:run    # Execute pending migrations
npm run migration:generate  # Generate migration from entities
npm run db:init          # Initialize database schema
npm run db:seed          # Populate with sample data
npm run db:init-seed     # Initialize and seed

# TypeORM CLI
npm run typeorm          # Direct TypeORM CLI access
```

### Development Workflow

1. **Create new feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make changes and test locally**
```bash
npm run dev
```

3. **Run database migrations if schema changed**
```bash
npm run migration:generate -- -n YourMigrationName
npm run migration:run
```

4. **Build and test production build**
```bash
npm run build
npm start
```

5. **Test with Docker**
```bash
docker compose up --build
```

### Code Style Guidelines

- Use TypeScript strict mode
- Follow ESLint rules (if configured)
- Use async/await for asynchronous operations
- Implement proper error handling
- Add JSDoc comments for public methods
- Use descriptive variable and function names
- Follow REST API naming conventions

### Adding New Entities

1. Create entity class in `src/entities/`
2. Create DTO in `src/dtos/`
3. Create controller in `src/controllers/`
4. Create routes in `src/routes/`
5. Add routes to `src/routes/index.ts`
6. Generate migration: `npm run migration:generate`
7. Run migration: `npm run migration:run`

## Testing

### Manual Testing

Use the provided Postman/Thunder Client collection or test with curl:

```bash
# Health check
curl http://localhost:3000/api/health

# List books
curl http://localhost:3000/api/books

# Create book
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Book","author":"Test Author","publicationYear":2025,"gender":"Outros","qttEstoque":10}'
```

### Database Testing

```bash
# Connect to PostgreSQL in Docker
docker exec -it bookstore_db psql -U bookstore_admin -d bookstore

# List tables
\dt

# Query books
SELECT * FROM books;

# Exit
\q
```

## License

This project is licensed under the MIT License. See LICENSE file for details.

---

**Documentation Version:** 1.0.0 
**Maintainer:** EdmirSoares
