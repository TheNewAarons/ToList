import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './TodoList.css';
import logoImage from '../../img/logo-todolist.jpg';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await api.get('tasks/');
            setTodos(response.data);
        } catch (err) {
            console.error('Error fetching todos:', err);
            if (err.response && err.response.status === 401) {
                navigate('/login');
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`tasks/${id}/`);
            fetchTodos();
        } catch (err) {
            console.error('Error deleting todo:', err);
        }
    };

    const handleToggleComplete = async (todo) => {
        try {
            await api.patch(`tasks/${todo.id}/`, { completed: !todo.completed });
            fetchTodos();
        } catch (err) {
            console.error('Error updating todo:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === 'pending') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    const stats = {
        total: todos.length,
        completed: todos.filter(t => t.completed).length,
        pending: todos.filter(t => !t.completed).length,
        // Mocking 'overdue' as we don't have due dates yet
        overdue: 0
    };

    return (
        <div className="todo-page">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="logo">
                    <img src={logoImage} alt="TaskFlow Logo" className="logo-image" />
                </div>

                <nav>
                    <button className="nav-item active" onClick={() => navigate('/todos')}>
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
                        <h6>Usuario</h6>
                        <small>Plan Pro</small>
                    </div>
                    <button onClick={handleLogout} className="ms-auto text-muted btn btn-link p-0">
                        <i className="bi bi-box-arrow-right" style={{ fontSize: '1.2rem' }}></i>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <div className="header">
                    <div>
                        <h1>Buenos días 👋</h1>
                        <p>Tienes {stats.pending} tareas pendientes</p>
                    </div>
                    <button onClick={() => navigate('/create')} className="btn-add">
                        <i className="bi bi-plus-lg"></i>
                        Nueva Tarea
                    </button>
                </div>

                {/* Stats */}
                <div className="stats-row">
                    <div className="stat-card">
                        <div className="icon blue"><i className="bi bi-list-check"></i></div>
                        <h3>{stats.total}</h3>
                        <p>Total de Tareas</p>
                    </div>
                    <div className="stat-card">
                        <div className="icon green"><i className="bi bi-check-circle"></i></div>
                        <h3>{stats.completed}</h3>
                        <p>Completadas</p>
                    </div>
                    <div className="stat-card">
                        <div className="icon orange"><i className="bi bi-clock"></i></div>
                        <h3>{stats.pending}</h3>
                        <p>En Progreso</p>
                    </div>
                    <div className="stat-card">
                        <div className="icon purple"><i className="bi bi-exclamation-circle"></i></div>
                        <h3>{stats.overdue}</h3>
                        <p>Vencidas</p>
                    </div>
                </div>

                {/* Tasks List */}
                <div className="tasks-section">
                    <div className="section-header">
                        <h2>Tareas</h2>
                        <div className="filter-tabs">
                            <button
                                className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                                onClick={() => setFilter('all')}
                            >
                                Todas
                            </button>
                            <button
                                className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
                                onClick={() => setFilter('pending')}
                            >
                                Pendientes
                            </button>
                            <button
                                className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
                                onClick={() => setFilter('completed')}
                            >
                                Completadas
                            </button>
                        </div>
                    </div>

                    {filteredTodos.map((todo) => (
                        <div key={todo.id} className={`task-item ${todo.completed ? 'completed' : ''}`}>
                            <div
                                className={`task-checkbox ${todo.completed ? 'checked' : ''}`}
                                onClick={() => handleToggleComplete(todo)}
                            >
                                <i className="bi bi-check"></i>
                            </div>
                            <div
                                className="task-content"
                                onClick={() => navigate(`/tasks/${todo.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <h4>{todo.title}</h4>
                                <div className="task-meta">
                                    <span><i className="bi bi-card-text"></i>{todo.description || 'Sin descripción'}</span>
                                    <span>
                                        <i className="bi bi-calendar3"></i>
                                        {todo.due_date
                                            ? new Date(todo.due_date).toLocaleDateString()
                                            : new Date(todo.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <span className={`task-priority priority-${todo.priority}`}>
                                {todo.priority === 'high' ? 'Alta' : todo.priority === 'low' ? 'Baja' : 'Media'}
                            </span>
                            <div className="task-actions">
                                <button><i className="bi bi-pencil"></i></button>
                                <button className="delete" onClick={() => handleDelete(todo.id)}>
                                    <i className="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredTodos.length === 0 && (
                        <p className="text-center text-muted my-5">No hay tareas en esta lista.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default TodoList;
