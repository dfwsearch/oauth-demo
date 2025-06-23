import React, { useState, FormEvent } from "react";
import { AuthModalProps } from "../types/auth";

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  mode,
  onClose,
  onModeChange,
  onSignin,
  onSignup,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (mode === "signin") {
        await onSignin(email, password);
      } else {
        await onSignup(email, password, name);
      }
      // Reset form
      setEmail("");
      setPassword("");
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeToggle = () => {
    setError("");
    onModeChange(mode === "signin" ? "signup" : "signin");
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      action();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={mode === "signin" ? "Sign in" : "Sign up"}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        zIndex: 10000001,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "rgb(0, 0, 0)",
          border: "1px solid rgb(44, 44, 44)",
          borderRadius: "12px",
          padding: "40px",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <h2
            style={{
              fontSize: "26px",
              fontWeight: "700",
              color: "rgb(255, 255, 255)",
              margin: 0,
            }}
          >
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </h2>
          <button
            role="button"
            aria-label="Close authentication modal"
            tabIndex={0}
            onClick={onClose}
            onKeyDown={(event) => handleKeyDown(event, onClose)}
            style={{
              background: "none",
              border: "none",
              color: "rgb(255, 255, 255)",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "rgba(220, 38, 38, 0.1)",
              border: "1px solid rgb(220, 38, 38)",
              borderRadius: "6px",
              padding: "12px",
              marginBottom: "20px",
              color: "rgb(255, 255, 255)",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {mode === "signup" && (
            <div>
              <label
                style={{
                  display: "block",
                  color: "rgb(255, 255, 255)",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                }}
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={mode === "signup"}
                disabled={isLoading}
                style={{
                  width: "100%",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgb(60, 60, 60)",
                  borderRadius: "7px",
                  padding: "12px 15px",
                  color: "rgb(255, 255, 255)",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          )}

          <div>
            <label
              style={{
                display: "block",
                color: "rgb(255, 255, 255)",
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              style={{
                width: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgb(60, 60, 60)",
                borderRadius: "7px",
                padding: "12px 15px",
                color: "rgb(255, 255, 255)",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                color: "rgb(255, 255, 255)",
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
              }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              style={{
                width: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgb(60, 60, 60)",
                borderRadius: "7px",
                padding: "12px 15px",
                color: "rgb(255, 255, 255)",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              backgroundColor: isLoading
                ? "rgb(120, 90, 180)"
                : "rgb(172, 126, 244)",
              border: "none",
              borderRadius: "7px",
              padding: "15px",
              color: "rgb(0, 0, 0)",
              fontSize: "16px",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "background-color 0.3s",
            }}
          >
            {isLoading
              ? "Please wait..."
              : mode === "signin"
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "14px",
          }}
        >
          {mode === "signin"
            ? "Don't have an account? "
            : "Already have an account? "}
          <button
            role="button"
            tabIndex={0}
            onClick={handleModeToggle}
            onKeyDown={(event) => handleKeyDown(event, handleModeToggle)}
            style={{
              background: "none",
              border: "none",
              color: "rgb(172, 126, 244)",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "14px",
            }}
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
