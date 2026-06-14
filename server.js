// ============================================================
// server.js — Express Static Server for Render Deployment
// Chakravarti Samrat Ashok Sena Charitable Trust
// Domain: chakravartisamratashoksenacheritabletrust.online
// ============================================================

const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ---- SEO Headers Middleware ----
app.use((req, res, next) => {
  res.setHeader('X-Robots-Tag', 'index, follow');
  next();
});

// ---- Explicit SEO File Routes (must be BEFORE static middleware) ----
app.get('/sitemap.xml', (req, res) => {
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(__dirname, 'sitemap.xml'));
});

app.get('/robots.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(__dirname, 'robots.txt'));
});

// ---- Static Files ----
app.use(express.static(path.join(__dirname), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.css') || filePath.endsWith('.js')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
    if (filePath.endsWith('.png') || filePath.endsWith('.jpg') || filePath.endsWith('.webp')) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  }
}));

// ---- All other routes → index.html ----
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`
  ======================================================
  🏛️  Chakravarti Samrat Ashok Sena Charitable Trust
  🌐  Website running at: http://localhost:${PORT}
  ✅  Domain: chakravartisamratashoksenacheritabletrust.online
  ======================================================
  `);
});
