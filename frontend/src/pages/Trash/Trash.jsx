import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Trash.css';
import logoImage from '../../img/logo-todolist.jpg';
import Swal from 'sweetalert2';

const Trash = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [user, setUser] = useState({ username: '', first_name: '' });
    const [loading, setLoading] = useState(true);
    const [selectedTasks, setSelectedTasks] = useState([]);

    useEffect(() => {
        fetchUserProfile();
        fetchTrashTasks();
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

    const fetchTrashTasks = async () => {
        try {
            const response = await api.get('tasks/trash/');
            setTasks(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching trash tasks:', error);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const getInitials = () => {
        if (user.first_name && user.last_name) {
            return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
        }
        return user.username ? user.username.substring(0, 2).toUpperCase() : 'US';
    };

    const handleRestore = async (taskId) => {
        try {
            await api.post(`tasks/${taskId}/restore/`);
            fetchTrashTasks();
            Swal.fire({
                icon: 'success',
                title: 'Tarea restaurada',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error('Error restoring task:', error);
            Swal.fire('Error', 'No se pudo restaurar la tarea', 'error');
        }
    };

    const handleDeleteForever = async (taskId) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar permanentemente',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`tasks/${taskId}/delete_forever/`);
                fetchTrashTasks();
                Swal.fire('¡Eliminado!', 'La tarea ha sido eliminada permanentemente.', 'success');
            } catch (error) {
                console.error('Error deleting task:', error);
                Swal.fire('Error', 'No se pudo eliminar la tarea', 'error');
            }
        }
    };

    const handleEmptyTrash = async () => {
        const result = await Swal.fire({
            title: '¿Vaciar papelera?',
            text: "Todas las tareas se eliminarán permanentemente. Esta acción es irreversible.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, vaciar papelera',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await api.delete('tasks/empty_trash/');
                fetchTrashTasks();
                Swal.fire('¡Papelera vacía!', 'Todas las tareas han sido eliminadas.', 'success');
            } catch (error) {
                console.error('Error emptying trash:', error);
                Swal.fire('Error', 'No se pudo vaciar la papelera', 'error');
            }
        }
    };

    // Logic to calculate days remaining (assuming 30 days)
    const getDaysRemaining = (deletedAt) => {
        if (!deletedAt) return 30;
        const deletedDate = new Date(deletedAt);
        const deletionLimit = new Date(deletedDate);
        deletionLimit.setDate(deletedDate.getDate() + 30);
        const today = new Date();
        const diffTime = Math.abs(deletionLimit - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    // Stub for bulk restore/delete (not fully implemented in backend yet for IDs list, but UI is there)
    // For now we will hide bulk logic or keep it simple as visual specific request didn't strictly demand bulk API interaction for array of IDs.
    // I'll stick to single actions and Empty All for now for simplicity, unless user demanded checkboxes functionality deeply.
    // User HTML has "Seleccionar todas" and checkboxes. I'll add basic state for it but maybe not connect bulk API yet if not requested.
    // Actually, `empty_trash` handles the "Vaciar Papelera" button. 

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedTasks(tasks.map(t => t.id));
        } else {
            setSelectedTasks([]);
        }
    };

    const handleSelectTask = (taskId) => {
        if (selectedTasks.includes(taskId)) {
            setSelectedTasks(selectedTasks.filter(id => id !== taskId));
        } else {
            setSelectedTasks([...selectedTasks, taskId]);
        }
    };

    const handleBulkRestore = async () => {
        if (selectedTasks.length === 0) return;

        try {
            await api.post('tasks/bulk_restore/', { task_ids: selectedTasks });
            fetchTrashTasks();
            setSelectedTasks([]);
            Swal.fire({
                icon: 'success',
                title: 'Tareas restauradas',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error('Error restoring tasks:', error);
            Swal.fire('Error', 'No se pudieron restaurar las tareas', 'error');
        }
    };

    const handleBulkDelete = async () => {
        if (selectedTasks.length === 0) return;

        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `Se eliminarán permanentemente ${selectedTasks.length} tareas.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await api.post('tasks/bulk_delete_forever/', { task_ids: selectedTasks });
                fetchTrashTasks();
                setSelectedTasks([]);
                Swal.fire('¡Eliminado!', 'Las tareas han sido eliminadas.', 'success');
            } catch (error) {
                console.error('Error deleting tasks:', error);
                Swal.fire('Error', 'No se pudieron eliminar las tareas', 'error');
            }
        }
    };

    return (
        <div className="trash-page">
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
                    <button className="nav-item active">
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
                <h1 className="h3 fw-bold mb-4">Papelera</h1>

                {/* Warning Banner */}
                <div className="warning-banner">
                    <i className="bi bi-exclamation-triangle-fill"></i>
                    <div>
                        <h5 className="mb-1">Las tareas se eliminarán permanentemente después de 30 días</h5>
                        <p className="mb-0 small">Puedes restaurar o eliminar permanentemente las tareas desde aquí</p>
                    </div>
                </div>

                {/* Bulk Actions */}
                <div className="bulk-actions">
                    <div>
                        <input
                            type="checkbox"
                            id="selectAll"
                            className="form-check-input me-2"
                            disabled={tasks.length === 0}
                            checked={tasks.length > 0 && selectedTasks.length === tasks.length}
                            onChange={handleSelectAll}
                        />
                        <label htmlFor="selectAll">Seleccionar todas</label>
                        <span className="ms-3 text-muted">{tasks.length} tareas eliminadas</span>
                    </div>
                    <div>
                        {selectedTasks.length > 0 ? (
                            <>
                                <button className="btn btn-restore me-2" onClick={handleBulkRestore}>
                                    <i className="bi bi-arrow-counterclockwise"></i> Restaurar Seleccionadas ({selectedTasks.length})
                                </button>
                                <button className="btn btn-delete-forever" onClick={handleBulkDelete}>
                                    <i className="bi bi-trash-fill"></i> Eliminar ({selectedTasks.length})
                                </button>
                            </>
                        ) : (
                            <button className="btn btn-delete-forever" onClick={handleEmptyTrash} disabled={tasks.length === 0}>
                                <i className="bi bi-trash-fill"></i> Vaciar Papelera
                            </button>
                        )}
                    </div>
                </div>

                {/* Deleted Tasks List */}
                {loading ? (
                    <div className="text-center p-5">Cargando...</div>
                ) : tasks.length === 0 ? (
                    <div className="empty-trash">
                        <i className="bi bi-trash"></i>
                        <h3>La papelera está vacía</h3>
                        <p>No hay tareas eliminadas recientemente</p>
                    </div>
                ) : (
                    tasks.map(task => (
                        <div key={task.id} className="deleted-task-card">
                            <div className="deleted-task-header">
                                <div className="flex-grow-1">
                                    <div className="form-check d-inline-block me-3">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={selectedTasks.includes(task.id)}
                                            onChange={() => handleSelectTask(task.id)}
                                        />
                                    </div>
                                    <div className="d-inline-block">
                                        <div className="deleted-task-title">{task.title}</div>
                                        <div className="deleted-date">
                                            <i className="bi bi-clock"></i> Eliminada el {new Date(task.deleted_at).toLocaleDateString()} |
                                            Se eliminará en {getDaysRemaining(task.deleted_at)} días
                                        </div>
                                        <div className="text-muted small mt-2">
                                            <i className="bi bi-folder"></i> {task.project ? task.project.name : 'General'} |
                                            {task.priority === 'high' && <span className="badge bg-danger ms-1">Alta</span>}
                                            {task.priority === 'medium' && <span className="badge bg-warning ms-1">Media</span>}
                                            {task.priority === 'low' && <span className="badge bg-success ms-1">Baja</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="action-buttons">
                                    <button className="btn btn-restore" onClick={() => handleRestore(task.id)}>
                                        <i className="bi bi-arrow-counterclockwise"></i> Restaurar
                                    </button>
                                    <button className="btn btn-delete-forever" onClick={() => handleDeleteForever(task.id)}>
                                        <i className="bi bi-x-circle"></i> Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
};

export default Trash;
