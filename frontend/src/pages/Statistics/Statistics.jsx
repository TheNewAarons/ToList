import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Statistics.css';
import logoImage from '../../img/logo-todolist.jpg';
import api from '../../api';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
} from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
);

const Statistics = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: '' });
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserProfile();
        fetchStatistics();
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

    const fetchStatistics = async () => {
        try {
            const response = await api.get('statistics/');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching statistics:', error);
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

    // Chart Configuration
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: false
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20
                }
            }
        }
    };

    if (loading) return <div className="d-flex justify-content-center align-items-center vh-100">Cargando estadísticas...</div>;
    if (!stats) return <div className="text-center p-5">No se pudieron cargar los datos.</div>;

    const productivityData = {
        labels: stats.charts.productivity.labels,
        datasets: [{
            label: 'Tareas Completadas',
            data: stats.charts.productivity.data,
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };

    const projectData = {
        labels: stats.charts.projects.labels,
        datasets: [{
            data: stats.charts.projects.data,
            backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#17a2b8', '#ffc107']
        }]
    };

    const priorityData = {
        labels: ['Alta', 'Media', 'Baja'],
        datasets: [{
            data: stats.charts.priority.data,
            backgroundColor: ['#dc3545', '#ffc107', '#28a745']
        }]
    };

    const weekdayData = {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        datasets: [{
            label: 'Completadas',
            data: stats.charts.weekday.data,
            backgroundColor: 'rgba(102, 126, 234, 0.8)',
            borderRadius: 6
        }]
    };

    return (
        <div className="statistics-page">
            <aside className="sidebar">
                <div className="logo">
                    <img src={logoImage} alt="TaskFlow Logo" className="logo-image" />
                </div>
                <nav>
                    <button className="nav-item" onClick={() => navigate('/todos')}>
                        <i className="bi bi-house-door"></i>
                        <span>Dashboard</span>
                    </button>
                    <button className="nav-item" onClick={() => navigate('/today')}>
                        <i className="bi bi-calendar-day"></i>
                        <span>Hoy</span>
                    </button>
                    <button className="nav-item" onClick={() => navigate('/important')}>
                        <i className="bi bi-star"></i>
                        <span>Importantes</span>
                    </button>
                    <button className="nav-item" onClick={() => navigate('/my-tasks')}>
                        <i className="bi bi-list-task"></i>
                        <span>Mis Tareas</span>
                    </button>
                    <button className="nav-item" onClick={() => navigate('/projects')}>
                        <i className="bi bi-folder"></i>
                        <span>Proyectos</span>
                    </button>
                    <button className="nav-item" onClick={() => navigate('/calendar')}>
                        <i className="bi bi-calendar3"></i>
                        <span>Calendario</span>
                    </button>
                    <button className="nav-item" onClick={() => navigate('/tags')}>
                        <i className="bi bi-tags"></i>
                        <span>Etiquetas</span>
                    </button>
                    <button className="nav-item">
                        <i className="bi bi-file-earmark-text"></i>
                        <span>Plantillas</span>
                    </button>
                    <button className="nav-item active" onClick={() => navigate('/statistics')}>
                        <i className="bi bi-graph-up"></i>
                        <span>Estadísticas</span>
                    </button>
                    <button className="nav-item" onClick={() => navigate('/activity')}>
                        <i className="bi bi-clock-history"></i>
                        <span>Actividad</span>
                    </button>
                    <button className="nav-item">
                        <i className="bi bi-trash"></i>
                        <span>Papelera</span>
                    </button>
                    <hr style={{ margin: '10px 20px', borderColor: '#e9ecef' }} />
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

            <div className="statistics-main-content">
                <div className="header-section">
                    <div>
                        <h1 className="h3 fw-bold mb-1">Estadísticas</h1>
                        <p className="text-muted">Resumen de tu productividad</p>
                    </div>
                    <div>
                        <select className="form-select w-auto">
                            <option>Última semana</option>
                        </select>
                    </div>
                </div>

                {/* Top Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'var(--primary-gradient)' }}>
                            <i className="bi bi-check-circle"></i>
                        </div>
                        <div className="stat-number">{stats.completed_count}</div>
                        <div className="stat-label">Tareas Completadas</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                            <i className="bi bi-list-task"></i>
                        </div>
                        <div className="stat-number">{stats.pending_count}</div>
                        <div className="stat-label">Tareas Pendientes</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                            <i className="bi bi-graph-up"></i>
                        </div>
                        <div className="stat-number">{stats.completion_rate}%</div>
                        <div className="stat-label">Tasa de Efectividad</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                            <i className="bi bi-fire"></i>
                        </div>
                        <div className="stat-number">{stats.streak}</div>
                        <div className="stat-label">Días en Racha</div>
                    </div>
                </div>

                {/* Main Charts Grid */}
                <div className="charts-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
                    <div className="chart-card">
                        <div className="chart-title">Productividad Diaria (Últimos 7 días)</div>
                        <div className="chart-container">
                            <Line data={productivityData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="streak-badge">
                        <i className="bi bi-trophy-fill fs-1 mb-3"></i>
                        <h3 className="mb-2">¡Sigue así!</h3>
                        <p className="mb-0 text-white-50">Has completado {stats.completed_count} tareas</p>
                        <div className="streak-number mt-3">{stats.streak}</div>
                        <small className="text-white-50">Días consecutivos</small>
                    </div>
                </div>

                {/* Secondary Charts Grid */}
                <div className="charts-grid">
                    <div className="chart-card">
                        <div className="chart-title">Tareas por Proyecto</div>
                        <div className="chart-container">
                            {stats.charts.projects.data.length > 0 ? (
                                <Doughnut data={projectData} options={pieOptions} />
                            ) : (
                                <div className="d-flex h-100 justify-content-center align-items-center text-muted">
                                    Sin datos de proyectos
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="chart-card">
                        <div className="chart-title">Distribución por Prioridad</div>
                        <div className="chart-container">
                            <Pie data={priorityData} options={pieOptions} />
                        </div>
                    </div>
                </div>

                {/* Weekday Performance */}
                <div className="chart-card">
                    <div className="chart-title">Rendimiento por Día de la Semana</div>
                    <div className="chart-container" style={{ height: '300px' }}>
                        <Bar data={weekdayData} options={chartOptions} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Statistics;
