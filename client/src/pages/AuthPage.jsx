import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { handleLogin, handleRegister } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await handleLogin(email, password);
      } else {
        await handleRegister(username, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid var(--panel-border)',
    color: 'white',
    padding: '0.8rem 1rem',
    borderRadius: '8px',
    outline: 'none',
    marginBottom: '1rem',
    fontFamily: 'inherit'
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ padding: '3rem', borderRadius: '16px', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          {isLogin ? 'Enter your credentials to access your boards.' : 'Sign up to start organizing.'}
        </p>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent-rose)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              style={inputStyle} 
            />
          )}
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={inputStyle} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={inputStyle} 
          />
          
          <button type="submit" className="button-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '0.8rem' }} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ color: 'var(--accent-cyan)', cursor: 'pointer', fontWeight: 600 }}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </span>
        </div>
      </div>
    </div>
  );
}
