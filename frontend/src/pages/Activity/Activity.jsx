import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Activity.css';
import logoImage from '../../img/logo-todolist.jpg';
import api from '../../api';

const Activity = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: '' });
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserProfile();
        fetchActivities();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await api.get('auth/profile/');
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
    };

    const fetchActivities = async () => {
        try {
            const response = await api.get('activity/');
            setActivities(response.data);
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setLoading(false);
        }
    };

    const getInitials = () => {
        if (user.first_name && user.last_name) {
            return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
        }
        return user.username ? user.username.substring(0, 2).toUpperCase() : 'US';
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds} segundos atrás`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutos atrás`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} horas atrás`;

        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDateSeparator = (isoString) => {
        const date = new Date(isoString);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return `Hoy - ${date.toLocaleDateString()}`;
        }
        if (date.toDateString() === yesterday.toDateString()) {
            return `Ayer - ${date.toLocaleDateString()}`;
        }
        return date.toLocaleDateString();
    };

    // Group activities by date
    const groupedActivities = activities.reduce((acc, activity) => {
        const date = new Date(activity.timestamp).toDateString();
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(activity);
        return acc;
    }, {});

    const getActivityIcon = (action) => {
        switch (action) {
            case 'CREATED': return 'bi-plus-circle-fill';
            case 'COMPLETED': return 'bi-check-circle-fill';
            case 'UPDATED': return 'bi-pencil-fill';
            case 'DELETED': return 'bi-trash-fill';
            default: return 'bi-circle-fill';
        }
    };

    const getActivityClass = (action) => {
        switch (action) {
            case 'CREATED': return 'activity-type-created';
            case 'COMPLETED': return 'activity-type-completed';
            case 'UPDATED': return 'activity-type-edited';
            case 'DELETED': return 'activity-type-deleted';
            default: return '';
        }
    };

    const getActivityTitle = (action, type) => {
        const typeMap = { 'Task': 'Tarea', 'Project': 'Proyecto' };
        const displayType = typeMap[type] || type;

        switch (action) {
            case 'CREATED': return `${displayType} creada`;
            case 'COMPLETED': return `${displayType} completada`;
            case 'UPDATED': return `${displayType} actualizada`;
            case 'DELETED': return `${displayType} eliminada`;
            default: return 'Actividad registrada';
        }
    };

    return (
        <div className="activity-page">
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
                    <button className="nav-item" onClick={() => navigate('/tags')}>
                        <i className="bi bi-tags"></i>
                        <span>Etiquetas</span>
                    </button>
                    <button className="nav-item" onClick={() => navigate('/statistics')}>
                        <i className="bi bi-graph-up"></i>
                        <span>Estadísticas</span>
                    </button>
                    <button className="nav-item active">
                        <i className="bi bi-clock-history"></i>
                        <span>Actividad</span>
                    </button>
                    <button className="nav-item" onClick={() => navigate('/settings')}>
                        <i className="bi bi-gear"></i>
                        <span>Configuración</span>
                    </button>
                </nav>
                <div className="user-profile">
                    <div className="user-avatar">{getInitials()}</div>
                    <div className="user-info">
                        <h6>{user.username}</h6>
                        <small>Plan Pro</small>
                    </div>
                    <button onClick={handleLogout} className="ms-auto text-muted" style={{ border: 'none', background: 'none', padding: 0 }}>
                        <i className="bi bi-box-arrow-right"></i>
                    </button>
                </div>
            </aside>

            <div className="activity-main-content">
                <h1 className="h3 fw-bold mb-4">Historial de Actividad</h1>

                {/* Filter Bar - Static for MVP, but layout preserved */}
                <div className="filter-bar">
                    <div className="row align-items-center">
                        <div className="col-md-4">
                            <select className="form-select">
                                <option>Todos los tipos</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <select className="form-select">
                                <option>Todos los proyectos</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <select className="form-select">
                                <option>Últimos 30 días</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center p-5">Cargando actividad...</div>
                ) : (
                    <div className="timeline">
                        {Object.keys(groupedActivities).length === 0 && (
                            <div className="text-center text-muted p-5">
                                No hay actividad reciente. Comienza a crear tareas para ver tu historial aquí.
                            </div>
                        )}

                        {Object.entries(groupedActivities).map(([date, dateActivities]) => (
                            <React.Fragment key={date}>
                                <div className="date-separator">{formatDateSeparator(dateActivities[0].timestamp)}</div>

                                {dateActivities.map((activity) => (
                                    <div className="timeline-item" key={activity.id}>
                                        <div className={`timeline-marker ${getActivityClass(activity.action)}`}>
                                            <i className={`bi ${getActivityIcon(activity.action)}`}></i>
                                        </div>
                                        <div className="timeline-content">
                                            <div className="timeline-header">
                                                <div>
                                                    <div className="activity-title">{getActivityTitle(activity.action, activity.target_type)}</div>
                                                    <div className="activity-details">
                                                        {activity.details}
                                                    </div>
                                                </div>
                                                <div className="activity-time">{formatTime(activity.timestamp)}</div>
                                            </div>
                                            <div className="activity-meta">
                                                <span><i className="bi bi-tag"></i> {activity.target_type}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Activity;
