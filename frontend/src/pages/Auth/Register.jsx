import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Login.css'; // Reuse Login styles
import logoImage from '../../img/logo-todolist.jpg';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirm_password) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            await api.post('auth/register/', formData);
            alert('¡Cuenta creada exitosamente! Por favor inicia sesión.');
            navigate('/login');
        } catch (err) {
            console.error('Register error:', err);
            let errorMessage = 'Error al registrarse';
            if (err.response && err.response.data) {
                // Formatting DRF errors
                const data = err.response.data;
                errorMessage = Object.keys(data).map(key => {
                    const msg = Array.isArray(data[key]) ? data[key][0] : data[key];
                    return `${key}: ${msg}`;
                }).join(' | ');
            }
            setError(errorMessage);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card" style={{ maxWidth: '500px' }}>
                <div className="logo">
                    <img src={logoImage} alt="TaskFlow Logo" className="logo-image" />
                </div>
                <h2 className="text-center fw-bold mb-1">Crear Cuenta</h2>
                <p className="text-center text-muted mb-4">Únete a TaskFlow hoy</p>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">Nombre</label>
                            <input type="text" className="form-control" name="first_name" value={formData.first_name} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">Apellido</label>
                            <input type="text" className="form-control" name="last_name" value={formData.last_name} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Usuario</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-person"></i></span>
                            <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Email</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Contraseña</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-lock"></i></span>
                            <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required minLength="8" />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">Confirmar Contraseña</label>
                        <div className="input-group">
                            <span className="input-group-text"><i className="bi bi-check-lg"></i></span>
                            <input type="password" className="form-control" name="confirm_password" value={formData.confirm_password} onChange={handleChange} required />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 mb-3">
                        Registrarse
                    </button>

                    <p className="text-center text-muted mt-4 mb-0">
                        ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
