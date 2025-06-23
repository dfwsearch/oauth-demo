import React from "react";
import { AuthProvider, useAuth } from "../providers/AuthProvider";
import AuthModal from "./AuthModal";
import UserMenu from "./UserMenu";

const AppContent: React.FC = () => {
  const { showAuthModal, authMode, hideAuth, showAuth, signin, signup } =
    useAuth();

  return (
    <div
      style={{
        fontFamily: "Poppins, sans-serif",
        backgroundColor: "rgb(0, 0, 0)",
        color: "rgb(255, 255, 255)",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <header
        style={{
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          backgroundColor: "rgb(0, 0, 0)",
          borderBottom: "1px solid rgb(44, 44, 44)",
          zIndex: 9999999,
          padding: "0 40px",
        }}
      >
        <div
          style={{
            backgroundColor: "rgb(172, 126, 244)",
            color: "rgb(0, 0, 0)",
            textAlign: "center",
            padding: "8px",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          🌿 Free worldwide shipping on orders over $75 • Premium quality
          guaranteed
        </div>
        <nav
          role="navigation"
          aria-label="Main navigation"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "15px 0",
            gap: "40px",
          }}
        >
          <div
            style={{
              fontSize: "26px",
              fontWeight: "700",
              color: "rgb(172, 126, 244)",
            }}
          >
            🌿 PureNature
          </div>

          <UserMenu />
        </nav>
      </header>

      {/* Main Content */}
      <main
        style={{
          marginTop: "120px",
          padding: "80px 40px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            fontWeight: "700",
            marginBottom: "20px",
            lineHeight: "1.2",
          }}
        >
          Welcome to PureNature
        </h1>
        <p
          style={{
            fontSize: "18px",
            color: "rgba(255, 255, 255, 0.7)",
            marginBottom: "40px",
            maxWidth: "600px",
            margin: "0 auto 40px",
          }}
        >
          Experience our premium collection of organic spices, therapeutic
          essential oils, and healing herbs sourced from around the world.
        </p>
      </main>

      {/* Auth Modal */}
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

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
