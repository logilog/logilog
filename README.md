# LogiLog MCP

LogiLog MCP is a secure SaaS starter kit that delivers authentication, subscription-ready billing hooks, and AI-assisted features powered by OpenAI. This repository contains the first production-ready backend release (v0.1.0) that we can iteratively extend into future versions.

## Features

- **FastAPI backend** with async SQLAlchemy and automatic schema creation.
- **Zero-trust security posture** using hashed passwords, JWT bearer tokens, and status-aware user models.
- **Trial-to-paid subscriptions** with 24-hour trial windows and quota enforcement.
- **Usage metering** with per-user token tracking for AI requests.
- **OpenAI integration** via a hardened HTTPX client ready for GPT-4 class models.
- **12-factor configuration** managed through environment variables.

## Getting started

### 1. Set environment variables

Create a `.env` file (or export variables) with at least the following values:

```env
SECRET_KEY="replace-with-long-random-string"
DATABASE_URL="sqlite+aiosqlite:///./logilog.db"
OPENAI_API_KEY="sk-your-key"
TRIAL_LENGTH_DAYS=1
```

> **Tip:** For production switch to a managed PostgreSQL instance, e.g. `postgresql+asyncpg://user:pass@host:5432/logilog`.

### 2. Install dependencies

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e .
```

### 3. Run the API server

```bash
uvicorn backend.app.main:app --reload
```

The OpenAPI docs are available at [http://localhost:8000/docs](http://localhost:8000/docs).

## API overview

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/auth/register` | `POST` | Register a new account with email, full name, and password. |
| `/api/auth/login` | `POST` | Exchange credentials for a JWT access token. |
| `/api/users/me` | `GET` | Fetch the authenticated user's profile and subscription. |
| `/api/subscriptions/trial` | `POST` | Begin a 24-hour trial (single use). |
| `/api/subscriptions/activate` | `POST` | Promote the user to premium (payment gateway hook placeholder). |
| `/api/ai/complete` | `POST` | Generate an AI response using the configured OpenAI model. |

Every protected endpoint requires the `Authorization: Bearer <token>` header from the login response.

## Project structure

```
backend/
  app/
    api/                # FastAPI routers grouped by concern
    core/               # Configuration, database, and security helpers
    models/             # SQLAlchemy ORM models
    schemas/            # Pydantic request/response models
    services/           # External integrations such as OpenAI
    main.py             # FastAPI application bootstrap
pyproject.toml          # Python package metadata & dependencies
```

## Next steps

- Wire `/api/subscriptions/activate` to a billing provider (Stripe, Paddle, etc.).
- Replace SQLite with a cloud-hosted PostgreSQL database for multi-user scale.
- Add background tasks for quota resets and lifecycle emails.
- Build a React or Next.js front-end that consumes these APIs.

## License

Released under the MIT License. See `LICENSE` if present in future revisions.
