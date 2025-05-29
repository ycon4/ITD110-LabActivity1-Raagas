import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Style.css';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // In Login.js, modify the handleSubmit function:

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Hardcoded credentials for testing
    if (username === "admin" && password === "password123") {
      // Simulate a successful login response
      const userData = {
        username: "admin",
        role: "administrator"
      };
      
      // Store in localStorage as if it came from a backend
      localStorage.setItem('token', 'fake-jwt-token-for-testing');
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast.success('Login successful!');
      onLoginSuccess(userData);
    } else {
      toast.error('Invalid username or password');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Barangay Saray Profiling System</h2>
        <p>Please login to continue</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;