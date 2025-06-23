const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const {
  OAUTH_CONFIG,
  generatePKCEParams,
  buildAuthorizationUrl,
  exchangeCodeForTokens,
  getUserInfo,
} = require("./oauth-utils");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret:
      process.env.SESSION_SECRET || "demo-session-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
);

// Serve static files
app.use(express.static("public"));

// Home page - shows login or dashboard based on auth status
app.get("/", (req, res) => {
  const isAuthenticated = req.session.user !== undefined;

  if (isAuthenticated) {
    // Redirect to dashboard if already logged in
    return res.redirect("/dashboard");
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OAuth2 PKCE Demo</title>
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
          text-align: center;
        }
        .title {
          color: #333;
          margin-bottom: 10px;
        }
        .subtitle {
          color: #666;
          margin-bottom: 30px;
        }
        .login-button {
          display: inline-block;
          background: #007bff;
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        .login-button:hover {
          background: #0056b3;
        }
        .config-info {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          padding: 20px;
          margin-top: 30px;
          text-align: left;
        }
        .config-title {
          font-weight: bold;
          margin-bottom: 10px;
          color: #495057;
        }
        .config-item {
          margin: 5px 0;
          font-family: monospace;
          font-size: 14px;
          color: #6c757d;
        }
        .demo-note {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 4px;
          padding: 15px;
          margin-top: 20px;
          color: #856404;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1 class="title">OAuth2 PKCE Demo</h1>
        <p class="subtitle">Secure OAuth2 Authorization Code flow with PKCE</p>
        
        <a href="/oauth/login" class="login-button">Login with OAuth2</a>
        
        <div class="demo-note">
          <strong>Demo Mode:</strong> This is a demonstration using mock OAuth endpoints. 
          In a real application, configure the environment variables below to connect to your OAuth provider.
        </div>
        
        <div class="config-info">
          <div class="config-title">Current OAuth2 Configuration:</div>
          <div class="config-item">Client ID: ${OAUTH_CONFIG.client_id}</div>
          <div class="config-item">Auth URL: ${OAUTH_CONFIG.authorization_endpoint}</div>
          <div class="config-item">Token URL: ${OAUTH_CONFIG.token_endpoint}</div>
          <div class="config-item">UserInfo URL: ${OAUTH_CONFIG.userinfo_endpoint}</div>
          <div class="config-item">Redirect URI: ${OAUTH_CONFIG.redirect_uri}</div>
          <div class="config-item">Scope: ${OAUTH_CONFIG.scope}</div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Initiate OAuth login
app.get("/oauth/login", (req, res) => {
  try {
    const { codeVerifier, codeChallenge, state } = generatePKCEParams();

    // Store PKCE parameters in session
    req.session.oauth = {
      codeVerifier,
      state,
      timestamp: Date.now(),
    };

    const authUrl = buildAuthorizationUrl(codeChallenge, state);

    // In demo mode, show what would happen
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OAuth2 Authorization - Demo Mode</title>
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
          .title {
            color: #333;
            text-align: center;
            margin-bottom: 20px;
          }
          .demo-box {
            background: #e7f3ff;
            border: 1px solid #b3d9ff;
            border-radius: 4px;
            padding: 20px;
            margin: 20px 0;
          }
          .auth-url {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            padding: 15px;
            font-family: monospace;
            font-size: 12px;
            word-break: break-all;
            margin: 10px 0;
          }
          .button {
            display: inline-block;
            background: #28a745;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
            margin: 10px 5px;
          }
          .button-secondary {
            background: #6c757d;
          }
          .pkce-info {
            background: #f8f9fa;
            border-left: 4px solid #007bff;
            padding: 15px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="title">OAuth2 Authorization - Demo Mode</h1>
          
          <div class="demo-box">
            <h3>🚀 In a real OAuth flow, you would be redirected to:</h3>
            <div class="auth-url">${authUrl}</div>
          </div>
          
          <div class="pkce-info">
            <h4>PKCE Parameters Generated:</h4>
            <p><strong>Code Verifier:</strong> ${codeVerifier.substring(0, 20)}... (${codeVerifier.length} chars)</p>
            <p><strong>Code Challenge:</strong> ${codeChallenge}</p>
            <p><strong>State:</strong> ${state}</p>
          </div>
          
          <div style="text-align: center;">
            <h3>Demo Actions:</h3>
            <a href="/oauth/callback?code=demo_auth_code&state=${state}" class="button">
              Simulate Successful Authorization
            </a>
            <a href="/oauth/callback?error=access_denied&state=${state}" class="button button-secondary">
              Simulate Authorization Denied
            </a>
            <a href="/" class="button button-secondary">
              Back to Home
            </a>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("Login initiation error:", error);
    res.status(500).send("Error initiating login");
  }
});

// OAuth callback handler
app.get("/oauth/callback", async (req, res) => {
  try {
    const { code, state, error } = req.query;

    // Check for OAuth errors
    if (error) {
      return res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Authorization Error</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .error-container { background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; padding: 20px; }
            .error-title { color: #721c24; margin-bottom: 10px; }
            .back-link { display: inline-block; margin-top: 15px; color: #007bff; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="error-container">
            <h2 class="error-title">Authorization Failed</h2>
            <p>Error: ${error}</p>
            <p>The OAuth authorization was denied or failed.</p>
            <a href="/" class="back-link">← Back to Home</a>
          </div>
        </body>
        </html>
      `);
    }

    // Verify state parameter
    if (!req.session.oauth || req.session.oauth.state !== state) {
      return res.status(400).send("Invalid state parameter");
    }

    // Check session timeout (10 minutes)
    if (Date.now() - req.session.oauth.timestamp > 10 * 60 * 1000) {
      delete req.session.oauth;
      return res.status(400).send("OAuth session expired");
    }

    const { codeVerifier } = req.session.oauth;

    // In demo mode, simulate token exchange
    if (code === "demo_auth_code") {
      // Simulate successful token exchange and user info
      const mockUser = {
        id: "12345",
        name: "Demo User",
        email: "demo@example.com",
        picture: "https://via.placeholder.com/100x100?text=DU",
        sub: "12345",
      };

      // Store user in session
      req.session.user = mockUser;
      req.session.tokens = {
        access_token: "demo_access_token",
        token_type: "Bearer",
        expires_in: 3600,
        scope: OAUTH_CONFIG.scope,
      };

      // Clean up OAuth session data
      delete req.session.oauth;

      return res.redirect("/dashboard");
    }

    // Real OAuth flow (commented out for demo)
    /*
    try {
      const tokens = await exchangeCodeForTokens(code, codeVerifier);
      const user = await getUserInfo(tokens.access_token);
      
      req.session.user = user;
      req.session.tokens = tokens;
      delete req.session.oauth;
      
      res.redirect('/dashboard');
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.status(500).send('Authentication failed');
    }
    */
  } catch (error) {
    console.error("Callback error:", error);
    res.status(500).send("Error processing callback");
  }
});

// User dashboard (protected route)
app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }

  const user = req.session.user;
  const tokens = req.session.tokens;

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Dashboard - OAuth2 PKCE Demo</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .header {
          background: white;
          padding: 20px;
          border-radius: 8px 8px 0 0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #dee2e6;
        }
        .main-content {
          background: white;
          padding: 30px;
          border-radius: 0 0 8px 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .user-avatar {
          width: 50px;
          height: 50px;
          border-radius: 25px;
          background: #007bff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 20px;
        }
        .user-details h2 {
          margin: 0;
          color: #333;
        }
        .user-details p {
          margin: 5px 0 0 0;
          color: #666;
        }
        .logout-button {
          background: #dc3545;
          color: white;
          padding: 8px 16px;
          text-decoration: none;
          border-radius: 4px;
          font-size: 14px;
        }
        .logout-button:hover {
          background: #c82333;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .info-card {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          padding: 20px;
        }
        .info-card h3 {
          margin-top: 0;
          color: #495057;
        }
        .info-item {
          margin: 10px 0;
          padding: 8px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .info-item:last-child {
          border-bottom: none;
        }
        .info-label {
          font-weight: bold;
          color: #6c757d;
          display: inline-block;
          width: 120px;
        }
        .info-value {
          color: #495057;
          font-family: monospace;
          font-size: 14px;
        }
        .success-banner {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 20px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="user-info">
          <div class="user-avatar">
            ${user.picture ? `<img src="${user.picture}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%;">` : user.name.charAt(0).toUpperCase()}
          </div>
          <div class="user-details">
            <h2>Welcome, ${user.name || "User"}!</h2>
            <p>${user.email || "No email provided"}</p>
          </div>
        </div>
        <a href="/oauth/logout" class="logout-button">Logout</a>
      </div>
      
      <div class="main-content">
        <div class="success-banner">
          🎉 Successfully authenticated using OAuth2 PKCE flow!
        </div>
        
        <div class="info-grid">
          <div class="info-card">
            <h3>User Information</h3>
            <div class="info-item">
              <span class="info-label">User ID:</span>
              <span class="info-value">${user.id || user.sub || "N/A"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Name:</span>
              <span class="info-value">${user.name || "N/A"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email:</span>
              <span class="info-value">${user.email || "N/A"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Verified:</span>
              <span class="info-value">${user.email_verified ? "Yes" : "No"}</span>
            </div>
          </div>
          
          <div class="info-card">
            <h3>Token Information</h3>
            <div class="info-item">
              <span class="info-label">Token Type:</span>
              <span class="info-value">${tokens.token_type || "Bearer"}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Scope:</span>
              <span class="info-value">${tokens.scope || OAUTH_CONFIG.scope}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Expires In:</span>
              <span class="info-value">${tokens.expires_in || "N/A"} seconds</span>
            </div>
            <div class="info-item">
              <span class="info-label">Access Token:</span>
              <span class="info-value">${tokens.access_token ? tokens.access_token.substring(0, 20) + "..." : "N/A"}</span>
            </div>
          </div>
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
          <h3>OAuth2 PKCE Flow Complete!</h3>
          <p>This dashboard demonstrates a successful OAuth2 authorization code flow with PKCE (Proof Key for Code Exchange). 
          Your identity has been verified securely without exposing sensitive credentials in the browser.</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Logout
app.get("/oauth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destruction error:", err);
    }
    res.redirect("/");
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    oauth_config: {
      client_id: OAUTH_CONFIG.client_id,
      redirect_uri: OAUTH_CONFIG.redirect_uri,
      endpoints_configured: true,
    },
  });
});

// API status endpoint
app.get("/api/status", (req, res) => {
  res.json({
    application: "oauth2-pkce-demo",
    version: "1.0.0",
    status: "running",
    port: PORT,
    features: [
      "OAuth2 Authorization Code Flow",
      "PKCE (Proof Key for Code Exchange)",
      "Session Management",
      "User Dashboard",
      "Secure Logout",
    ],
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`OAuth2 PKCE Demo server is running on http://localhost:${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
  console.log(`OAuth Configuration:`);
  console.log(`  Client ID: ${OAUTH_CONFIG.client_id}`);
  console.log(`  Redirect URI: ${OAUTH_CONFIG.redirect_uri}`);
  console.log(`  Demo Mode: Active (using mock OAuth endpoints)`);
});
