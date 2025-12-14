import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Projects.css';
import logoImage from '../../img/logo-todolist.jpg';

const Projects = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [user, setUser] = useState({ username: 'Usuario' });
    const [openProjectId, setOpenProjectId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', description: '', color: '#3b82f6' });
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [assignProjectId, setAssignProjectId] = useState(null);
    const [selectedTasksToAssign, setSelectedTasksToAssign] = useState([]);

    useEffect(() => {
        fetchProjects();
        fetchTasks();
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            // setUser(JSON.parse(storedUser));
        }
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await api.get('projects/');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
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

    const handleCreateProject = async () => {
        try {
            await api.post('projects/', newProject);
            setShowModal(false);
            setNewProject({ name: '', description: '', color: '#3b82f6' });
            fetchProjects();
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    const handleDeleteProject = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
            try {
                await api.delete(`projects/${id}/`);
                fetchProjects();
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    const handleAssignTasks = async () => {
        try {
            await Promise.all(selectedTasksToAssign.map(taskId =>
                api.patch(`tasks/${taskId}/`, { project_id: assignProjectId })
            ));
            setShowAssignModal(false);
            setAssignProjectId(null);
            setSelectedTasksToAssign([]);
            fetchTasks();
        } catch (error) {
            console.error('Error assigning tasks:', error);
        }
    };

    const openAssignModal = (projectId) => {
        setAssignProjectId(projectId);
        setShowAssignModal(true);
        setSelectedTasksToAssign([]);
    };

    const toggleTaskSelection = (taskId) => {
        if (selectedTasksToAssign.includes(taskId)) {
            setSelectedTasksToAssign(selectedTasksToAssign.filter(id => id !== taskId));
        } else {
            setSelectedTasksToAssign([...selectedTasksToAssign, taskId]);
        }
    };

    const handleToggleComplete = async (task, e) => {
        e.stopPropagation();

        // Optimistic update
        const updatedTasks = tasks.map(t =>
            t.id === task.id ? { ...t, completed: !t.completed } : t
        );
        setTasks(updatedTasks);

        try {
            await api.patch(`tasks/${task.id}/`, { completed: !task.completed });
            // Ideally we re-fetch to ensure sync, but for now we trust the optimistic update
            // fetchTasks(); 
        } catch (error) {
            console.error('Error toggling task:', error);
            // Revert on error
            setTasks(tasks);
        }
    };

    const toggleProject = (id) => {
        setOpenProjectId(openProjectId === id ? null : id);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const getProjectTasks = (projectId) => {
        return tasks.filter(task => task.project && task.project.id === projectId);
    };

    const getUnassignedTasks = () => {
        return tasks.filter(task => !task.project);
    };

    const getProjectProgress = (projectId) => {
        const projectTasks = getProjectTasks(projectId);
        if (projectTasks.length === 0) return 0;
        const completedTasks = projectTasks.filter(task => task.completed).length;
        return Math.round((completedTasks / projectTasks.length) * 100);
    };

    const colors = [
        { name: 'blue', value: '#3b82f6' },
        { name: 'green', value: '#10b981' },
        { name: 'orange', value: '#f59e0b' },
        { name: 'pink', value: '#ec4899' },
        { name: 'purple', value: '#8b5cf6' },
        { name: 'red', value: '#ef4444' }
    ];

    return (
        <div className="projects-page">
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
                    <button className="nav-item active">
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
                    <button className="nav-item" onClick={() => navigate('/activity')}>
                        <i className="bi bi-clock-history"></i>
                        <span>Actividad</span>
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
                <div className="header">
                    <div>
                        <h1>Proyectos</h1>
                        <p>Organiza tus tareas por proyectos</p>
                    </div>
                    <button className="btn-add" onClick={() => setShowModal(true)}>
                        <i className="bi bi-plus-lg"></i>
                        Nuevo Proyecto
                    </button>
                </div>

                {/* Stats */}
                <div className="projects-stats">
                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-icon purple">
                                <i className="bi bi-folder"></i>
                            </div>
                        </div>
                        <h3>{projects.length}</h3>
                        <p>Proyectos Activos</p>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-icon blue">
                                <i className="bi bi-list-check"></i>
                            </div>
                        </div>
                        <h3>{tasks.length}</h3>
                        <p>Tareas Totales</p>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-icon green">
                                <i className="bi bi-check-circle"></i>
                            </div>
                        </div>
                        <h3>{tasks.filter(t => t.completed).length}</h3>
                        <p>Completadas</p>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-header">
                            <div className="stat-icon orange">
                                <i className="bi bi-clock-history"></i>
                            </div>
                        </div>
                        <h3>{tasks.filter(t => !t.completed).length}</h3>
                        <p>Pendientes</p>
                    </div>
                </div>

                {/* Projects List */}
                <div className="projects-container">
                    {projects.map(project => {
                        const projectTasks = getProjectTasks(project.id);
                        const progress = getProjectProgress(project.id);
                        const isOpen = openProjectId === project.id;

                        return (
                            <div key={project.id} className={`project-card ${isOpen ? 'open' : ''}`}>
                                <div className="project-header" onClick={() => toggleProject(project.id)}>
                                    <div className="project-color" style={{ background: project.color }}></div>
                                    <div className="project-info">
                                        <h3>{project.name}</h3>
                                        <p>{project.description || 'Sin descripción'}</p>
                                    </div>
                                    <div className="project-meta">
                                        <div className="project-stat">
                                            <div className="project-stat-value">{projectTasks.length}</div>
                                            <div className="project-stat-label">Tareas</div>
                                        </div>
                                        <div className="project-stat">
                                            <div className="project-stat-value">{projectTasks.filter(t => t.completed).length}</div>
                                            <div className="project-stat-label">Completadas</div>
                                        </div>
                                        <div className="project-progress">
                                            <div className="progress-bar-container">
                                                <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                                            </div>
                                            <div className="progress-text">{progress}% completado</div>
                                        </div>
                                    </div>
                                    <div className="project-actions">
                                        <button className="action-btn" title="Editar" onClick={(e) => e.stopPropagation()}>
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button className="action-btn delete" title="Eliminar" onClick={(e) => handleDeleteProject(project.id, e)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                    <button className="project-toggle">
                                        <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'}`}></i>
                                    </button>
                                </div>
                                <div className="project-tasks">
                                    <div className="tasks-wrapper">
                                        <div className="tasks-header">
                                            <h4>Tareas del proyecto</h4>
                                            <button className="add-task-btn" onClick={() => openAssignModal(project.id)}>
                                                <i className="bi bi-plus"></i>
                                                Asignar tareas
                                            </button>
                                        </div>
                                        <div className="task-list">
                                            {projectTasks.length === 0 ? (
                                                <div className="empty-tasks">
                                                    <i className="bi bi-clipboard"></i>
                                                    <p>No hay tareas en este proyecto</p>
                                                </div>
                                            ) : (
                                                projectTasks.map(task => (
                                                    <div
                                                        key={task.id}
                                                        className={`task-item ${task.completed ? 'completed' : ''}`}
                                                        onClick={() => navigate(`/tasks/${task.id}`)}
                                                    >
                                                        <div
                                                            className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                                                            onClick={(e) => handleToggleComplete(task, e)}
                                                        >
                                                            {task.completed && <i className="bi bi-check"></i>}
                                                        </div>
                                                        <div className="task-content">
                                                            <h5>{task.title}</h5>
                                                            <p>
                                                                {task.due_date && (
                                                                    <>
                                                                        <i className="bi bi-calendar"></i>
                                                                        {new Date(task.due_date).toLocaleDateString()}
                                                                    </>
                                                                )}
                                                            </p>
                                                        </div>
                                                        <span className={`task-priority ${task.priority}`}>
                                                            {task.priority === 'high' ? 'Alta' : task.priority === 'low' ? 'Baja' : 'Media'}
                                                        </span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* New Project Modal */}
            {showModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{ borderRadius: '16px', border: 'none' }}>
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold">Nuevo Proyecto</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Nombre del proyecto</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Ej: Rediseño de la web"
                                            style={{ borderRadius: '10px', padding: '0.75rem 1rem' }}
                                            value={newProject.name}
                                            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Descripción</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            placeholder="Describe brevemente el proyecto..."
                                            style={{ borderRadius: '10px', padding: '0.75rem 1rem' }}
                                            value={newProject.description}
                                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Color del proyecto</label>
                                        <div className="d-flex gap-2">
                                            {colors.map(color => (
                                                <button
                                                    key={color.name}
                                                    type="button"
                                                    className="btn p-0"
                                                    style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        background: color.value,
                                                        borderRadius: '8px',
                                                        border: newProject.color === color.value ? '3px solid #667eea' : 'none'
                                                    }}
                                                    onClick={() => setNewProject({ ...newProject, color: color.value })}
                                                ></button>
                                            ))}
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer border-0 pt-0">
                                <button type="button" className="btn btn-light" onClick={() => setShowModal(false)} style={{ borderRadius: '10px', padding: '0.75rem 1.5rem' }}>Cancelar</button>
                                <button
                                    type="button"
                                    className="btn text-white"
                                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '10px', padding: '0.75rem 1.5rem' }}
                                    onClick={handleCreateProject}
                                >
                                    Crear Proyecto
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Tasks Modal */}
            {showAssignModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{ borderRadius: '16px', border: 'none' }}>
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold">Asignar Tareas</h5>
                                <button type="button" className="btn-close" onClick={() => setShowAssignModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p className="text-muted mb-3">Selecciona las tareas que deseas asignar a este proyecto:</p>
                                <div className="list-group" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {getUnassignedTasks().length === 0 ? (
                                        <p className="text-center text-muted">No hay tareas sin asignar disponibles.</p>
                                    ) : (
                                        getUnassignedTasks().map(task => (
                                            <button
                                                key={task.id}
                                                type="button"
                                                className={`list-group-item list-group-item-action d-flex align-items-center gap-3 ${selectedTasksToAssign.includes(task.id) ? 'active' : ''}`}
                                                onClick={() => toggleTaskSelection(task.id)}
                                                style={{
                                                    backgroundColor: selectedTasksToAssign.includes(task.id) ? '#f8fafc' : 'white',
                                                    color: selectedTasksToAssign.includes(task.id) ? '#1e293b' : '#64748b',
                                                    borderColor: selectedTasksToAssign.includes(task.id) ? '#667eea' : '#e2e8f0'
                                                }}
                                            >
                                                <div className={`task-checkbox ${selectedTasksToAssign.includes(task.id) ? 'checked' : ''}`} style={{ pointerEvents: 'none' }}>
                                                    {selectedTasksToAssign.includes(task.id) && <i className="bi bi-check"></i>}
                                                </div>
                                                <div className="flex-grow-1">
                                                    <h6 className="mb-0">{task.title}</h6>
                                                    <small>{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Sin fecha'}</small>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer border-0 pt-0">
                                <button type="button" className="btn btn-light" onClick={() => setShowAssignModal(false)} style={{ borderRadius: '10px', padding: '0.75rem 1.5rem' }}>Cancelar</button>
                                <button
                                    type="button"
                                    className="btn text-white"
                                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '10px', padding: '0.75rem 1.5rem' }}
                                    onClick={handleAssignTasks}
                                    disabled={selectedTasksToAssign.length === 0}
                                >
                                    Asignar Seleccionadas
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Projects;
