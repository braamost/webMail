# webMail

A full-stack webmail client built with **Spring Boot** and **React**, supporting user
accounts, contacts, and email composition with file attachments and profile photos.

## Overview

webMail is a self-contained email platform: users register an account, exchange emails
with other registered users, organize mail across folders (Inbox, Sent, Starred, Spam,
Trash, Archive, Draft), manage a personal contact list, and attach files to messages.
Every account also supports a profile photo.

The system is built as a REST API backend consumed by a single-page React frontend,
with authentication, authorization, and file storage all handled server-side.

---

## Features

**Accounts & Security**
- Registration and login, with BCrypt-hashed passwords
- Stateless authentication via JSON Web Tokens (JWT), sent as a Bearer token on every
  request
- Ownership-based authorization on every resource — a user can only read or modify
  their own profile, contacts, emails, and attachments, independent of simply holding a
  valid token
- Optional profile photo, uploadable at registration or afterward

**Email**
- Compose, send, and receive emails between registered users
- Drafts, saved and editable before sending
- Folder system: Inbox, Sent, Starred, Spam, Trash, Archive, Draft
- File attachments per email, with type and size validation on upload

**Contacts**
- Add, view, and remove personal contacts
- New contacts are validated against existing registered users by email

**File Storage**
- Pluggable storage backend (local disk or Amazon S3) behind a single storage
  abstraction — the rest of the application never needs to know which backend is active
- Uploaded files are renamed to random identifiers and checked against an
  extension/MIME-type allowlist and size limit before being stored, regardless of
  backend

**API Documentation**
- Interactive API docs available via Swagger UI (springdoc-openapi)

---

## Data Model

The schema is built around five core tables:

- **users** — account records: username, email, hashed password, phone number, profile
  photo reference.
- **emails** — the message content itself (subject, body, timestamps, read/starred
  flags, direction, folder). Sending an email creates two linked rows — one flagged
  `SENT` for the sender's copy, one flagged `RECEIVED` for the recipient's — so each
  party can independently move, mark, or delete their own copy without affecting the
  other's.
- **user_emails** — a join table connecting a sender, a receiver, and an email,
  modeling the sender/receiver relationship for each message.
- **attachments** — files linked to a specific email, storing metadata and a reference
  into the file storage layer rather than raw file bytes.
- **contacts** — a user's personal address book entries, each linked back to its owner.

Moving a message between most folders (starred, read) simply updates a flag on the
existing row; moving to Trash, Archive, or Spam relocates it to that folder while
preserving its history. Schema changes are tracked and applied through versioned
database migrations rather than a single static script.

---

## Tech Stack

### Backend
| Component | Choice |
|---|---|
| Language / Runtime | Java 25 |
| Framework | Spring Boot 4.1 (Web, Security, Data JPA, Validation) |
| Database | MySQL |
| Schema migrations | Flyway |
| Authentication | JWT (jjwt) + BCrypt |
| Object mapping | MapStruct |
| Boilerplate reduction | Lombok |
| File storage | Local filesystem or AWS S3 (pluggable) |
| API docs | springdoc-openapi (Swagger UI) |
| Build tool | Maven (via Maven Wrapper) |

### Frontend
| Component | Choice |
|---|---|
| Framework | React 18 |
| Build tool | Vite |
| Styling | Tailwind CSS |
| HTTP client | Axios (centralized client with request/response interceptors) |
| Routing | React Router |

---

## Architecture

The backend follows a layered architecture:

```
Controller (REST)  →  Service (business logic)  →  Repository (Spring Data JPA)  →  Database
```

- **Controllers** parse HTTP input and delegate to a single service call per action —
  business logic and database lookups live in the service layer, not here.
- **Services** own business rules, sharing cross-cutting checks (ownership, existence,
  input validation) through a common `ValidationService`.
- **DTOs**, mapped via MapStruct, define the exact shape of data crossing the API
  boundary — entities are never serialized directly to clients.
- **Storage** is abstracted behind a common interface with local-disk and S3
  implementations, used through a single service so the rest of the app is indifferent
  to where a file physically lives.

---

## Project Structure

```
webMail/
├── back/                        Spring Boot backend
│   ├── src/main/java/com/mail/back/
│   │   ├── Configuration/       App-level configuration beans
│   │   ├── DAO/                 Spring Data JPA repositories
│   │   ├── DTO/                 Request/response objects + MapStruct mapper
│   │   ├── entity/              JPA entities
│   │   ├── GlobalHandle/        Centralized exception handling
│   │   ├── REST/                REST controllers, grouped by resource
│   │   ├── Security/            JWT generation/validation, security filter chain
│   │   ├── Service/             Business logic, one package per resource
│   │   │   └── Validation/      Shared ownership/existence/input validation
│   │   └── Storage/             Pluggable file storage abstraction
│   └── src/main/resources/
│       ├── application.properties
│       └── db/migration/        Flyway migration scripts
│
└── front/                       React + Vite frontend
    └── src/
        ├── LoginHandling/
        ├── RegisterHandling/
        ├── NewMail/
        ├── EmailTable/, EmailPage/
        ├── MyContacts/
        ├── UserFolder/
        └── utils/                Centralized API client
```

---

## Getting Started

### Prerequisites
- Java 25 (Eclipse Temurin or equivalent)
- Maven (use the bundled `./mvnw` wrapper — no separate install needed)
- Node.js and npm
- MySQL 8+

### Backend Setup

1. Create a MySQL database for the project.
2. Create `back/src/main/resources/application-local.properties` (gitignored, never
   committed) with your local values:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/<your_db_name>
   spring.datasource.username=<your_db_username>
   spring.datasource.password=<your_db_password>
   ```
3. Set a JWT signing secret as an environment variable (at least 256 bits, e.g.
   generated with `openssl rand -base64 32`):
   ```
   export JWT_SECRET=<your-generated-secret>
   ```
4. From `back/`, run:
   ```
   ./mvnw spring-boot:run
   ```
   Database migrations are applied automatically on startup. The API starts on
   `http://localhost:8080` by default.

**Optional — cloud file storage:** to use S3 instead of local disk, set
`storage.type=cloud` along with `S3_BUCKET` and `AWS_REGION` environment variables, and
ensure AWS credentials are available via the standard AWS credential provider chain.

### Frontend Setup

From `front/`:
```
npm install
npm run dev
```
The app starts on `http://localhost:5173` by default.

### API Documentation

With the backend running, interactive API documentation is available at:
```
http://localhost:8080/swagger-ui/index.html
```

---

## Contributors

webMail was originally built and has been maintained by a small team of student
developers.
