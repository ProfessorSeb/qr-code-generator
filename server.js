const express = require('express');
const QRCode = require('qrcode');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QR Generator</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0f0f0f;
      color: #e8e8e8;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .container {
      width: 100%;
      max-width: 520px;
    }
    h1 {
      font-size: 1.4rem;
      font-weight: 600;
      letter-spacing: -0.02em;
      margin-bottom: 0.25rem;
      color: #fff;
    }
    .subtitle {
      font-size: 0.8rem;
      color: #555;
      margin-bottom: 2rem;
    }
    label {
      display: block;
      font-size: 0.75rem;
      font-weight: 500;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }
    textarea {
      width: 100%;
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      color: #e8e8e8;
      font-size: 0.95rem;
      padding: 0.75rem 1rem;
      resize: vertical;
      min-height: 80px;
      outline: none;
      transition: border-color 0.15s;
      font-family: inherit;
    }
    textarea:focus { border-color: #444; }
    .row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-top: 1rem;
    }
    .field { display: flex; flex-direction: column; }
    select, input[type=range], input[type=color] {
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      color: #e8e8e8;
      padding: 0.6rem 0.75rem;
      font-size: 0.9rem;
      outline: none;
      width: 100%;
    }
    input[type=range] { padding: 0.4rem 0; cursor: pointer; accent-color: #7c6ff7; }
    .color-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-top: 1rem;
    }
    .color-picker {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      padding: 0.5rem 0.75rem;
    }
    input[type=color] {
      width: 28px;
      height: 28px;
      padding: 0;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: none;
    }
    .color-val { font-size: 0.8rem; color: #888; font-family: monospace; }
    button {
      margin-top: 1.5rem;
      width: 100%;
      background: #7c6ff7;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 0.8rem;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s, transform 0.1s;
    }
    button:hover { background: #6a5de8; }
    button:active { transform: scale(0.98); }
    .output {
      margin-top: 2rem;
      display: none;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    .output.visible { display: flex; }
    .qr-wrap {
      background: #fff;
      border-radius: 12px;
      padding: 1rem;
      display: inline-block;
    }
    .qr-wrap img { display: block; }
    .actions {
      display: flex;
      gap: 0.75rem;
    }
    .btn-dl {
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      color: #e8e8e8;
      border-radius: 8px;
      padding: 0.55rem 1.1rem;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
      transition: border-color 0.15s;
    }
    .btn-dl:hover { border-color: #444; }
    .error {
      margin-top: 1rem;
      color: #f87171;
      font-size: 0.85rem;
      display: none;
    }
    .built-with {
      margin-top: 3rem;
      text-align: center;
      font-size: 0.7rem;
      color: #444;
      letter-spacing: 0.03em;
    }
    .built-with a {
      color: #666;
      text-decoration: none;
      transition: color 0.15s;
    }
    .built-with a:hover { color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <h1>⬛ QR Generator</h1>
    <p class="subtitle">Free, local, no limits.</p>

    <label for="text">Content</label>
    <textarea id="text" placeholder="URL, text, email, phone, anything..."></textarea>

    <div class="row">
      <div class="field">
        <label for="size">Size (px) — <span id="sizeVal">300</span></label>
        <input type="range" id="size" min="100" max="800" value="300" step="50">
      </div>
      <div class="field">
        <label for="ecLevel">Error Correction</label>
        <select id="ecLevel">
          <option value="L">Low (L)</option>
          <option value="M" selected>Medium (M)</option>
          <option value="Q">Quartile (Q)</option>
          <option value="H">High (H)</option>
        </select>
      </div>
    </div>

    <div class="color-row">
      <div class="field">
        <label>Dark color</label>
        <div class="color-picker">
          <input type="color" id="darkColor" value="#000000">
          <span class="color-val" id="darkVal">#000000</span>
        </div>
      </div>
      <div class="field">
        <label>Light color</label>
        <div class="color-picker">
          <input type="color" id="lightColor" value="#ffffff">
          <span class="color-val" id="lightVal">#ffffff</span>
        </div>
      </div>
    </div>

    <button id="genBtn">Generate QR Code</button>
    <div class="error" id="error"></div>

    <div class="output" id="output">
      <div class="qr-wrap"><img id="qrImg" src="" alt="QR Code"></div>
      <div class="actions">
        <a class="btn-dl" id="dlPng" download="qrcode.png">↓ PNG</a>
        <a class="btn-dl" id="dlSvg" download="qrcode.svg">↓ SVG</a>
        <button class="btn-dl" id="copyBtn" style="border:1px solid #2a2a2a;background:#1a1a1a;width:auto;margin:0">Copy PNG</button>
      </div>
    </div>

    <div class="built-with">
      Built with AI agents · <a href="https://github.com/openclaw/openclaw" target="_blank" rel="noopener">#openclaw</a>
    </div>
  </div>

  <script>
    const sizeEl = document.getElementById('size');
    const sizeVal = document.getElementById('sizeVal');
    sizeEl.addEventListener('input', () => sizeVal.textContent = sizeEl.value);

    const darkEl = document.getElementById('darkColor');
    const lightEl = document.getElementById('lightColor');
    darkEl.addEventListener('input', () => document.getElementById('darkVal').textContent = darkEl.value);
    lightEl.addEventListener('input', () => document.getElementById('lightVal').textContent = lightEl.value);

    document.getElementById('genBtn').addEventListener('click', generate);
    document.getElementById('text').addEventListener('keydown', e => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) generate();
    });

    async function generate() {
      const text = document.getElementById('text').value.trim();
      const errEl = document.getElementById('error');
      errEl.style.display = 'none';
      if (!text) { errEl.textContent = 'Enter some content first.'; errEl.style.display = 'block'; return; }

      const params = new URLSearchParams({
        text,
        size: sizeEl.value,
        ec: document.getElementById('ecLevel').value,
        dark: darkEl.value,
        light: lightEl.value,
      });

      try {
        const res = await fetch('/qr?' + params);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Generation failed');

        const img = document.getElementById('qrImg');
        img.src = data.png;
        img.width = img.height = parseInt(sizeEl.value);

        document.getElementById('dlPng').href = data.png;
        document.getElementById('dlSvg').href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(data.svg);

        document.getElementById('output').classList.add('visible');

        document.getElementById('copyBtn').onclick = async () => {
          const blob = await (await fetch(data.png)).blob();
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          document.getElementById('copyBtn').textContent = 'Copied!';
          setTimeout(() => document.getElementById('copyBtn').textContent = 'Copy PNG', 1500);
        };
      } catch (e) {
        errEl.textContent = e.message;
        errEl.style.display = 'block';
      }
    }
  </script>
</body>
</html>`);
});

app.get('/qr', async (req, res) => {
  const { text, size = 300, ec = 'M', dark = '#000000', light = '#ffffff' } = req.query;
  if (!text) return res.status(400).json({ error: 'text is required' });

  const opts = {
    errorCorrectionLevel: ec,
    width: parseInt(size),
    color: { dark, light },
    margin: 1,
  };

  try {
    const [png, svg] = await Promise.all([
      QRCode.toDataURL(text, opts),
      QRCode.toString(text, { ...opts, type: 'svg' }),
    ]);
    res.json({ png, svg });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

const PORT = 4242;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`QR Generator running → http://localhost:${PORT}`);
});
