import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

function Signup() {
    const [userType, setUserType] = useState('donor');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        setUserType(role);
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        const fieldName = id === 'fullname' ? 'name' : id;
        setFormData(prev => ({ ...prev, [fieldName]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5001/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: userType
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
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
        <div className="auth-container signup-container">
            <div className="auth-visual signup-visual">
                <div className="visual-content">
                    <h3>Join the Ecosystem.</h3>
                    <p>Register as a Donor, NGO, or Hospital. Connect with those who need help the most, in real-time.</p>
                    <div className="role-preview">
                        <div className={`role-badge ${userType === 'donor' ? 'active-role' : ''}`}>👤 Donor</div>
                        <div className={`role-badge ${userType === 'ngo' ? 'active-role' : ''}`}>🤝 NGO</div>
                        <div className={`role-badge ${userType === 'hospital' ? 'active-role' : ''}`}>🏨 Hospital</div>
                    </div>
                </div>
            </div>

            <div className="auth-card glass-panel">
                <div className="auth-header">
                    <Link to="/" className="auth-logo">
                        <span className="logo-blue">Donate</span><span className="logo-green">Care</span>
                    </Link>
                    <h2>Create Account</h2>
                    <p>Start making a difference today</p>
                </div>
                
                <div className="role-selector">
                    <button 
                        className={`role-btn ${userType === 'donor' ? 'active' : ''}`}
                        onClick={() => handleRoleSelect('donor')}
                        type="button"
                    >
                        Donor
                    </button>
                    <button 
                        className={`role-btn ${userType === 'ngo' ? 'active' : ''}`}
                        onClick={() => handleRoleSelect('ngo')}
                        type="button"
                    >
                        NGO
                    </button>
                    <button 
                        className={`role-btn ${userType === 'hospital' ? 'active' : ''}`}
                        onClick={() => handleRoleSelect('hospital')}
                        type="button"
                    >
                        Hospital
                    </button>
                </div>
                
                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && <div className="alert-error" style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}
                    <div className="form-group">
                        <label htmlFor="fullname">
                            {userType === 'donor' ? 'Full Name' : userType === 'ngo' ? 'Organization Name' : 'Hospital Name'}
                        </label>
                        <div className="input-wrapper">
                            <i className="auth-icon">{userType === 'donor' ? '👤' : userType === 'ngo' ? '🤝' : '🏨'}</i>
                            <input type="text" id="fullname" value={formData.name} onChange={handleChange} placeholder={`Enter ${userType === 'donor' ? 'your' : 'organization'} name`} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-wrapper">
                            <i className="auth-icon">📧</i>
                            <input type="email" id="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" required />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <i className="auth-icon">🔒</i>
                            <input type="password" id="password" value={formData.password} onChange={handleChange} placeholder="Create a password" required minLength="6" />
                        </div>
                    </div>
                    
                    <button type="submit" className="btn btn-primary btn-block auth-btn" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Account'}
                    </button>
                </form>
                
                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login" className="auth-link">Login</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Signup;
