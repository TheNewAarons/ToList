import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Calendar.css';
import logoImage from '../../img/logo-todolist.jpg';

const Calendar = () => {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [user, setUser] = useState({ username: 'Usuario' });

    useEffect(() => {
        fetchTasks();
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            // setUser(JSON.parse(storedUser));
        }
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await api.get('tasks/');
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday

        // Adjust for Monday start (0 = Monday, 6 = Sunday)
        const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        const days = [];

        // Previous month days
        const prevMonthDays = new Date(year, month, 0).getDate();
        for (let i = adjustedFirstDay - 1; i >= 0; i--) {
            days.push({
                day: prevMonthDays - i,
                type: 'other-month',
                date: new Date(year, month - 1, prevMonthDays - i)
            });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                type: 'current-month',
                date: new Date(year, month, i)
            });
        }

        // Next month days
        const remainingCells = 42 - days.length; // 6 rows * 7 cols
        for (let i = 1; i <= remainingCells; i++) {
            days.push({
                day: i,
                type: 'other-month',
                date: new Date(year, month + 1, i)
            });
        }

        return days;
    };

    const changeMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const getTasksForDate = (date) => {
        return tasks.filter(task => {
            if (!task.due_date) return false;
            const taskDate = new Date(task.due_date);
            return taskDate.getDate() === date.getDate() &&
                taskDate.getMonth() === date.getMonth() &&
                taskDate.getFullYear() === date.getFullYear();
        });
    };

    const isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const isWeekend = (date) => {
        const day = date.getDay();
        return day === 0 || day === 6;
    };

    const calendarDays = getDaysInMonth(currentDate);

    // Get upcoming tasks (sorted by due date, future only)
    const upcomingTasks = tasks
        .filter(t => t.due_date && new Date(t.due_date) >= new Date().setHours(0, 0, 0, 0))
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
        .slice(0, 5);

    return (
        <div className="calendar-page">
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
                    <button className="nav-item active">
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
                        <h1>Calendario</h1>
                        <p>Visualiza tus tareas en el tiempo</p>
                    </div>
                    <button onClick={() => navigate('/create')} className="btn-add">
                        <i className="bi bi-plus-lg"></i>
                        Nueva Tarea
                    </button>
                </div>

                {/* Calendar Controls */}
                <div className="calendar-controls">
                    <div className="month-navigation">
                        <button className="nav-btn" onClick={() => changeMonth(-1)}>
                            <i className="bi bi-chevron-left"></i>
                        </button>
                        <h2>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                        <button className="nav-btn" onClick={() => changeMonth(1)}>
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>
                    <div className="calendar-actions">
                        <button className="btn-today" onClick={goToToday}>Hoy</button>
                        <select className="view-select">
                            <option value="month">Vista Mensual</option>
                        </select>
                    </div>
                </div>

                <div className="calendar-layout">
                    {/* Calendar Grid */}
                    <div className="calendar-container">
                        <div className="calendar-header">
                            <div className="calendar-header-day">Lun</div>
                            <div className="calendar-header-day">Mar</div>
                            <div className="calendar-header-day">Mié</div>
                            <div className="calendar-header-day">Jue</div>
                            <div className="calendar-header-day">Vie</div>
                            <div className="calendar-header-day weekend">Sáb</div>
                            <div className="calendar-header-day weekend">Dom</div>
                        </div>
                        <div className="calendar-body">
                            {calendarDays.map((dayObj, index) => {
                                const dayTasks = getTasksForDate(dayObj.date);
                                const isCurrentToday = isToday(dayObj.date);
                                const isCurrentWeekend = isWeekend(dayObj.date);

                                return (
                                    <div
                                        key={index}
                                        className={`calendar-day ${dayObj.type} ${isCurrentToday ? 'today' : ''} ${isCurrentWeekend ? 'weekend' : ''}`}
                                        onClick={() => {
                                            // Optional: Navigate to create task with this date pre-filled
                                        }}
                                    >
                                        <div className="day-header">
                                            <span className="day-number">{dayObj.day}</span>
                                            {dayTasks.length > 0 && (
                                                <span className="task-count">{dayTasks.length}</span>
                                            )}
                                        </div>
                                        <div className="day-tasks">
                                            {dayTasks.slice(0, 3).map(task => (
                                                <div
                                                    key={task.id}
                                                    className={`day-task priority-${task.priority} ${task.completed ? 'completed' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/tasks/${task.id}`);
                                                    }}
                                                >
                                                    {task.title}
                                                </div>
                                            ))}
                                            {dayTasks.length > 3 && (
                                                <span className="more-tasks">+{dayTasks.length - 3} más</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="calendar-legend">
                            <div className="legend-item">
                                <span className="legend-dot high"></span>
                                <span>Prioridad Alta</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-dot medium"></span>
                                <span>Prioridad Media</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-dot low"></span>
                                <span>Prioridad Baja</span>
                            </div>
                            <div className="legend-item">
                                <span className="legend-dot completed"></span>
                                <span>Completada</span>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Tasks */}
                    <div className="upcoming-tasks">
                        <h3><i className="bi bi-clock-history"></i> Próximas Tareas</h3>
                        <div className="upcoming-list">
                            {upcomingTasks.length === 0 ? (
                                <p className="text-muted text-center py-3">No hay tareas próximas</p>
                            ) : (
                                upcomingTasks.map(task => (
                                    <div
                                        key={task.id}
                                        className="upcoming-item"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => navigate(`/tasks/${task.id}`)}
                                    >
                                        <div className="upcoming-item-header">
                                            <h4>{task.title}</h4>
                                            <span className={`upcoming-priority ${task.priority}`}></span>
                                        </div>
                                        <div className={`upcoming-item-date ${isToday(new Date(task.due_date)) ? 'today' : ''}`}>
                                            <i className="bi bi-calendar3"></i>
                                            {new Date(task.due_date).toLocaleDateString()}
                                        </div>
                                        <div className="upcoming-project">
                                            <i className="bi bi-folder"></i>
                                            General
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Calendar;
