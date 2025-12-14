import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './TaskDetail.css';
import logoImage from '../../img/logo-todolist.jpg';

const TaskDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState({ username: 'Usuario' });

    // New state for features
    const [newSubtask, setNewSubtask] = useState('');
    const [newComment, setNewComment] = useState('');
    const [newTag, setNewTag] = useState('');

    // Tag State
    const [allTags, setAllTags] = useState([]);
    const [showTagDropdown, setShowTagDropdown] = useState(false);
    const [activeTagMenuId, setActiveTagMenuId] = useState(null);

    // Comment Editing State
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingContent, setEditingContent] = useState('');
    const [activeMenuCommentId, setActiveMenuCommentId] = useState(null);

    useEffect(() => {
        fetchTask();
        fetchTags();
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            // setUser(JSON.parse(storedUser));
        }
    }, [id]);

    const fetchTags = async () => {
        try {
            const response = await api.get('tags/');
            setAllTags(response.data);
        } catch (err) {
            console.error('Error fetching tags:', err);
        }
    };

    const fetchTask = async () => {
        try {
            const response = await api.get(`tasks/${id}/`);
            setTask(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching task:', err);
            setError('Error loading task details');
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
            try {
                await api.delete(`tasks/${id}/`);
                navigate('/todos');
            } catch (err) {
                console.error('Error deleting task:', err);
                alert('Error al eliminar la tarea');
            }
        }
    };

    const handleToggleComplete = async () => {
        try {
            const updatedTask = { ...task, completed: !task.completed };
            await api.patch(`tasks/${id}/`, { completed: !task.completed });
            setTask(updatedTask);
        } catch (err) {
            console.error('Error updating task:', err);
        }
    };

    const handleToggleImportant = async () => {
        try {
            const updatedTask = { ...task, is_important: !task.is_important };
            await api.patch(`tasks/${id}/`, { is_important: !task.is_important });
            setTask(updatedTask);
        } catch (err) {
            console.error('Error updating task importance:', err);
        }
    };

    // Subtasks Handlers
    const handleAddSubtask = async (e) => {
        e.preventDefault();
        if (!newSubtask.trim()) return;
        try {
            await api.post('subtasks/', { title: newSubtask, task: id });
            setNewSubtask('');
            fetchTask();
        } catch (err) {
            console.error('Error adding subtask:', err);
        }
    };

    const handleToggleSubtask = async (subtaskId, currentStatus) => {
        try {
            await api.patch(`subtasks/${subtaskId}/`, { completed: !currentStatus });
            fetchTask();
        } catch (err) {
            console.error('Error toggling subtask:', err);
        }
    };

    const handleDeleteSubtask = async (subtaskId) => {
        try {
            await api.delete(`subtasks/${subtaskId}/`);
            fetchTask();
        } catch (err) {
            console.error('Error deleting subtask:', err);
        }
    };

    // Comments Handlers
    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await api.post('comments/', { content: newComment, task: id });
            setNewComment('');
            fetchTask();
        } catch (err) {
            console.error('Error adding comment:', err);
        }
    };

    const handleEditComment = (comment) => {
        setEditingCommentId(comment.id);
        setEditingContent(comment.content);
        setActiveMenuCommentId(null);
    };

    const handleUpdateComment = async (e) => {
        e.preventDefault();
        if (!editingContent.trim()) return;
        try {
            await api.patch(`comments/${editingCommentId}/`, { content: editingContent });
            setEditingCommentId(null);
            fetchTask();
        } catch (err) {
            console.error('Error updating comment:', err);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('¿Eliminar este comentario?')) return;
        try {
            await api.delete(`comments/${commentId}/`);
            fetchTask();
        } catch (err) {
            console.error('Error deleting comment:', err);
        }
    };

    // Tags Handlers
    const handleAddTag = async (e) => {
        e.preventDefault();
        if (!newTag.trim()) return;

        // Check if tag already exists in allTags
        const existingTag = allTags.find(t => t.name.toLowerCase() === newTag.trim().toLowerCase());

        if (existingTag) {
            handleSelectTag(existingTag);
        } else {
            try {
                // Create new tag
                const tagResponse = await api.post('tags/', { name: newTag });
                const newTagObj = tagResponse.data;
                setAllTags([...allTags, newTagObj]);

                // Add to task
                const currentTagIds = task.tags.map(t => t.id);
                await api.patch(`tasks/${id}/`, { tag_ids: [...currentTagIds, newTagObj.id] });

                setNewTag('');
                setShowTagDropdown(false);
                fetchTask();
            } catch (err) {
                console.error('Error adding tag:', err);
            }
        }
    };

    const handleSelectTag = async (tag) => {
        // Check if already assigned
        if (task.tags.some(t => t.id === tag.id)) {
            setNewTag('');
            setShowTagDropdown(false);
            return;
        }

        try {
            const currentTagIds = task.tags.map(t => t.id);
            await api.patch(`tasks/${id}/`, { tag_ids: [...currentTagIds, tag.id] });
            setNewTag('');
            setShowTagDropdown(false);
            fetchTask();
        } catch (err) {
            console.error('Error assigning tag:', err);
        }
    };

    const handleDeleteTag = async (tagId) => {
        try {
            const currentTagIds = task.tags.map(t => t.id).filter(id => id !== tagId);
            await api.patch(`tasks/${id}/`, { tag_ids: currentTagIds });
            fetchTask();
        } catch (err) {
            console.error('Error removing tag:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? '' : date.toLocaleDateString();
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? '' : date.toLocaleString();
    };

    if (loading) return <div className="p-5 text-center">Cargando...</div>;
    if (error) return <div className="p-5 text-center text-danger">{error}</div>;
    if (!task) return <div className="p-5 text-center">Tarea no encontrada</div>;

    const completedSubtasks = task.subtasks ? task.subtasks.filter(st => st.completed).length : 0;
    const totalSubtasks = task.subtasks ? task.subtasks.length : 0;
    const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    return (
        <div className="task-detail-page">
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
                <button onClick={() => navigate(-1)} className="back-link">
                    <i className="bi bi-arrow-left"></i>
                    Volver
                </button>

                {/* Task Header */}
                <div className="task-detail-header">
                    <div className="task-header-top">
                        <h1>{task.title}</h1>
                        <div className="task-actions-header">
                            <button className="btn-icon" onClick={() => navigate(`/edit/${id}`)} title="Editar">
                                <i className="bi bi-pencil"></i>
                            </button>
                            <button
                                className={`btn-icon ${task.is_important ? 'text-warning' : ''}`}
                                onClick={handleToggleImportant}
                                title="Marcar como importante"
                            >
                                <i className={`bi ${task.is_important ? 'bi-star-fill' : 'bi-star'}`}></i>
                            </button>
                            <button className="btn-icon delete" onClick={handleDelete} title="Eliminar">
                                <i className="bi bi-trash"></i>
                            </button>
                            <button className="btn-complete" onClick={handleToggleComplete}>
                                <i className={`bi ${task.completed ? 'bi-arrow-counterclockwise' : 'bi-check2'}`}></i>
                                {task.completed ? 'Marcar Pendiente' : 'Marcar Completa'}
                            </button>
                        </div>
                    </div>
                    <div className="task-meta-row">
                        <div className="meta-item">
                            <label>Estado</label>
                            <span className={`status-badge ${task.completed ? 'completed' : ''}`}>
                                {task.completed ? 'Completada' : 'En Progreso'}
                            </span>
                        </div>
                        <div className="meta-item">
                            <label>Prioridad</label>
                            <span className={`task-priority priority-${task.priority}`}>
                                {task.priority === 'high' ? 'Alta' : task.priority === 'low' ? 'Baja' : 'Media'}
                            </span>
                        </div>
                        <div className="meta-item">
                            <label>Fecha de Vencimiento</label>
                            <span>
                                <i className="bi bi-calendar3"></i>
                                {task.due_date ? formatDate(task.due_date) : 'No establecida'}
                            </span>
                        </div>
                        <div className="meta-item">
                            <label>Proyecto</label>
                            <span>
                                <i className="bi bi-folder"></i>
                                {task.project ? task.project.name : 'Ninguno'}
                            </span>
                        </div>
                        <div className="meta-item">
                            <label>Asignado a</label>
                            <span><i className="bi bi-person"></i> {task.user?.username || user.username}</span>
                        </div>
                    </div>
                </div>

                <div className="content-grid">
                    {/* Main Column */}
                    <div className="main-column">
                        {/* Description */}
                        <div className="content-card">
                            <h2><i className="bi bi-text-paragraph"></i> Descripción</h2>
                            <div className="task-description">
                                <p>{task.description || 'Sin descripción detallada.'}</p>
                            </div>
                        </div>

                        {/* Subtasks */}
                        <div className="content-card">
                            <h2><i className="bi bi-list-check"></i> Subtareas</h2>
                            <form onSubmit={handleAddSubtask} className="add-subtask-form mb-3">
                                <div className="subtask-input-wrapper">
                                    <input
                                        type="text"
                                        placeholder="Agregar nueva subtarea..."
                                        value={newSubtask}
                                        onChange={(e) => setNewSubtask(e.target.value)}
                                        className="form-control"
                                    />
                                    <button type="submit" className="btn-add-subtask">
                                        <i className="bi bi-plus-lg"></i>
                                    </button>
                                </div>
                            </form>

                            <ul className="subtask-list">
                                {Array.isArray(task.subtasks) && task.subtasks.map(st => (
                                    <li key={st.id} className={`subtask-item ${st.completed ? 'completed' : ''}`}>
                                        <div
                                            className={`subtask-checkbox ${st.completed ? 'checked' : ''}`}
                                            onClick={() => handleToggleSubtask(st.id, st.completed)}
                                        >
                                            {st.completed && <i className="bi bi-check"></i>}
                                        </div>
                                        <span>{st.title}</span>
                                        <button
                                            className="btn-icon-sm ms-auto text-danger"
                                            onClick={() => handleDeleteSubtask(st.id)}
                                        >
                                            <i className="bi bi-x"></i>
                                        </button>
                                    </li>
                                ))}
                                {(!task.subtasks || task.subtasks.length === 0) && (
                                    <p className="text-muted small">No hay subtareas.</p>
                                )}
                            </ul>

                            {totalSubtasks > 0 && (
                                <div className="progress-overview mt-3">
                                    <div className="progress-bar-lg">
                                        <div className="fill" style={{ width: `${progress}%` }}></div>
                                    </div>
                                    <span className="progress-text">{completedSubtasks}/{totalSubtasks} completadas</span>
                                </div>
                            )}
                        </div>

                        {/* Comments */}
                        <div className="content-card">
                            <h2><i className="bi bi-chat-dots"></i> Comentarios</h2>
                            <div className="comments-list">
                                {Array.isArray(task.comments) && task.comments.map(comment => (
                                    <div key={comment.id} className="comment-item">
                                        <div className="comment-avatar">
                                            {comment.user?.username?.substring(0, 2).toUpperCase() || 'U'}
                                        </div>
                                        <div className="comment-content">
                                            <div className="comment-header">
                                                <strong>{comment.user?.username || 'Usuario'}</strong>
                                                <div className="comment-actions-group">
                                                    <time>{formatDateTime(comment.created_at)}</time>
                                                    <div className="comment-menu-wrapper">
                                                        <button
                                                            className="btn-comment-options"
                                                            onClick={() => setActiveMenuCommentId(activeMenuCommentId === comment.id ? null : comment.id)}
                                                        >
                                                            <i className="bi bi-three-dots-vertical"></i>
                                                        </button>
                                                        {activeMenuCommentId === comment.id && (
                                                            <div className="comment-dropdown">
                                                                <button onClick={() => handleEditComment(comment)}>
                                                                    <i className="bi bi-pencil"></i> Editar
                                                                </button>
                                                                <button onClick={() => handleDeleteComment(comment.id)} className="text-danger">
                                                                    <i className="bi bi-trash"></i> Eliminar
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {editingCommentId === comment.id ? (
                                                <form onSubmit={handleUpdateComment} className="edit-comment-form">
                                                    <input
                                                        type="text"
                                                        value={editingContent}
                                                        onChange={(e) => setEditingContent(e.target.value)}
                                                        autoFocus
                                                    />
                                                    <div className="edit-actions">
                                                        <button type="submit" className="btn-save">Guardar</button>
                                                        <button type="button" className="btn-cancel" onClick={() => setEditingCommentId(null)}>Cancelar</button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <p className="comment-text">{comment.content}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {(!task.comments || task.comments.length === 0) && (
                                    <p className="text-muted small mb-3">No hay comentarios aún.</p>
                                )}
                            </div>
                            <form onSubmit={handleAddComment} className="add-comment">
                                <input
                                    type="text"
                                    placeholder="Escribe un comentario..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <button type="submit"><i className="bi bi-send"></i></button>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="sidebar-column">
                        {/* Details */}
                        <div className="content-card">
                            <h2><i className="bi bi-info-circle"></i> Detalles</h2>
                            <div className="info-item">
                                <i className="bi bi-calendar-plus"></i>
                                <div>
                                    <label>Fecha de creación</label>
                                    <span>{formatDate(task.created_at)}</span>
                                </div>
                            </div>
                            <div className="info-item">
                                <i className="bi bi-clock-history"></i>
                                <div>
                                    <label>Última actualización</label>
                                    <span>Hoy</span>
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="content-card">
                            <h2><i className="bi bi-tags"></i> Etiquetas</h2>
                            <div className="tags-list mb-3">
                                {Array.isArray(task.tags) && task.tags.map(tag => (
                                    <div key={tag.id} className="tag-wrapper">
                                        <span className="tag">{tag.name}</span>
                                        <button
                                            className="tag-menu-btn"
                                            onClick={() => setActiveTagMenuId(activeTagMenuId === tag.id ? null : tag.id)}
                                        >
                                            <i className="bi bi-three-dots-vertical"></i>
                                        </button>
                                        {activeTagMenuId === tag.id && (
                                            <div className="tag-dropdown-menu">
                                                <button onClick={() => handleDeleteTag(tag.id)} className="text-danger">
                                                    <i className="bi bi-trash"></i> Eliminar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {(!task.tags || task.tags.length === 0) && (
                                    <span className="text-muted small">Sin etiquetas</span>
                                )}
                            </div>
                            <form onSubmit={handleAddTag} className="tag-input-form">
                                <div className="tag-input-wrapper">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Nueva etiqueta"
                                        value={newTag}
                                        onChange={(e) => {
                                            setNewTag(e.target.value);
                                            setShowTagDropdown(true);
                                        }}
                                        onFocus={() => setShowTagDropdown(true)}
                                    />
                                    <button type="submit" className="btn btn-sm btn-outline-primary">
                                        <i className="bi bi-plus"></i>
                                    </button>

                                    {showTagDropdown && newTag && (
                                        <div className="tag-suggestions">
                                            {allTags
                                                .filter(t => t.name.toLowerCase().includes(newTag.toLowerCase()))
                                                .map(tag => (
                                                    <button
                                                        key={tag.id}
                                                        type="button"
                                                        className="tag-suggestion-item"
                                                        onClick={() => handleSelectTag(tag)}
                                                    >
                                                        {tag.name}
                                                    </button>
                                                ))
                                            }
                                            {!allTags.some(t => t.name.toLowerCase() === newTag.toLowerCase()) && (
                                                <button type="submit" className="tag-suggestion-item create-new">
                                                    <i className="bi bi-plus"></i> Crear "{newTag}"
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Activity (Mocked for now as we don't have an activity log model yet) */}
                        <div className="content-card">
                            <h2><i className="bi bi-activity"></i> Actividad Reciente</h2>
                            <div className="activity-item">
                                <div className="activity-dot"></div>
                                <div>
                                    <p><strong>Tú</strong> viste esta tarea</p>
                                    <time>Ahora</time>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TaskDetail;
