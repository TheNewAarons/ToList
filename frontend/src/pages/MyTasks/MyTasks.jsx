import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './MyTasks.css';
import logoImage from '../../img/logo-todolist.jpg';

const MyTasks = () => {
    const [todos, setTodos] = useState([]);
    const [filteredTodos, setFilteredTodos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [tagFilter, setTagFilter] = useState('');
    const [showFavorites, setShowFavorites] = useState(false);
    const [projectFilter, setProjectFilter] = useState('');
    const [allTags, setAllTags] = useState([]);
    const [allProjects, setAllProjects] = useState([]);
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: 'Usuario' });

    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

    useEffect(() => {
        fetchTodos();
        fetchTags();
        fetchProjects();
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            // setUser(JSON.parse(storedUser)); // Assuming we store user info later
        }
    }, []);

    useEffect(() => {
        filterTodos();
    }, [todos, searchTerm, statusFilter, priorityFilter, tagFilter, showFavorites, projectFilter]);

    const fetchTodos = async () => {
        try {
            const response = await api.get('tasks/');
            setTodos(response.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
            if (error.response && error.response.status === 401) {
                navigate('/login');
            }
        }
    };

    const fetchTags = async () => {
        try {
            const response = await api.get('tags/');
            setAllTags(response.data);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await api.get('projects/');
            setAllProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const filterTodos = () => {
        let result = todos;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(todo =>
                todo.title.toLowerCase().includes(term) ||
                (todo.description && todo.description.toLowerCase().includes(term))
            );
        }

        if (statusFilter) {
            if (statusFilter === 'completed') {
                result = result.filter(todo => todo.completed);
            } else if (statusFilter === 'pending') {
                result = result.filter(todo => !todo.completed);
            }
        }

        if (priorityFilter) {
            result = result.filter(todo => todo.priority === priorityFilter);
        }

        if (tagFilter) {
            result = result.filter(todo => todo.tags && todo.tags.some(tag => tag.id === parseInt(tagFilter)));
        }

        if (showFavorites) {
            result = result.filter(todo => todo.is_important);
        }

        if (projectFilter) {
            result = result.filter(todo => todo.project && todo.project.id === parseInt(projectFilter));
        }

        setFilteredTodos(result);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const getPriorityLabel = (priority) => {
        switch (priority) {
            case 'high': return 'Alta';
            case 'medium': return 'Media';
            case 'low': return 'Baja';
            default: return 'Media';
        }
    };

    return (
        <div className="my-tasks-page">
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
                    <button className="nav-item" onClick={() => navigate('/important')}>
                        <i className="bi bi-star"></i>
                        <span>Importantes</span>
                    </button>
                    <button className="nav-item active" onClick={() => navigate('/my-tasks')}>
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
                    <button className="nav-item" onClick={() => navigate('/statistics')}>
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
                    <div>
                        <h1>Mis Tareas</h1>
                        <p>Gestiona y organiza todas tus tareas</p>
                    </div>
                    <button onClick={() => navigate('/create')} className="btn-add">
                        <i className="bi bi-plus-lg"></i>
                        Nueva Tarea
                    </button>
                </div>

                {/* Search and Filters */}
                <div className="search-filters">
                    <div className="search-box">
                        <i className="bi bi-search"></i>
                        <input
                            type="text"
                            placeholder="Buscar tareas por nombre, proyecto o etiqueta..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filters-row">
                        <select
                            className="filter-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">Todos los estados</option>
                            <option value="pending">Pendientes</option>
                            <option value="completed">Completadas</option>
                        </select>
                        <select
                            className="filter-select"
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                        >
                            <option value="">Todas las prioridades</option>
                            <option value="high">Alta</option>
                            <option value="medium">Media</option>
                            <option value="low">Baja</option>
                        </select>
                        <select
                            className="filter-select"
                            value={tagFilter}
                            onChange={(e) => setTagFilter(e.target.value)}
                        >
                            <option value="">Todas las etiquetas</option>
                            {allTags.map(tag => (
                                <option key={tag.id} value={tag.id}>{tag.name}</option>
                            ))}
                        </select>
                        <select
                            className="filter-select"
                            value={projectFilter}
                            onChange={(e) => setProjectFilter(e.target.value)}
                        >
                            <option value="">Todos los proyectos</option>
                            {allProjects.map(project => (
                                <option key={project.id} value={project.id}>{project.name}</option>
                            ))}
                        </select>
                        <button
                            className={`filter-btn ${showFavorites ? 'active' : ''}`}
                            onClick={() => setShowFavorites(!showFavorites)}
                            title="Mostrar solo favoritos"
                            style={{
                                background: showFavorites ? '#fff3cd' : 'white',
                                color: showFavorites ? '#856404' : '#64748b',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                padding: '0.5rem 1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer'
                            }}
                        >
                            <i className={`bi ${showFavorites ? 'bi-star-fill' : 'bi-star'}`}></i>
                            Favoritos
                        </button>
                        <div className="view-toggle">
                            <button
                                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                <i className="bi bi-list"></i>
                            </button>
                            <button
                                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <i className="bi bi-grid-3x3-gap"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Info */}
                <div className="results-info">
                    <p>Mostrando <strong>{filteredTodos.length}</strong> tareas de <strong>{todos.length}</strong> en total</p>
                    <select className="sort-select">
                        <option value="">Ordenar por: Fecha de vencimiento</option>
                        <option value="priority">Prioridad</option>
                        <option value="name">Nombre</option>
                    </select>
                </div>

                {/* Tasks Grid */}
                <div className={`tasks-container ${viewMode}`}>
                    {filteredTodos.map(todo => (
                        <div
                            key={todo.id}
                            className={`task-card ${todo.completed ? 'completed' : ''}`}
                            onClick={() => navigate(`/tasks/${todo.id}`)}
                        >
                            <div className="task-card-header">
                                <h3>{todo.title}</h3>
                                <span className={`task-priority priority-${todo.priority}`}>
                                    {getPriorityLabel(todo.priority)}
                                </span>
                            </div>
                            <p className="task-description">{todo.description || 'Sin descripción'}</p>
                            <div className="task-card-meta">
                                <span>
                                    <i className="bi bi-calendar3"></i>
                                    {todo.due_date
                                        ? `Vence: ${new Date(todo.due_date).toLocaleDateString()}`
                                        : `Creado: ${new Date(todo.created_at).toLocaleDateString()}`}
                                </span>
                                <span><i className="bi bi-folder"></i>General</span>
                                <span>
                                    <i className="bi bi-check2-square"></i>
                                    {todo.subtasks ? `${todo.subtasks.filter(st => st.completed).length}/${todo.subtasks.length}` : '0/0'} subtareas
                                </span>
                            </div>
                            <div className="task-card-footer">
                                <div className="task-tags">
                                    {todo.tags && todo.tags.length > 0 ? (
                                        todo.tags.map(tag => (
                                            <span key={tag.id} className="task-tag">{tag.name}</span>
                                        ))
                                    ) : (
                                        <span className="task-tag text-muted" style={{ background: '#f1f5f9' }}>Sin etiquetas</span>
                                    )}
                                </div>
                                <div className="task-progress">
                                    {(() => {
                                        const totalSubtasks = todo.subtasks ? todo.subtasks.length : 0;
                                        const completedSubtasks = todo.subtasks ? todo.subtasks.filter(st => st.completed).length : 0;
                                        let progress = 0;

                                        if (todo.completed) {
                                            progress = 100;
                                        } else if (totalSubtasks > 0) {
                                            progress = Math.round((completedSubtasks / totalSubtasks) * 100);
                                        }

                                        return (
                                            <>
                                                <div className="progress-bar-container">
                                                    <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                                                </div>
                                                <span className="progress-text">{progress}%</span>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <nav className="pagination-wrapper">
                    <ul className="pagination">
                        <li className="page-item">
                            <button className="page-link"><i className="bi bi-chevron-left"></i></button>
                        </li>
                        <li className="page-item active"><button className="page-link">1</button></li>
                        <li className="page-item"><button className="page-link">2</button></li>
                        <li className="page-item"><button className="page-link">3</button></li>
                        <li className="page-item">
                            <button className="page-link"><i className="bi bi-chevron-right"></i></button>
                        </li>
                    </ul>
                </nav>
            </main>
        </div>
    );
};

export default MyTasks;
