# ToList Project - Full Stack Task Management System

**ToList** is a robust and modern task management application designed to help users organize their life and work efficiently. Built with a powerful **Django** backend and a dynamic **React** frontend, it offers a seamless user experience for managing tasks, projects, and schedules.

---

## 🚀 Key Features & Modules

The application is structured around several core modules that interact to provide a complete productivity ecosystem:

### 1. Task Management (`tasks`)
The core of the system.
- **Create, Read, Update, Delete (CRUD)**: Full control over tasks.
- **Priorities**: Assign Low, Medium, or High priority.
- **Due Dates**: Set deadlines for your tasks.
- **Important**: Mark crucial tasks for quick access.
- **Status**: Track completion status.

### 2. Project Organization (`projects`)
Group related tasks into Projects (e.g., "Work", "Personal", "Shopping").
- Each project can have its own color for easy visual identification.
- Tasks can be assigned to specific projects.

### 3. Smart Organization
- **Tags**: Add flexible tags to tasks for cross-project filtering.
- **My Tasks**: A unified view of all your responsibilities.
- **Today**: Focus on what needs to be done today.
- **Calendar**: A visual timeline of your upcoming tasks.
- **Trash**: Soft-delete system allowing you to restore accidentally deleted items.

### 4. Collaboration & Details
- **Subtasks**: Break down complex tasks into smaller, manageable steps.
- **Comments**: Add notes or updates to specific tasks.
- **Activity Log**: Track the history of changes (creation, completion, updates) for audit and review.

### 5. Templates (`templates`)
Save time by creating reusable task lists for recurring workflows (e.g., "Packing List", "Project Kickoff").

### 6. Analytics (`statistics`)
Visual insights into your productivity, showing completion rates and activity trends.

---

## 🛠 Tech Stack

### Backend
- **Framework**: [Django](https://www.djangoproject.com/) (Python)
- **API**: [Django REST Framework](https://www.django-rest-framework.org/)
- **Database**: SQLite (Default) / Configurable for PostgreSQL
- **Authentication**: Token-based authentication

### Frontend
- **Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: Bootstrap 5 & Custom CSS
- **HTTP Client**: Axios
- **Routing**: React Router DOM

---

## 💻 Installation & Setup Guide

Follow these steps to get the project running locally.

### Prerequisites
- **Node.js** (v16+ recommended)
- **Python** (v3.8+ recommended)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/TheNewAarons/ToList.git
cd ToList
```

### 2. Backend Setup
Navigate to the backend directory and set up the Python environment.

```bash
cd backend

# Create a virtual environment (Mac/Linux)
python3 -m venv venv
source venv/bin/activate

# Create a virtual environment (Windows)
# python -m venv venv
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Start the development server
python manage.py runserver
```
*The backend API will be available at `http://127.0.0.1:8000/`*

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and launch the UI.

```bash
cd frontend

# Install Node modules
npm install

# Start the development server
npm run dev
```
*The application should now be running at `http://localhost:5173/` (or the port shown in your terminal)*

---

## 🔌 API Reference

The backend exposes a comprehensive REST API. Here are the main endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register/` | POST | Register a new user |
| `/api/auth/login/` | POST | Login and receive auth token |
| `/api/tasks/` | GET/POST | List all tasks or create a new one |
| `/api/tasks/{id}/` | PUT/DELETE| Update or delete a task |
| `/api/projects/` | GET/POST | Manage projects |
| `/api/tags/` | GET/POST | Manage tags |
| `/api/activity/` | GET | View user activity history |
| `/api/statistics/` | GET | Get productivity stats |
| `/api/templates/` | GET/POST | Manage task templates |

---

## 📂 Project Structure

```
ToList/
├── backend/            # Django Backend
│   ├── accounts/       # User authentication app
│   ├── todos/          # Main application logic (Tasks, Projects, etc.)
│   ├── config/         # Project settings and URL routing
│   ├── manage.py       # Django CLI entry point
│   └── requirements.txt
│
└── frontend/           # React Frontend
    ├── public/         # Static assets
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── pages/      # Page views (TodoList, Login, Calendar, etc.)
    │   ├── App.jsx     # Main React component
    │   └── main.jsx    # Entry point
    └── package.json    # Frontend dependencies
```

---

## ✨ Usage Tips

1.  **Register** a new account on the first load.
2.  **Create a Project** to categorize your work.
3.  **Add Tasks** within projects or in the general "My Tasks" view.
4.  **Check Statistics** to see how productive you've been!

---
Developed by **TheNewAarons**
