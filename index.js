const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Basic route
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OAuth Demo</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .container {
          background: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
          color: #333;
          text-align: center;
        }
        .status {
          background: #d4edda;
          color: #155724;
          padding: 15px;
          border-radius: 4px;
          margin: 20px 0;
          text-align: center;
        }
        .button {
          display: inline-block;
          background: #007bff;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 4px;
          margin: 10px;
        }
        .button:hover {
          background: #0056b3;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>OAuth Demo Application</h1>
        <div class="status">
          ✅ Server is running successfully!
        </div>
        <p>This is a basic OAuth demonstration application. The server is up and running on port ${PORT}.</p>
        <div style="text-align: center;">
          <a href="/health" class="button">Check Health</a>
          <a href="/api/status" class="button">API Status</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API status endpoint
app.get("/api/status", (req, res) => {
  res.json({
    application: "oauth-demo",
    version: "1.0.0",
    status: "running",
    port: PORT,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`OAuth Demo server is running on http://localhost:${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});
