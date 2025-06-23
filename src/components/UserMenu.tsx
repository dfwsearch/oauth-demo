import React from "react";
import { useAuth } from "../providers/AuthProvider";

interface UserMenuProps {
  className?: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ className }) => {
  const { isAuthenticated, user, showAuth, signout } = useAuth();

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      action();
    }
  };

  const buttonStyle = {
    background: "none",
    border: "none",
    color: "rgb(255, 255, 255)",
    fontSize: "14px",
    cursor: "pointer",
    transition: "color 0.3s",
  };

  const signUpButtonStyle = {
    backgroundColor: "rgb(172, 126, 244)",
    border: "none",
    borderRadius: "7px",
    padding: "8px 15px",
    color: "rgb(0, 0, 0)",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s",
  };

  const signOutButtonStyle = {
    background: "none",
    border: "1px solid rgb(60, 60, 60)",
    borderRadius: "7px",
    padding: "8px 15px",
    color: "rgb(255, 255, 255)",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.3s",
  };

  if (isAuthenticated && user) {
    return (
      <div
        className={className}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <span
          style={{
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "14px",
          }}
        >
          Welcome, {user.name}
        </span>
        <button
          role="button"
          aria-label="Sign out"
          tabIndex={0}
          onClick={signout}
          onKeyDown={(event) => handleKeyDown(event, signout)}
          style={signOutButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgb(172, 126, 244)";
            e.currentTarget.style.color = "rgb(172, 126, 244)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgb(60, 60, 60)";
            e.currentTarget.style.color = "rgb(255, 255, 255)";
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = "2px solid rgb(172, 126, 244)";
            e.currentTarget.style.outlineOffset = "2px";
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = "none";
          }}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "15px",
      }}
    >
      <button
        role="button"
        aria-label="Sign in to your account"
        tabIndex={0}
        onClick={() => showAuth("signin")}
        onKeyDown={(event) => handleKeyDown(event, () => showAuth("signin"))}
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "rgb(172, 126, 244)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgb(255, 255, 255)";
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = "2px solid rgb(172, 126, 244)";
          e.currentTarget.style.outlineOffset = "2px";
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = "none";
        }}
      >
        Sign In
      </button>
      <button
        role="button"
        aria-label="Create new account"
        tabIndex={0}
        onClick={() => showAuth("signup")}
        onKeyDown={(event) => handleKeyDown(event, () => showAuth("signup"))}
        style={signUpButtonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgb(150, 100, 220)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgb(172, 126, 244)";
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = "2px solid rgb(255, 255, 255)";
          e.currentTarget.style.outlineOffset = "2px";
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = "none";
        }}
      >
        Sign Up
      </button>
    </div>
  );
};

export default UserMenu;
