# AuthProvider - React Authentication System

A comprehensive React TypeScript authentication system with context-based state management, modal components, and user session persistence.

## Features

- 🔐 **Secure Authentication**: Sign in and sign up functionality
- 🎯 **Context-based State Management**: Clean React Context implementation
- 💾 **Session Persistence**: Automatic localStorage integration
- 🎨 **Styled Components**: Pre-styled modal and user menu components
- ♿ **Accessibility**: Full ARIA support and keyboard navigation
- 📱 **Responsive Design**: Mobile-friendly components
- 🔄 **Error Handling**: Built-in error states and loading indicators

## Quick Start

### 1. Installation

The required dependencies are already installed:

- `react`
- `react-dom`
- `@types/react`
- `@types/react-dom`
- `typescript`

### 2. Basic Usage

```tsx
import React from "react";
import { AuthProvider, useAuth, AuthModal } from "./src";

// Your app content that uses authentication
const AppContent: React.FC = () => {
  const {
    isAuthenticated,
    user,
    showAuthModal,
    authMode,
    showAuth,
    hideAuth,
    signin,
    signup,
    signout,
  } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.name}!</p>
          <button onClick={signout}>Sign Out</button>
        </div>
      ) : (
        <div>
          <button onClick={() => showAuth("signin")}>Sign In</button>
          <button onClick={() => showAuth("signup")}>Sign Up</button>
        </div>
      )}

      <AuthModal
        isOpen={showAuthModal}
        mode={authMode}
        onClose={hideAuth}
        onModeChange={showAuth}
        onSignin={signin}
        onSignup={signup}
      />
    </div>
  );
};

// Main app with AuthProvider wrapper
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
```

### 3. Using Pre-built Components

```tsx
import React from "react";
import { AuthProvider, UserMenu, AuthModal, useAuth } from "./src";

const App: React.FC = () => {
  const { showAuthModal, authMode, hideAuth, showAuth, signin, signup } =
    useAuth();

  return (
    <AuthProvider>
      <header>
        <h1>My App</h1>
        <UserMenu /> {/* Pre-built user menu component */}
      </header>

      <main>{/* Your app content */}</main>

      {/* Pre-built auth modal */}
      <AuthModal
        isOpen={showAuthModal}
        mode={authMode}
        onClose={hideAuth}
        onModeChange={showAuth}
        onSignin={signin}
        onSignup={signup}
      />
    </AuthProvider>
  );
};
```

## API Reference

### AuthProvider

The main context provider that wraps your application.

```tsx
interface AuthProviderProps {
  children: React.ReactNode;
}
```

### useAuth Hook

Access authentication state and methods from any component within the AuthProvider.

```tsx
const {
  // State
  isAuthenticated: boolean;
  user: User | null;
  authMode: 'signin' | 'signup';
  showAuthModal: boolean;

  // Actions
  showAuth: (mode: 'signin' | 'signup') => void;
  hideAuth: () => void;
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  signout: () => void;
} = useAuth();
```

### User Type

```tsx
interface User {
  id?: string;
  email: string;
  name: string;
  picture?: string;
  sub?: string;
  email_verified?: boolean;
}
```

### AuthModal Component

Pre-built authentication modal with sign in and sign up forms.

```tsx
interface AuthModalProps {
  isOpen: boolean;
  mode: "signin" | "signup";
  onClose: () => void;
  onModeChange: (mode: "signin" | "signup") => void;
  onSignin: (email: string, password: string) => Promise<void>;
  onSignup: (email: string, password: string, name: string) => Promise<void>;
}
```

### UserMenu Component

Pre-built user menu that shows sign in/up buttons when not authenticated, and user info with sign out when authenticated.

```tsx
interface UserMenuProps {
  className?: string;
}
```

## Customization

### Replacing Mock Authentication

The current implementation uses mock authentication. To integrate with a real backend:

1. **Update the `signin` method in AuthProvider:**

```tsx
const signin = useCallback(
  async (email: string, password: string): Promise<void> => {
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const { user, token } = await response.json();

      setUser(user);
      setIsAuthenticated(true);
      setShowAuthModal(false);

      // Store authentication data
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("isAuthenticated", "true");
    } catch (error) {
      console.error("Signin error:", error);
      throw error;
    }
  },
  [],
);
```

2. **Update the `signup` method similarly:**

```tsx
const signup = useCallback(
  async (email: string, password: string, name: string): Promise<void> => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const { user, token } = await response.json();

      setUser(user);
      setIsAuthenticated(true);
      setShowAuthModal(false);

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("isAuthenticated", "true");
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  },
  [],
);
```

### Styling Customization

The components use inline styles for maximum compatibility. To customize:

1. **Override specific styles:**

```tsx
<UserMenu
  className="my-custom-user-menu"
  style={{
    backgroundColor: "your-color",
    // ... other styles
  }}
/>
```

2. **Create your own components using the useAuth hook:**

```tsx
const CustomUserMenu: React.FC = () => {
  const { isAuthenticated, user, showAuth, signout } = useAuth();

  return (
    <div className="custom-user-menu">{/* Your custom implementation */}</div>
  );
};
```

## Integration with Existing OAuth

This AuthProvider can work alongside the existing OAuth2 PKCE implementation in this project:

1. **Use OAuth for external providers (Google, GitHub, etc.)**
2. **Use AuthProvider for internal authentication forms**
3. **Sync authentication state between both systems**

Example integration:

```tsx
// In your OAuth success callback
const handleOAuthSuccess = (oauthUser) => {
  // Update AuthProvider state
  setUser(oauthUser);
  setIsAuthenticated(true);
};
```

## Error Handling

The AuthProvider includes built-in error handling:

- **Network errors** are caught and thrown with descriptive messages
- **Form validation** is handled by the AuthModal component
- **Invalid stored data** is automatically cleared

To handle errors in your components:

```tsx
const handleSignin = async (email, password) => {
  try {
    await signin(email, password);
  } catch (error) {
    // Handle error (show toast, etc.)
    console.error("Sign in failed:", error.message);
  }
};
```

## TypeScript Support

All components and hooks are fully typed with TypeScript interfaces. Import types as needed:

```tsx
import { User, AuthContextType, AuthModalProps } from "./src/types/auth";
```

## Testing

The AuthProvider is designed to be easily testable:

```tsx
import { render, screen } from "@testing-library/react";
import { AuthProvider } from "./src";

const TestComponent = () => {
  const { isAuthenticated } = useAuth();
  return <div>{isAuthenticated ? "Authenticated" : "Not authenticated"}</div>;
};

test("authentication state", () => {
  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>,
  );

  expect(screen.getByText("Not authenticated")).toBeInTheDocument();
});
```

## Security Considerations

- **Passwords are not stored** - only passed to your authentication API
- **Tokens should be stored securely** - consider using httpOnly cookies for production
- **HTTPS is required** in production for secure authentication
- **Input validation** should be implemented on the backend
- **Rate limiting** should be implemented to prevent brute force attacks

## Browser Support

- ✅ Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- ✅ Mobile browsers
- ✅ IE11+ (with polyfills for localStorage)

---

For more examples and advanced usage, see the `App.tsx` component in this directory.
