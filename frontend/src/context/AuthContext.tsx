import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, User } from '@/types';
import api from '@/lib/api';

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
}

type AuthAction =
  | { type: 'SET_AUTH'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_AUTH':
      return { ...state, user: action.payload.user, token: action.payload.token, isAuthenticated: true, isLoading: false };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('lexibot_token');
    const userStr = localStorage.getItem('lexibot_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        dispatch({ type: 'SET_AUTH', payload: { user, token } });
        // Verify token is still valid
        api.get('/auth/me').catch(() => {
          localStorage.removeItem('lexibot_token');
          localStorage.removeItem('lexibot_user');
          dispatch({ type: 'LOGOUT' });
        });
      } catch {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('lexibot_token', token);
    localStorage.setItem('lexibot_user', JSON.stringify(user));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    dispatch({ type: 'SET_AUTH', payload: { user, token } });
  };

  const logout = () => {
    localStorage.removeItem('lexibot_token');
    localStorage.removeItem('lexibot_user');
    delete api.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
