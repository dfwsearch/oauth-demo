export interface User {
  id?: string;
  email: string;
  name: string;
  picture?: string;
  sub?: string;
  email_verified?: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  authMode: "signin" | "signup";
  showAuthModal: boolean;
}

export interface AuthActions {
  showAuth: (mode: "signin" | "signup") => void;
  hideAuth: () => void;
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  signout: () => void;
}

export interface AuthContextType extends AuthState, AuthActions {}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface AuthModalProps {
  isOpen: boolean;
  mode: "signin" | "signup";
  onClose: () => void;
  onModeChange: (mode: "signin" | "signup") => void;
  onSignin: (email: string, password: string) => Promise<void>;
  onSignup: (email: string, password: string, name: string) => Promise<void>;
}
