import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Login.css';
import logoImage from '../../img/logo-todolist.jpg';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Clear any existing token to prevent 401s from invalid headers
        localStorage.removeItem('token');
        try {
            const response = await api.post('auth/login/', { username, password });
            localStorage.setItem('token', response.data.token);
            navigate('/todos');
        } catch (err) {
            console.error('Login error:', err);
            let errorMessage = 'Error al iniciar sesión';
            if (err.response && err.response.data) {
                const data = err.response.data;
                if (data.non_field_errors) {
                    errorMessage = data.non_field_errors.join(', ');
                } else if (data.detail) {
                    errorMessage = data.detail;
                } else {
                    // Convert object to string if complex
                    errorMessage = typeof data === 'object' ? JSON.stringify(data) : String(data);
                }
            } else if (err.message) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="logo">
                    <img src={logoImage} alt="TaskFlow Logo" className="logo-image" />
                </div>
                <h2 className="text-center fw-bold mb-1">Bienvenido</h2>
                <p className="text-center text-muted mb-4">Inicia sesión en TaskFlow</p>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Usuario</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-person"></i></span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Contraseña</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-lock"></i></span>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="form-check">
                            <input type="checkbox" className="form-check-input" id="remember" />
                            <label className="form-check-label text-muted" htmlFor="remember">Recordarme</label>
                        </div>
                        <a href="#">¿Olvidaste tu contraseña?</a>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 mb-3">
                        Iniciar Sesión
                    </button>

                    <div className="divider">
                        <span>o continúa con</span>
                    </div>

                    <div className="d-flex gap-3">
                        <button type="button" className="btn btn-outline-secondary flex-fill">
                            <i className="bi bi-google me-2"></i>Google
                        </button>
                        <button type="button" className="btn btn-outline-secondary flex-fill">
                            <i className="bi bi-github me-2"></i>GitHub
                        </button>
                    </div>

                    <p className="text-center text-muted mt-4 mb-0">
                        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
