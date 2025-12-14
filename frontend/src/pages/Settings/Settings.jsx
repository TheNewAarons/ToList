import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Settings.css';
import logoImage from '../../img/logo-todolist.jpg';

const Settings = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: 'Usuario' });

    // Config State - Mocked for UI interactivity
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        tasks: true,
        daily: false,
        projects: true
    });

    const [theme, setTheme] = useState('purple');
    const [darkMode, setDarkMode] = useState(false);
    const [animations, setAnimations] = useState(true);

    const [preferences, setPreferences] = useState({
        language: 'Español',
        timezone: 'GMT-5 (Lima, Bogotá)',
        dateFormat: 'DD/MM/YYYY',
        defaultView: 'Dashboard',
        autoSort: true,
        archiveCompleted: false
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            // setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleNotificationChange = (type) => {
        setNotifications(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const handlePreferenceChange = (key, value) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="settings-page">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="logo">
                    <img src={logoImage} alt="TaskFlow Logo" className="logo-image" />
                </div>

                <nav>
                    <button className="nav-item" onClick={() => navigate('/todos')}>
                        <i className="bi bi-house"></i>
                        <span>Dashboard</span>
                    </button>
                    <button className="nav-item" onClick={() => navigate('/my-tasks')}>
                        <i className="bi bi-list-task"></i>
                        <span>Mis Tareas</span>
                    </button>
                    <button className="nav-item" onClick={() => navigate('/calendar')}>
                        <i className="bi bi-calendar3"></i>
                        <span>Calendario</span>
                    </button>
                    <button className="nav-item" onClick={() => navigate('/projects')}>
                        <i className="bi bi-folder"></i>
                        <span>Proyectos</span>
                    </button>
                    <button className="nav-item" onClick={() => navigate('/important')}>
                        <i className="bi bi-star"></i>
                        <span>Importantes</span>
                    </button>
                    <button className="nav-item active">
                        <i className="bi bi-gear"></i>
                        <span>Configuración</span>
                    </button>
                </nav>

                <div className="user-profile">
                    <div className="user-avatar">JD</div>
                    <div className="user-info">
                        <h6>{user.username}</h6>
                        <small>Plan Pro</small>
                    </div>
                    <button onClick={handleLogout} className="ms-auto text-muted" style={{ border: 'none', background: 'none' }}>
                        <i className="bi bi-box-arrow-right"></i>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <div className="header">
                    <div className="header-title">
                        <div className="settings-icon">
                            <i className="bi bi-gear-fill"></i>
                        </div>
                        <div>
                            <h1>Configuración</h1>
                            <p>Personaliza tu experiencia en TaskFlow</p>
                        </div>
                    </div>
                </div>

                <div className="settings-container">
                    {/* Perfil Section */}
                    <div className="settings-section">
                        <div className="settings-section-header">
                            <div className="settings-section-icon icon-purple">
                                <i className="bi bi-person-circle"></i>
                            </div>
                            <div>
                                <h3>Perfil de Usuario</h3>
                                <p>Actualiza tu información personal</p>
                            </div>
                        </div>

                        <div className="avatar-upload">
                            <div className="avatar-preview">JD</div>
                            <div className="avatar-actions">
                                <button className="btn-upload">
                                    <i className="bi bi-upload"></i> Subir foto
                                </button>
                                <button className="btn-remove">Eliminar</button>
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Nombre</label>
                                    <input type="text" className="form-control" defaultValue="Juan" placeholder="Tu nombre" />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Apellido</label>
                                    <input type="text" className="form-control" defaultValue="Pérez" placeholder="Tu apellido" />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Correo electrónico</label>
                            <input type="email" className="form-control" defaultValue="juan.perez@email.com" placeholder="tu@email.com" />
                            <small className="form-text">Tu correo principal para notificaciones</small>
                        </div>

                        <div className="form-group">
                            <label>Biografía</label>
                            <textarea className="form-control" rows="3" placeholder="Cuéntanos sobre ti..." defaultValue="Desarrollador y diseñador apasionado por crear experiencias digitales increíbles."></textarea>
                        </div>
                    </div>

                    {/* Notificaciones Section */}
                    <div className="settings-section">
                        <div className="settings-section-header">
                            <div className="settings-section-icon icon-blue">
                                <i className="bi bi-bell"></i>
                            </div>
                            <div>
                                <h3>Notificaciones</h3>
                                <p>Gestiona cómo y cuándo recibir notificaciones</p>
                            </div>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <h5>Notificaciones por email</h5>
                                <p>Recibe actualizaciones de tareas por correo</p>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={notifications.email}
                                    onChange={() => handleNotificationChange('email')}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <h5>Notificaciones push</h5>
                                <p>Alertas en tiempo real en tu dispositivo</p>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={notifications.push}
                                    onChange={() => handleNotificationChange('push')}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <h5>Recordatorios de tareas</h5>
                                <p>Avisos antes de que venzan las tareas</p>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={notifications.tasks}
                                    onChange={() => handleNotificationChange('tasks')}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <h5>Resumen diario</h5>
                                <p>Recibe un resumen de tus tareas cada día</p>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={notifications.daily}
                                    onChange={() => handleNotificationChange('daily')}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <h5>Actualizaciones de proyectos</h5>
                                <p>Notificaciones cuando hay cambios en proyectos</p>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={notifications.projects}
                                    onChange={() => handleNotificationChange('projects')}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>

                    {/* Apariencia Section */}
                    <div className="settings-section">
                        <div className="settings-section-header">
                            <div className="settings-section-icon icon-green">
                                <i className="bi bi-palette"></i>
                            </div>
                            <div>
                                <h3>Apariencia</h3>
                                <p>Personaliza el tema y colores de la aplicación</p>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Tema de color</label>
                            <div className="theme-options">
                                <div
                                    className={`theme-option ${theme === 'purple' ? 'active' : ''}`}
                                    onClick={() => setTheme('purple')}
                                >
                                    <div className="theme-color" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}></div>
                                    <p>Púrpura</p>
                                </div>
                                <div
                                    className={`theme-option ${theme === 'blue' ? 'active' : ''}`}
                                    onClick={() => setTheme('blue')}
                                >
                                    <div className="theme-color" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)' }}></div>
                                    <p>Azul</p>
                                </div>
                                <div
                                    className={`theme-option ${theme === 'green' ? 'active' : ''}`}
                                    onClick={() => setTheme('green')}
                                >
                                    <div className="theme-color" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}></div>
                                    <p>Verde</p>
                                </div>
                                <div
                                    className={`theme-option ${theme === 'orange' ? 'active' : ''}`}
                                    onClick={() => setTheme('orange')}
                                >
                                    <div className="theme-color" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}></div>
                                    <p>Naranja</p>
                                </div>
                            </div>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <h5>Modo oscuro</h5>
                                <p>Cambia a una interfaz con colores oscuros</p>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={darkMode}
                                    onChange={() => setDarkMode(!darkMode)}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <h5>Animaciones</h5>
                                <p>Activa o desactiva las animaciones de la UI</p>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={animations}
                                    onChange={() => setAnimations(!animations)}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>

                    {/* Preferencias Section */}
                    <div className="settings-section">
                        <div className="settings-section-header">
                            <div className="settings-section-icon icon-orange">
                                <i className="bi bi-sliders"></i>
                            </div>
                            <div>
                                <h3>Preferencias</h3>
                                <p>Configura el comportamiento de la aplicación</p>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Idioma</label>
                            <select
                                className="form-select"
                                value={preferences.language}
                                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                            >
                                <option>Español</option>
                                <option>English</option>
                                <option>Português</option>
                                <option>Français</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Zona horaria</label>
                            <select
                                className="form-select"
                                value={preferences.timezone}
                                onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                            >
                                <option>GMT-5 (Lima, Bogotá)</option>
                                <option>GMT-3 (Buenos Aires, São Paulo)</option>
                                <option>GMT-6 (Ciudad de México)</option>
                                <option>GMT+1 (Madrid, París)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Formato de fecha</label>
                            <select
                                className="form-select"
                                value={preferences.dateFormat}
                                onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                            >
                                <option>DD/MM/YYYY</option>
                                <option>MM/DD/YYYY</option>
                                <option>YYYY-MM-DD</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Vista predeterminada</label>
                            <select
                                className="form-select"
                                value={preferences.defaultView}
                                onChange={(e) => handlePreferenceChange('defaultView', e.target.value)}
                            >
                                <option>Dashboard</option>
                                <option>Mis Tareas</option>
                                <option>Calendario</option>
                                <option>Proyectos</option>
                            </select>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <h5>Ordenar tareas automáticamente</h5>
                                <p>Ordena las tareas por fecha de vencimiento</p>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={preferences.autoSort}
                                    onChange={() => handlePreferenceChange('autoSort', !preferences.autoSort)}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <h5>Archivar tareas completadas</h5>
                                <p>Mueve automáticamente las tareas completadas al archivo</p>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={preferences.archiveCompleted}
                                    onChange={() => handlePreferenceChange('archiveCompleted', !preferences.archiveCompleted)}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>

                    {/* Seguridad Section */}
                    <div className="settings-section">
                        <div className="settings-section-header">
                            <div className="settings-section-icon icon-red">
                                <i className="bi bi-shield-check"></i>
                            </div>
                            <div>
                                <h3>Seguridad y Privacidad</h3>
                                <p>Gestiona tu seguridad y privacidad</p>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Cambiar contraseña</label>
                            <input type="password" class="form-control" placeholder="Contraseña actual" />
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Nueva contraseña</label>
                                    <input type="password" class="form-control" placeholder="Nueva contraseña" />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Confirmar contraseña</label>
                                    <input type="password" class="form-control" placeholder="Confirmar contraseña" />
                                </div>
                            </div>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <h5>Autenticación de dos factores</h5>
                                <p>Añade una capa extra de seguridad a tu cuenta</p>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <h5>Cerrar sesión en otros dispositivos</h5>
                                <p>Cierra todas las sesiones activas excepto esta</p>
                            </div>
                            <button className="btn-remove">Cerrar sesiones</button>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="settings-section danger-zone">
                        <div className="settings-section-header">
                            <div className="settings-section-icon icon-red">
                                <i className="bi bi-exclamation-triangle"></i>
                            </div>
                            <div>
                                <h3>Zona de Peligro</h3>
                                <p>Acciones irreversibles con tu cuenta</p>
                            </div>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <h5>Exportar datos</h5>
                                <p>Descarga todos tus datos en formato JSON</p>
                            </div>
                            <button className="btn-remove">Exportar</button>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <h5>Eliminar cuenta</h5>
                                <p>Elimina permanentemente tu cuenta y todos tus datos</p>
                            </div>
                            <button className="btn-danger">Eliminar cuenta</button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="settings-actions">
                        <button className="btn-cancel" onClick={() => navigate(-1)}>Cancelar</button>
                        <button className="btn-save">
                            <i className="bi bi-check-lg"></i>
                            Guardar cambios
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;
