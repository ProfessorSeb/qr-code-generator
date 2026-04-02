# QR Code Generator

Free, local QR code generator. Dark UI, no limits, no sign-up, no ads.

**Features:**
- URL, text, email, phone — anything goes
- Adjustable size (100–800px) and error correction level
- Custom dark/light colors
- Download as PNG or SVG
- Copy to clipboard
- Runs entirely on your machine

## Run with Docker (recommended)

```bash
docker compose up -d
```

Open [http://localhost:4242](http://localhost:4242)

## Run without Docker

```bash
npm install
npm start
```

Requires Node.js 18+.

## Build the image manually

```bash
docker build -t qr-generator .
docker run -p 4242:4242 qr-generator
```
