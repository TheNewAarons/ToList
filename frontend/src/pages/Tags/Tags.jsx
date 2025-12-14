import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Tags.css';
import logoImage from '../../img/logo-todolist.jpg';

const Tags = () => {
    const navigate = useNavigate();
    const [tags, setTags] = useState([]);
    const [user, setUser] = useState({ username: '' });
    const [showModal, setShowModal] = useState(false);
    const [tasks, setTasks] = useState([]); // All tasks to count relations
    const [expandedTags, setExpandedTags] = useState({}); // { tagId: boolean }

    // Form State
    const [newTag, setNewTag] = useState({
        name: '',
        color: '#667eea',
        icon: 'bi-tag'
    });

    useEffect(() => {
        fetchUserProfile();
        fetchTags();
        fetchTasks();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await api.get('auth/profile/');
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const fetchTags = async () => {
        try {
            const response = await api.get('tags/');
            setTags(response.data);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    const fetchTasks = async () => {
        try {
            const response = await api.get('tasks/');
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleCreateTag = async (e) => {
        e.preventDefault();
        try {
            await api.post('tags/', newTag);
            setShowModal(false);
            setNewTag({ name: '', color: '#667eea', icon: 'bi-tag' });
            fetchTags();
        } catch (error) {
            console.error('Error creating tag:', error);
        }
    };

    const handleDeleteTag = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('¿Estás seguro de eliminar esta etiqueta?')) {
            try {
                await api.delete(`tags/${id}/`);
                fetchTags();
            } catch (error) {
                console.error('Error deleting tag:', error);
            }
        }
    };

    const toggleExpand = (id) => {
        setExpandedTags(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const getTagTaskCount = (tagId) => {
        return tasks.filter(task => task.tags.some(t => t.id === tagId)).length;
    };

    const getTagTasks = (tagId) => {
        return tasks.filter(task => task.tags.some(t => t.id === tagId));
    };

    const getTagSizeClass = (count) => {
        if (count > 20) return 'size-5';
        if (count > 15) return 'size-4';
        if (count > 10) return 'size-3';
        if (count > 5) return 'size-2';
        return 'size-1';
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

    return (
        <div className="tags-page">
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
                    <button className="nav-item active" onClick={() => navigate('/tags')}>
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

            <main className="tags-container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h3 fw-bold">Etiquetas</h1>
                    <button className="btn btn-gradient" onClick={() => setShowModal(true)}>
                        <i className="bi bi-plus-circle"></i> Nueva Etiqueta
                    </button>
                </div>

                {/* Tag Cloud */}
                {tags.length > 0 && (
                    <div className="tag-cloud">
                        <h4 className="mb-4">Nube de Etiquetas</h4>
                        {tags.map(tag => (
                            <div
                                Key={tag.id}
                                className={`tag-cloud-item ${getTagSizeClass(getTagTaskCount(tag.id))}`}
                                style={{ background: tag.color }}
                                onClick={() => {
                                    // Scroll to tag card or expand it
                                    const element = document.getElementById(`tag-card-${tag.id}`);
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth' });
                                        setExpandedTags(prev => ({ ...prev, [tag.id]: true }));
                                    }
                                }}
                            >
                                {tag.name}
                            </div>
                        ))}
                    </div>
                )}

                {/* Filter Section (Placeholder for functionality) */}
                <div className="filter-section">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <input type="text" className="form-control" placeholder="Buscar etiquetas..." />
                        </div>
                        <div className="col-md-6">
                            <select className="form-select">
                                <option>Ordenar por: Recientes</option>
                                <option>Ordenar por: Nombre A-Z</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tag List */}
                <div className="tags-list">
                    {tags.map(tag => (
                        <div
                            key={tag.id}
                            id={`tag-card-${tag.id}`}
                            className="tag-card"
                            style={{ borderLeftColor: tag.color }}
                            onClick={() => toggleExpand(tag.id)}
                        >
                            <div className="tag-header">
                                <div className="tag-name">
                                    <div className="tag-icon" style={{ background: tag.color }}>
                                        <i className={`bi ${tag.icon}`}></i>
                                    </div>
                                    {tag.name}
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                    <span className="tag-count text-muted small">{getTagTaskCount(tag.id)} tareas</span>
                                    <button className="btn btn-sm btn-outline-danger" onClick={(e) => handleDeleteTag(e, tag.id)}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                    <i className={`bi bi-chevron-${expandedTags[tag.id] ? 'up' : 'down'}`}></i>
                                </div>
                            </div>

                            {expandedTags[tag.id] && (
                                <div className="tag-tasks">
                                    {getTagTasks(tag.id).length > 0 ? (
                                        getTagTasks(tag.id).map(task => (
                                            <div key={task.id} className="task-item-tag" onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/tasks/${task.id}`);
                                            }}>
                                                <div>
                                                    <strong>{task.title}</strong>
                                                    <div className="text-muted small">
                                                        {task.project ? `Proyecto: ${task.project.name}` : 'Sin proyecto'}
                                                    </div>
                                                </div>
                                                <button className="btn btn-sm btn-outline-secondary">
                                                    <i className="bi bi-arrow-right"></i>
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-muted small text-center p-2">No hay tareas con esta etiqueta.</div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    {tags.length === 0 && (
                        <div className="text-center p-5 text-muted">
                            <i className="bi bi-tags display-1"></i>
                            <p className="mt-3">No tienes etiquetas creadas.</p>
                        </div>
                    )}
                </div>

            </main>

            {/* Modal */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Nueva Etiqueta</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleCreateTag}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Nombre de la Etiqueta</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newTag.name}
                                            onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Color</label>
                                        <input
                                            type="color"
                                            className="form-control form-control-color"
                                            value={newTag.color}
                                            onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Icono</label>
                                        <select
                                            className="form-select"
                                            value={newTag.icon}
                                            onChange={(e) => setNewTag({ ...newTag, icon: e.target.value })}
                                        >
                                            <option value="bi-tag">🏷️ Tag</option>
                                            <option value="bi-palette">🎨 Diseño</option>
                                            <option value="bi-code-slash">💻 Código</option>
                                            <option value="bi-megaphone">📱 Marketing</option>
                                            <option value="bi-exclamation-circle">⚡ Urgente</option>
                                            <option value="bi-graph-up">📊 Análisis</option>
                                            <option value="bi-people">👥 Reunión</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                    <button type="submit" className="btn btn-gradient">Crear Etiqueta</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tags;
