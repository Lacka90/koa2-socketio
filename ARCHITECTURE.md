# Architecture Documentation — koa2-socketio

## Overview

A **Node.js real-time backend** built with Koa2 and Socket.IO, designed to support WebRTC peer-to-peer signaling between users. It exposes a REST API for authentication and room management, and a WebSocket layer for real-time call signaling. A pre-built Ionic/Angular frontend is served as static files.

---

## Tech Stack

| Concern | Technology |
|---|---|
| Runtime | Node.js 7.9 |
| Language | TypeScript 2.x |
| HTTP Framework | Koa2 |
| Real-time | Socket.IO 1.x |
| Database | MongoDB via Mongoose 4.x |
| Auth | JWT (jsonwebtoken, HS256) |
| Build | Gulp 4 + gulp-typescript |
| Test | Mocha + Supertest + Mockgoose |
| Config | Convict + dotenv |

---

## Layered Architecture

```
┌──────────────────────────────────────────────────┐
│                   Clients                        │
│         (Browser / Ionic App / WebSocket)        │
└───────────────────────┬──────────────────────────┘
                        │ HTTP / WebSocket
┌───────────────────────▼──────────────────────────┐
│               server.ts  (Koa App)               │
│  Middleware stack:                               │
│    error handler → bodyParser → static files    │
│    → helmet → jwtMiddleware → /api mount        │
└──────┬──────────────────────────┬────────────────┘
       │ HTTP                     │ WebSocket
┌──────▼──────┐           ┌───────▼────────┐
│  API Layer  │           │  Socket Layer  │
│  api/v1/    │           │  socket.ts     │
└──────┬──────┘           └───────┬────────┘
       │                          │
┌──────▼──────────────────────────▼────────────────┐
│               Services Layer                     │
│   AuthService  │  UserService  │  RoomService    │
│                (Singleton pattern)               │
└──────────────────────────┬───────────────────────┘
                           │
┌──────────────────────────▼───────────────────────┐
│                 DAL Layer                        │
│    AuthDao  │  UserDao  │  RoomDao               │
│                (Singleton pattern)               │
└──────────────────────────┬───────────────────────┘
                           │
┌──────────────────────────▼───────────────────────┐
│              Database Layer                      │
│    Mongoose Models: User, Room                   │
│    MongoDB (real) / Mockgoose (test)             │
└──────────────────────────────────────────────────┘
```

---

## Startup Sequence

```
index.ts
  └─ databaseInit()          # Connect to MongoDB (or Mockgoose in test)
       └─ start()            # Build Koa app with middleware stack
            └─ socketInit()  # Wrap Koa with http.Server + attach Socket.IO
                 └─ app.listen(host, port)
```

---

## HTTP API

Base path: `/api/v1`

### Auth — `/api/v1/auth`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/login` | No | Returns a signed JWT |
| POST | `/register` | No | Creates a new user |
| GET | `/whoami` | JWT | Returns current user (password omitted) |

### User — `/api/v1/user`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/available` | JWT | Lists online users (have a socketId, excluding self) |

### Room — `/api/v1/room`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/offer` | JWT | Creates/updates a room with a WebRTC offer SDP |
| POST | `/answer` | JWT | Connects to a room with a WebRTC answer SDP; emits `userCalling` via Socket.IO |
| GET | `/` | JWT | Gets the authenticated user's room |
| GET | `/:userId` | No | Gets a room by user ID |

### Status — `/api/v1/status`
| Method | Path | Description |
|---|---|---|
| (see file) | `/status` | Health check endpoint |

---

## WebSocket Layer (`socket.ts`)

Socket.IO listens on the same HTTP server as Koa. Authentication is done via `userId` query parameter on handshake — the server resolves the user and stores their `socket.id`.

### Events

| Direction | Event | Description |
|---|---|---|
| Client → Server | `offerCall` | Creates a room with a WebRTC offer |
| Client → Server | `answerCall` | Connects to a room with an answer; emits `userCalling` to the caller |
| Server → Client | `userCalling` | Notifies the caller that the callee answered |
| Server → All | `userDisconnected` | Broadcast when a user disconnects |

> Note: The room offer/answer logic is duplicated between the REST API (`/room/offer`, `/room/answer`) and the Socket.IO events (`offerCall`, `answerCall`).

---

## Authentication & Security

- **JWT middleware** (`jwtMiddleware.ts`) runs on every request. If a `Bearer` token is present in the `Authorization` header, it is verified and `ctx.userId` is populated. Requests without a token still proceed (routes self-enforce authorization).
- **Password encoding** uses Base64 (not a secure hash). This is a known weakness.
- **Helmet** (`koa-helmet`) sets security-related HTTP headers.
- **Socket auth** requires `userId` as a query param on connection; no token verification is done at the socket level.

---

## Data Models

### User
| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `username` | String | Unique index |
| `password` | String | Base64-encoded |
| `socketId` | String | Current Socket.IO connection ID; `null` when offline |

### Room
| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `owner` | ObjectId | Ref to User; unique (one room per user) |
| `offer` | String | WebRTC SDP offer |
| `answer` | String | WebRTC SDP answer |

---

## Design Patterns

- **Singleton services & DAOs** — All service and DAO classes expose a static `getInstance()` method, ensuring a single instance per process.
- **Layered separation** — Routes delegate entirely to Services, which delegate entirely to DAOs. No database access in routes or services directly (except UserService cross-referencing RoomDao for available user logic).
- **Module aliasing** — `@core` maps to `dist/` at runtime via `module-alias`, allowing absolute imports.
- **Versioned API** — The router is structured for future API versions under `/api/v1`, `/api/v2`, etc.

---

## Configuration

Managed by **Convict**, loaded from `config/{env}.json`. Environment variables override file values.

| Key | Env Var | Default |
|---|---|---|
| `host` | `HOST` | `127.0.0.1` |
| `port` | `PORT` | `3000` |
| `database.url` | `DB_URL` | `mongodb://localhost:32773` |
| `database.collectionName` | `DB_COLLECTION` | `default-webrtc` |
| `jwt.secret` | `JWT_SECRET` | `sajtospiciponi` |
| `jwt.expires` | `JWT_EXPIRE` | `1h` |
| `jwt.algorithm` | `JWT_ALGORITHM` | `HS256` |

---

## Testing

- **Framework**: Mocha + Supertest
- **DB mocking**: Mockgoose wraps Mongoose with an in-memory MongoDB when `NODE_ENV=test`
- Test files co-located with source as `*.spec.ts`
- Run with: `NODE_ENV=test mocha --compilers ts:ts-node/register 'src/**/*.spec.ts'`
