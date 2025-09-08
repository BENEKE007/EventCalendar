import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/authContext';
import { useTheme } from '../lib/themeContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const { signIn, signUp } = useAuth();
  const { themeConfig } = useTheme();
  
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setEmail('');
      setPassword('');
      setDisplayName('');
      setError('');
      setLoading(false);
    }
  }, [isOpen, initialMode]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signin') {
        await signIn(email, password, rememberMe);
      } else {
        await signUp(email, password, displayName);
      }
      onClose();
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
    >
      <div 
        className="android-card max-w-md w-full"
        style={{ 
          backgroundColor: themeConfig.colors.surface,
          maxWidth: '28rem',
          width: '100%',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          position: 'relative',
          zIndex: 10000,
          color: themeConfig.colors.onSurface
        }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 
              className="text-xl font-medium" 
              style={{ 
                color: themeConfig.colors.onSurface,
                fontSize: '20px',
                fontWeight: '500',
                margin: 0
              }}
            >
              {mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </h2>
            <button
              onClick={onClose}
              className="text-2xl leading-none"
              style={{ 
                color: themeConfig.colors.muted,
                fontSize: '24px',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>
          

          {error && (
            <div 
              className="mb-4 p-3 rounded-lg text-sm"
              style={{ 
                backgroundColor: themeConfig.colors.errorContainer,
                color: themeConfig.colors.onErrorContainer
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.onSurface }}>
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required={mode === 'signup'}
                  className="w-full p-3 border rounded-lg"
                  style={{ 
                    backgroundColor: themeConfig.colors.surface,
                    borderColor: themeConfig.colors.outline,
                    color: themeConfig.colors.onSurface
                  }}
                  placeholder="Enter your name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.onSurface }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border rounded-lg"
                style={{ 
                  backgroundColor: themeConfig.colors.surface,
                  borderColor: themeConfig.colors.outline,
                  color: themeConfig.colors.onSurface
                }}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: themeConfig.colors.onSurface }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border rounded-lg"
                style={{ 
                  backgroundColor: themeConfig.colors.surface,
                  borderColor: themeConfig.colors.outline,
                  color: themeConfig.colors.onSurface
                }}
                placeholder="Enter your password"
                minLength={6}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 mr-2"
              />
              <label htmlFor="rememberMe" className="text-sm" style={{ color: themeConfig.colors.onSurface }}>
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full android-button"
              style={{ 
                backgroundColor: themeConfig.colors.primary,
                color: themeConfig.colors.onPrimary,
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Please wait...' : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
            </button>
          </form>


          <div className="mt-4 text-center">
            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-sm underline"
              style={{ color: themeConfig.colors.primary }}
            >
              {mode === 'signin' 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;