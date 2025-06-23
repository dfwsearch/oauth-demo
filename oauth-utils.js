const crypto = require("crypto");

// OAuth2 Configuration - easily configurable for different providers
const OAUTH_CONFIG = {
  client_id: process.env.OAUTH_CLIENT_ID || "demo-client-id",
  client_secret: process.env.OAUTH_CLIENT_SECRET || "demo-client-secret", // Not used in PKCE, but kept for demo
  authorization_endpoint:
    process.env.OAUTH_AUTH_URL ||
    "https://example-oauth-provider.com/oauth/authorize",
  token_endpoint:
    process.env.OAUTH_TOKEN_URL ||
    "https://example-oauth-provider.com/oauth/token",
  userinfo_endpoint:
    process.env.OAUTH_USERINFO_URL ||
    "https://example-oauth-provider.com/oauth/userinfo",
  redirect_uri:
    process.env.OAUTH_REDIRECT_URI || "http://localhost:3000/oauth/callback",
  scope: process.env.OAUTH_SCOPE || "openid profile email",
};

// Generate cryptographically secure random string
function generateRandomString(length = 128) {
  return crypto.randomBytes(length).toString("base64url");
}

// Generate PKCE code challenge from verifier
function generateCodeChallenge(codeVerifier) {
  return crypto.createHash("sha256").update(codeVerifier).digest("base64url");
}

// Generate PKCE parameters
function generatePKCEParams() {
  const codeVerifier = generateRandomString(128);
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = generateRandomString(32);

  return {
    codeVerifier,
    codeChallenge,
    state,
  };
}

// Build authorization URL
function buildAuthorizationUrl(codeChallenge, state) {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: OAUTH_CONFIG.client_id,
    redirect_uri: OAUTH_CONFIG.redirect_uri,
    scope: OAUTH_CONFIG.scope,
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  return `${OAUTH_CONFIG.authorization_endpoint}?${params.toString()}`;
}

// Exchange authorization code for tokens
async function exchangeCodeForTokens(code, codeVerifier) {
  const fetch = require("node-fetch");

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: OAUTH_CONFIG.client_id,
    code: code,
    redirect_uri: OAUTH_CONFIG.redirect_uri,
    code_verifier: codeVerifier,
  });

  try {
    const response = await fetch(OAUTH_CONFIG.token_endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error(
        `Token exchange failed: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Token exchange error:", error);
    throw error;
  }
}

// Get user information using access token
async function getUserInfo(accessToken) {
  const fetch = require("node-fetch");

  try {
    const response = await fetch(OAUTH_CONFIG.userinfo_endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `UserInfo request failed: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("UserInfo error:", error);
    throw error;
  }
}

module.exports = {
  OAUTH_CONFIG,
  generatePKCEParams,
  buildAuthorizationUrl,
  exchangeCodeForTokens,
  getUserInfo,
};
