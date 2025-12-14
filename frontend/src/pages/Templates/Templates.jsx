import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Templates.css';
import logoImage from '../../img/logo-todolist.jpg';
import api from '../../api';

const Templates = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: 'Usuario' });
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('Todas');

    // Form State
    const [newTemplate, setNewTemplate] = useState({
        title: '',
        description: '',
        category: 'General',
        priority: 'medium',
        items: []
    });
    const [newSubtask, setNewSubtask] = useState('');

    useEffect(() => {
        fetchUserProfile();
        fetchTemplates();
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

    const fetchTemplates = async () => {
        try {
            const response = await api.get('templates/');
            setTemplates(response.data);
        } catch (error) {
            console.error('Error fetching templates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleAddSubtask = () => {
        if (!newSubtask.trim()) return;
        setNewTemplate(prev => ({
            ...prev,
            items: [...prev.items, { content: newSubtask, is_completed: false }]
        }));
        setNewSubtask('');
    };

    const handleRemoveSubtask = (index) => {
        setNewTemplate(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleCreateTemplate = async () => {
        try {
            await api.post('templates/', newTemplate);
            fetchTemplates();
            // Close modal (using data-bs-dismiss approach or programmatic if using Ref, assuming manual close for now or reload)
            // A simple way to close bootstrap modal programmatically without jquery is clicking the close button or removing classes
            // For now let's just reset form and fetch, user closes modal manually or we use simple js
            document.querySelector('.btn-close').click();
            setNewTemplate({
                title: '',
                description: '',
                category: 'General',
                priority: 'medium',
                items: []
            });
        } catch (error) {
            console.error('Error creating template:', error);
            alert('Error al crear la plantilla');
        }
    };

    const handleUseTemplate = async (templateId) => {
        try {
            const response = await api.post(`templates/${templateId}/use/`);
            // Navigate to the new task or dashboard
            if (response.data.task_id) {
                navigate(`/tasks/${response.data.task_id}`);
            } else {
                navigate('/todos');
            }
        } catch (error) {
            console.error('Error using template:', error);
            alert('Error al usar la plantilla');
        }
    };

    const filteredTemplates = activeCategory === 'Todas'
        ? templates
        : templates.filter(t => t.category === activeCategory);

    const getIconForCategory = (category) => {
        switch (category) {
            case 'Trabajo': return 'bi-briefcase';
            case 'Personal': return 'bi-person';
            case 'Recurrente': return 'bi-repeat';
            case 'Reuniones': return 'bi-people';
            case 'Eventos': return 'bi-calendar-event';
            default: return 'bi-file-earmark-text';
        }
    };

    const getGradientForIndex = (index) => {
        const gradients = [
            'var(--primary-gradient)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        ];
        return gradients[index % gradients.length];
    };

    return (
        <div className="templates-page">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="logo">
                    <img src={logoImage} alt="TaskFlow Logo" className="logo-image" />
                </div>
                <nav className="nav flex-column mt-3">
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
                        <i className="bi bi-kanban"></i>
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
                    <button className="nav-item active" onClick={() => navigate('/templates')}>
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
                    <div className="user-avatar">{user.username.substring(0, 2).toUpperCase()}</div>
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
            <div className="main-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 className="h3 fw-bold mb-1">Plantillas de Tareas</h1>
                        <p className="text-muted">Crea tareas rápidamente usando plantillas predefinidas</p>
                    </div>
                    <button className="btn btn-gradient" data-bs-toggle="modal" data-bs-target="#newTemplateModal">
                        <i className="bi bi-plus-circle"></i> Nueva Plantilla
                    </button>
                </div>

                {/* Category Tabs */}
                <div className="category-tabs">
                    {['Todas', 'Trabajo', 'Personal', 'Recurrente', 'Reuniones', 'Eventos', 'General'].map(cat => (
                        <button
                            key={cat}
                            className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            <i className={`bi ${cat === 'Todas' ? 'bi-grid' : getIconForCategory(cat)}`}></i> {cat}
                        </button>
                    ))}
                </div>

                {/* Templates Grid */}
                <div className="row g-4">
                    {loading ? (
                        <div className="text-center p-5">Cargando plantillas...</div>
                    ) : filteredTemplates.length === 0 ? (
                        <div className="text-center p-5 text-muted">
                            <i className="bi bi-file-earmark-x display-1"></i>
                            <p className="mt-3">No hay plantillas en esta categoría.</p>
                        </div>
                    ) : (
                        filteredTemplates.map((template, index) => (
                            <div className="col-md-4" key={template.id}>
                                <div className="template-card">
                                    <div className="template-icon" style={{ background: getGradientForIndex(index) }}>
                                        <i className={`bi ${getIconForCategory(template.category)}`}></i>
                                    </div>
                                    <div className="template-title">{template.title}</div>
                                    <div className="template-description">
                                        {template.description || 'Sin descripción'}
                                    </div>
                                    <div className="template-meta">
                                        <span><i className="bi bi-list"></i> {template.items ? template.items.length : 0} subtareas</span>
                                        <span><i className="bi bi-flag"></i> {template.priority}</span>
                                        <span><i className="bi bi-tag"></i> {template.category}</span>
                                    </div>
                                    <button
                                        className="btn btn-use-template w-100 mt-3"
                                        onClick={() => handleUseTemplate(template.id)}
                                    >
                                        <i className="bi bi-lightning-fill"></i> Usar Plantilla
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* New Template Modal */}
            <div className="modal fade" id="newTemplateModal" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Crear Nueva Plantilla</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Nombre de la Plantilla</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ej: Reunión de Planificación"
                                        value={newTemplate.title}
                                        onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Descripción</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Describe para qué sirve esta plantilla..."
                                        value={newTemplate.description}
                                        onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Categoría</label>
                                        <select
                                            className="form-select"
                                            value={newTemplate.category}
                                            onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                                        >
                                            <option value="General">General</option>
                                            <option value="Trabajo">Trabajo</option>
                                            <option value="Personal">Personal</option>
                                            <option value="Recurrente">Recurrente</option>
                                            <option value="Reuniones">Reuniones</option>
                                            <option value="Eventos">Eventos</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Prioridad</label>
                                        <select
                                            className="form-select"
                                            value={newTemplate.priority}
                                            onChange={(e) => setNewTemplate({ ...newTemplate, priority: e.target.value })}
                                        >
                                            <option value="low">Baja</option>
                                            <option value="medium">Media</option>
                                            <option value="high">Alta</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Subtareas ({newTemplate.items.length})</label>
                                    <div className="input-group mb-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Nueva subtarea"
                                            value={newSubtask}
                                            onChange={(e) => setNewSubtask(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                                        />
                                        <button
                                            className="btn btn-outline-primary"
                                            type="button"
                                            onClick={handleAddSubtask}
                                        >
                                            <i className="bi bi-plus"></i>
                                        </button>
                                    </div>
                                    <div className="bg-light p-3 rounded" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                        {newTemplate.items.map((item, index) => (
                                            <div key={index} className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-1">
                                                <span>{item.content}</span>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleRemoveSubtask(index)}
                                                >
                                                    <i className="bi bi-x"></i>
                                                </button>
                                            </div>
                                        ))}
                                        {newTemplate.items.length === 0 && <span className="text-muted small">No hay subtareas añadidas</span>}
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-gradient" onClick={handleCreateTemplate}>Crear Plantilla</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Templates;
