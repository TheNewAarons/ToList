import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Today.css';
import logoImage from '../../img/logo-todolist.jpg';

const Today = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [user, setUser] = useState({ username: '', first_name: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserProfile();
        fetchTasks();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await api.get('auth/profile/');
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
            const storedUser = localStorage.getItem('user');
            if (storedUser) setUser(JSON.parse(storedUser));
        }
    };

    const fetchTasks = async () => {
        try {
            const response = await api.get('tasks/');
            setTasks(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setLoading(false);
        }
    };

    const handleToggleComplete = async (task) => {
        try {
            const updatedTask = { ...task, completed: !task.completed };
            setTasks(tasks.map(t => t.id === task.id ? updatedTask : t)); // Optimistic update
            await api.patch(`tasks/${task.id}/`, { completed: !task.completed });
        } catch (err) {
            console.error('Error updating task:', err);
            fetchTasks(); // Revert on error
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

    // Date Logic
    const today = new Date();
    const isSameDay = (d1, d2) => {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    };

    const todayTasks = tasks.filter(task => {
        if (!task.due_date) return false;
        const taskDate = new Date(task.due_date);
        return isSameDay(taskDate, today);
    });

    const overdueTasks = tasks.filter(task => {
        if (!task.due_date || task.completed) return false;
        const taskDate = new Date(task.due_date);
        return taskDate < today && !isSameDay(taskDate, today);
    });

    // Categorize Today Tasks
    const morningTasks = todayTasks.filter(task => {
        const hour = new Date(task.due_date).getHours();
        return hour < 12;
    });

    const afternoonTasks = todayTasks.filter(task => {
        const hour = new Date(task.due_date).getHours();
        return hour >= 12 && hour < 18;
    });

    const eveningTasks = todayTasks.filter(task => {
        const hour = new Date(task.due_date).getHours();
        return hour >= 18;
    });

    const completedTodayCount = todayTasks.filter(t => t.completed).length;
    const pendingTodayCount = todayTasks.length - completedTodayCount;

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const renderTaskItem = (task) => (
        <div key={task.id} className="task-item-today">
            <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task)}
            />
            <div className="task-content">
                <div className={`task-title-today ${task.completed ? 'text-decoration-line-through text-muted' : ''}`}>
                    {task.title}
                    {task.priority === 'high' && <span className="priority-badge-high">Alta</span>}
                    {task.priority === 'medium' && <span className="priority-badge-medium">Media</span>}
                    {task.priority === 'low' && <span className="priority-badge-low">Baja</span>}
                </div>
                <div className="task-meta-today">
                    <i className="bi bi-clock"></i> {formatTime(task.due_date)} |
                    <i className="bi bi-folder"></i> {task.project ? task.project.name : 'General'}
                </div>
            </div>
            {task.completed ? (
                <span className="badge bg-success">Completada</span>
            ) : (
                <button onClick={() => navigate(`/tasks/${task.id}`)} className="btn btn-sm btn-outline-secondary">
                    <i className="bi bi-arrow-right"></i>
                </button>
            )}
        </div>
    );

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Buenos días';
        if (hour < 18) return 'Buenas tardes';
        return 'Buenas noches';
    };

    return (
        <div className="today-page">
            <aside className="sidebar">
                <div className="logo">
                    <img src={logoImage} alt="TaskFlow Logo" className="logo-image" />
                </div>
                <nav>
                    <button className="nav-item" onClick={() => navigate('/todos')}>
                        <i className="bi bi-house-door"></i>
                        <span>Dashboard</span>
                    </button>
                    <button className="nav-item active">
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
                    <button className="nav-item" onClick={() => navigate('/templates')}>
                        <i className="bi bi-file-earmark-text"></i>
                        <span>Plantillas</span>
                    </button>
                    <button className="nav-item" onClick={() => navigate('/statistics')}>
                        <i className="bi bi-graph-up"></i>
                        <span>Estadísticas</span>
                    </button>
                    <button className="nav-item" onClick={() => navigate('/activity')}>
                        <i className="bi bi-clock-history"></i>
                        <span>Actividad</span>
                    </button>
                    <button className="nav-item" onClick={() => navigate('/trash')}>
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
                    <button onClick={handleLogout} className="ms-auto text-muted" style={{ border: 'none', background: 'none' }}>
                        <i className="bi bi-box-arrow-right"></i>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                {/* Greeting Section */}
                <div className="greeting-section">
                    <h1>¡{getGreeting()}, {user.first_name || user.username}! ☀️</h1>
                    <p className="current-date">
                        {today.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <div className="quick-stats">
                        <div className="quick-stat">
                            <div className="quick-stat-number">{todayTasks.length}</div>
                            <div>Tareas para hoy</div>
                        </div>
                        <div className="quick-stat">
                            <div className="quick-stat-number">{completedTodayCount}</div>
                            <div>Completadas</div>
                        </div>
                        <div className="quick-stat">
                            <div className="quick-stat-number">{pendingTodayCount}</div>
                            <div>Pendientes</div>
                        </div>
                    </div>
                </div>

                {/* Morning Tasks */}
                <div className="section-header">
                    <div className="section-title">
                        <i className="bi bi-sunrise text-warning"></i>
                        Mañana (00:00 AM - 12:00 PM)
                    </div>
                </div>

                <div className="time-slot">
                    {morningTasks.length > 0 ? morningTasks.map(renderTaskItem) : <div className="text-muted text-center p-3">No hay tareas para la mañana</div>}
                </div>

                {/* Afternoon Tasks */}
                <div className="section-header mt-4">
                    <div className="section-title">
                        <i className="bi bi-sun text-warning"></i>
                        Tarde (12:00 PM - 6:00 PM)
                    </div>
                </div>

                <div className="time-slot">
                    {afternoonTasks.length > 0 ? afternoonTasks.map(renderTaskItem) : <div className="text-muted text-center p-3">No hay tareas para la tarde</div>}
                </div>

                {/* Evening Tasks */}
                <div className="section-header mt-4">
                    <div className="section-title">
                        <i className="bi bi-moon text-primary"></i>
                        Noche (6:00 PM - 12:00 AM)
                    </div>
                </div>

                <div className="time-slot">
                    {eveningTasks.length > 0 ? eveningTasks.map(renderTaskItem) : <div className="text-muted text-center p-3">No hay tareas para la noche</div>}
                </div>

                {/* Suggested/Overdue Tasks */}
                {(overdueTasks.length > 0) && (
                    <>
                        <div className="section-header mt-5">
                            <div className="section-title">
                                <i className="bi bi-lightbulb text-warning"></i>
                                Tareas Sugeridas (Vencidas)
                            </div>
                        </div>

                        <div className="time-slot">
                            <p className="text-muted mb-3">
                                <i className="bi bi-info-circle"></i> Estas tareas están vencidas o necesitan atención
                            </p>
                            {overdueTasks.map(task => (
                                <div key={task.id} className="task-item-today">
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => handleToggleComplete(task)}
                                    />
                                    <div className="task-content">
                                        <div className="task-title-today">
                                            {task.title}
                                            <span className="badge bg-danger ms-2">Vencida</span>
                                        </div>
                                        <div className="task-meta-today">
                                            <i className="bi bi-calendar-x"></i> Venció: {new Date(task.due_date).toLocaleDateString()} |
                                            <i className="bi bi-folder"></i> {task.project ? task.project.name : 'General'}
                                        </div>
                                    </div>
                                    <button onClick={() => navigate(`/tasks/${task.id}`)} className="btn btn-sm btn-outline-secondary">
                                        <i className="bi bi-arrow-right"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Quick Add */}
                <div className="text-center mt-4">
                    <button
                        onClick={() => navigate('/create', { state: { initialDate: today.toISOString().split('T')[0] } })}
                        className="btn btn-gradient"
                    >
                        <i className="bi bi-plus-circle"></i> Agregar Nueva Tarea
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Today;
