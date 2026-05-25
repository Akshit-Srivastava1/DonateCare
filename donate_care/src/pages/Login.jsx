import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Invalid credentials');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/');
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass-panel">
                <div className="auth-header">
                    <Link to="/" className="auth-logo">
                        <span className="logo-blue">Donate</span><span className="logo-green">Care</span>
                    </Link>
                    <h2>Welcome Back</h2>
                    <p>Login to continue your impact journey</p>
                </div>
                
                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && <div className="alert-error" style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-wrapper">
                            <i className="auth-icon">📧</i>
                            <input type="email" id="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <i className="auth-icon">🔒</i>
                            <input type="password" id="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required />
                        </div>
                    </div>
                    
                    <div className="form-options">
                        <label className="remember-me">
                            <input type="checkbox" /> Remember me
                        </label>
                        <a href="#" className="forgot-password">Forgot Password?</a>
                    </div>
                    
                    <button type="submit" className="btn btn-primary btn-block auth-btn" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login to Account'}
                    </button>
                </form>
                
                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link></p>
                </div>
            </div>
            
            <div className="auth-visual">
                <div className="visual-content">
                    <h3>Every contribution matters.</h3>
                    <p>Join thousands of donors, NGOs, and hospitals creating a unified digital ecosystem for emergency support.</p>
                </div>
            </div>
        </div>
    );
}

export default Login;
