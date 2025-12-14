import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './ImportantTasks.css';
import logoImage from '../../img/logo-todolist.jpg';

const ImportantTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'high', 'today', 'pending', 'completed'
    const [stats, setStats] = useState({
        total: 0,
        highPriority: 0,
        completedToday: 0
    });
    const [user, setUser] = useState({ username: 'Usuario' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            // setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        filterTasks();
        calculateStats();
    }, [tasks, activeFilter]);

    const fetchTasks = async () => {
        try {
            const response = await api.get('tasks/');
            const importantTasks = response.data.filter(task => task.is_important);
            setTasks(importantTasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        }
    };

    const calculateStats = () => {
        const total = tasks.length;
        const highPriority = tasks.filter(t => t.priority === 'high').length;

        // precise "Completed Today" logic would require a completed_at timestamp
        // For now we will approximate or check if the API provides it.
        // Assuming we might not have it, we'll just count completed important tasks
        // Or if we want to be strict about "Today", we'd need that field.
        // Let's count all completed important tasks for the "Completed" stat card for simplified UX if data missing
        const completed = tasks.filter(t => t.completed).length;

        setStats({
            total,
            highPriority,
            completedToday: completed // Renaming contextually to "Completed" if we lack timestamp
        });
    };

    const filterTasks = () => {
        let result = tasks;
        const today = new Date().toISOString().split('T')[0];

        switch (activeFilter) {
            case 'high':
                result = result.filter(t => t.priority === 'high');
                break;
            case 'today':
                result = result.filter(t => t.due_date && t.due_date.startsWith(today));
                break;
            case 'pending':
                result = result.filter(t => !t.completed);
                break;
            case 'completed':
                result = result.filter(t => t.completed);
                break;
            default:
                break;
        }
        setFilteredTasks(result);
    };

    const handleToggleImportant = async (e, task) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            // Optimistic update
            const updatedTasks = tasks.filter(t => t.id !== task.id);
            setTasks(updatedTasks);

            await api.patch(`tasks/${task.id}/`, { is_important: !task.is_important });
        } catch (error) {
            console.error('Error toggling importance:', error);
            fetchTasks(); // Revert on error
        }
    };

    const getPriorityLabel = (priority) => {
        switch (priority) {
            case 'high': return 'Alta';
            case 'medium': return 'Media';
            case 'low': return 'Baja';
            default: return 'Media';
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="important-tasks-page">
            {/* Sidebar */}
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
                    <button className="nav-item active" onClick={() => navigate('/important')}>
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
                        <div className="star-icon">
                            <i className="bi bi-star-fill"></i>
                        </div>
                        <div>
                            <h1>Tareas Importantes</h1>
                            <p>Tus tareas prioritarias y destacadas</p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/create')} className="btn-add">
                        <i className="bi bi-plus-lg"></i>
                        Nueva Tarea
                    </button>
                </div>

                {/* Stats Row */}
                <div className="stats-row">
                    <div className="stat-card">
                        <div className="stat-icon stat-icon-yellow">
                            <i className="bi bi-star-fill"></i>
                        </div>
                        <div className="stat-info">
                            <h3>{stats.total}</h3>
                            <p>Tareas importantes</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon stat-icon-red">
                            <i className="bi bi-exclamation-triangle-fill"></i>
                        </div>
                        <div className="stat-info">
                            <h3>{stats.highPriority}</h3>
                            <p>Prioridad alta</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon stat-icon-green">
                            <i className="bi bi-check-circle-fill"></i>
                        </div>
                        <div className="stat-info">
                            <h3>{stats.completedToday}</h3>
                            <p>Completadas</p>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="filter-tabs">
                    <button
                        className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('all')}
                    >
                        Todas ({tasks.length})
                    </button>
                    <button
                        className={`filter-tab ${activeFilter === 'high' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('high')}
                    >
                        Prioridad Alta ({tasks.filter(t => t.priority === 'high').length})
                    </button>
                    <button
                        className={`filter-tab ${activeFilter === 'today' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('today')}
                    >
                        Vencen Hoy ({tasks.filter(t => t.due_date && t.due_date.startsWith(new Date().toISOString().split('T')[0])).length})
                    </button>
                    <button
                        className={`filter-tab ${activeFilter === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('pending')}
                    >
                        Pendientes ({tasks.filter(t => !t.completed).length})
                    </button>
                    <button
                        className={`filter-tab ${activeFilter === 'completed' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('completed')}
                    >
                        Completadas ({tasks.filter(t => t.completed).length})
                    </button>
                </div>

                {/* Tasks Grid */}
                <div className="tasks-grid">
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map(task => (
                            <div
                                key={task.id}
                                className={`task-card ${task.completed ? 'completed' : ''}`}
                                onClick={() => navigate(`/tasks/${task.id}`)}
                            >
                                <span
                                    className="star-badge"
                                    onClick={(e) => handleToggleImportant(e, task)}
                                >
                                    <i className="bi bi-star-fill"></i>
                                </span>
                                <div className="task-card-header">
                                    <h3>{task.title}</h3>
                                    <span className={`task-priority priority-${task.priority}`}>
                                        {getPriorityLabel(task.priority)}
                                    </span>
                                </div>
                                <p className="task-description">{task.description || 'Sin descripción'}</p>
                                <div className="task-card-meta">
                                    <span>
                                        <i className="bi bi-calendar3"></i>
                                        {task.due_date
                                            ? `Vence: ${new Date(task.due_date).toLocaleDateString()}`
                                            : `Creado: ${new Date(task.created_at).toLocaleDateString()}`}
                                    </span>
                                    <span>
                                        <i className="bi bi-folder"></i>
                                        {task.project ? task.project.name : 'General'}
                                    </span>
                                    <span>
                                        <i className="bi bi-check2-square"></i>
                                        {task.subtasks ? `${task.subtasks.filter(st => st.completed).length}/${task.subtasks.length}` : '0/0'} subtareas
                                    </span>
                                </div>
                                <div className="task-card-footer">
                                    <div className="task-tags">
                                        {task.tags && task.tags.length > 0 ? (
                                            task.tags.map(tag => (
                                                <span key={tag.id} className="task-tag">{tag.name}</span>
                                            ))
                                        ) : (
                                            <span className="task-tag" style={{ background: 'transparent', color: '#94a3b8' }}>Sin etiquetas</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <i className="bi bi-star"></i>
                            </div>
                            <h3>No hay tareas importantes</h3>
                            <p>Marca tus tareas como importantes para verlas aquí</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ImportantTasks;
