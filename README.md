# QR Code Generator

Free QR code generator with optional URL shortening. Dark UI, no limits, no sign-up, no ads.

**Features:**
- URL, text, email, phone — anything goes
- Optional built-in URL shortener for long links
- Adjustable size (100–800px) and error correction level
- Custom dark/light colors
- Download as PNG or SVG
- Copy PNG or the generated short URL
- Runs locally with SQLite by default

## Run with Docker (recommended)

```bash
docker compose up -d
```

Open [http://localhost:4242](http://localhost:4242)

### Local short-link storage

Docker Compose uses a named volume and stores short links in SQLite at `/app/data/shortener.sqlite`.

If you want the generated links to use a public hostname, set:

```bash
SHORT_BASE_URL=https://s.maniak.io
```

## Run without Docker

```bash
npm install
npm start
```

Requires Node.js 18+.

By default the app uses SQLite locally. Override if needed:

```bash
SHORT_STORAGE=sqlite
SHORT_DB_PATH=./data/shortener.sqlite
SHORT_BASE_URL=http://localhost:4242
```

## Production on Cloud Run

This repo includes Terraform for Cloud Run. In production the app is configured to use **Firestore** for durable short-link storage and serves:

- `https://qr.maniak.io` → QR generator UI
- `https://s.maniak.io/<code>` → short redirects

## Build the image manually

```bash
docker build -t qr-generator .
docker run -p 4242:4242 qr-generator
```
