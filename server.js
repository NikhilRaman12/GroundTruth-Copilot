
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('HEALTHY');
});

/**
 * SECURE BRIDGE: Environment configuration.
 * Only provides the essential bridge to process.env.API_KEY.
 * Hardened with security headers to prevent sniffing.
 */
app.get('/env-config.js', (req, res) => {
  const apiKey = process.env.API_KEY;
  
  res.set('Content-Type', 'application/javascript');
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('X-Frame-Options', 'DENY');
  
  if (!apiKey) {
    return res.send(`window.process = { env: { API_KEY: null } };`);
  }

  res.send(`window.process = { env: { API_KEY: "${apiKey}" } };`);
});

// Static file serving with strict security context
app.use(express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, path) => {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-Frame-Options', 'SAMEORIGIN');
  }
}));

// SPA Routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`GroundTruth Copilot Secure Core Online [Port ${port}]`);
});
