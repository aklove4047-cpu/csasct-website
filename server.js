// ============================================================
// server.js — Express Static Server for Render Deployment
// Chakravarti Samrat Ashok Sena Charitable Trust
// ============================================================

const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// Serve all static files from current directory
app.use(express.static(path.join(__dirname), {
  setHeaders: (res, filePath) => {
    // Cache static assets
    if (filePath.endsWith('.css') || filePath.endsWith('.js')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
    if (filePath.endsWith('.png') || filePath.endsWith('.jpg') || filePath.endsWith('.webp')) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  }
}));

// All routes serve index.html (SPA support)
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
