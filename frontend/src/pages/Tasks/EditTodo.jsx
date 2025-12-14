import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './CreateTodo.css'; // Reuse the same styles

const EditTodo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [priority, setPriority] = useState('medium');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTask();
    }, [id]);

    const fetchTask = async () => {
        try {
            const response = await api.get(`tasks/${id}/`);
            const task = response.data;
            setTitle(task.title);
            setDescription(task.description);
            setPriority(task.priority);

            if (task.due_date) {
                const dateObj = new Date(task.due_date);
                setDate(dateObj.toISOString().split('T')[0]);
                setTime(dateObj.toTimeString().split(' ')[0].substring(0, 5));
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching task:', err);
            setError('Error loading task details');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Combine date and time if provided
            let due_date = null;
            if (date) {
                due_date = time ? `${date}T${time}` : `${date}T00:00:00`;
            }

            await api.patch(`tasks/${id}/`, {
                title,
                description,
                priority,
                due_date
            });
            navigate(`/tasks/${id}`);
        } catch (err) {
            setError('Error updating task');
            console.error(err);
        }
    };

    if (loading) return <div className="p-5 text-center">Cargando...</div>;

    return (
        <div className="create-todo-page">
            <div className="form-container">
                <button onClick={() => navigate(-1)} className="back-link">
                    <i className="bi bi-arrow-left"></i>
                    Volver
                </button>

                <div className="form-card">
                    <div className="form-header">
                        <div className="icon">
                            <i className="bi bi-pencil-square"></i>
                        </div>
                        <h1>Editar Tarea</h1>
                        <p>Modifica los detalles de tu tarea</p>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        {/* Task Title */}
                        <div className="mb-4">
                            <label className="form-label">Título de la Tarea *</label>
                            <div className="input-icon">
                                <i className="bi bi-pencil"></i>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Ej: Diseñar la interfaz del usuario"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <label className="form-label">Descripción</label>
                            <textarea
                                className="form-control"
                                placeholder="Añade una descripción detallada de la tarea..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>

                        {/* Date and Time */}
                        <div className="row-inputs mb-4">
                            <div>
                                <label className="form-label">Fecha de Vencimiento</label>
                                <div className="input-icon">
                                    <i className="bi bi-calendar3"></i>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="form-label">Hora</label>
                                <div className="input-icon">
                                    <i className="bi bi-clock"></i>
                                    <input
                                        type="time"
                                        className="form-control"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Priority */}
                        <div className="mb-4">
                            <label className="form-label">Prioridad</label>
                            <div className="priority-selector">
                                <div className="priority-option high">
                                    <input
                                        type="radio"
                                        name="priority"
                                        id="high"
                                        value="high"
                                        checked={priority === 'high'}
                                        onChange={(e) => setPriority(e.target.value)}
                                    />
                                    <label htmlFor="high">
                                        <span className="dot"></span>
                                        <span>Alta</span>
                                    </label>
                                </div>
                                <div className="priority-option medium">
                                    <input
                                        type="radio"
                                        name="priority"
                                        id="medium"
                                        value="medium"
                                        checked={priority === 'medium'}
                                        onChange={(e) => setPriority(e.target.value)}
                                    />
                                    <label htmlFor="medium">
                                        <span className="dot"></span>
                                        <span>Media</span>
                                    </label>
                                </div>
                                <div className="priority-option low">
                                    <input
                                        type="radio"
                                        name="priority"
                                        id="low"
                                        value="low"
                                        checked={priority === 'low'}
                                        onChange={(e) => setPriority(e.target.value)}
                                    />
                                    <label htmlFor="low">
                                        <span className="dot"></span>
                                        <span>Baja</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="form-actions">
                            <button type="button" onClick={() => navigate(-1)} className="btn-cancel">
                                Cancelar
                            </button>
                            <button type="submit" className="btn-submit">
                                <i className="bi bi-check-lg"></i>
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditTodo;
