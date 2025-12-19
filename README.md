# Proyecto ToList - Sistema de Gestión de Tareas Full Stack

**ToList** es una aplicación de gestión de tareas robusta y moderna diseñada para ayudar a los usuarios a organizar su vida y trabajo de manera eficiente. Construida con un potente backend en **Django** y un frontend dinámico en **React**, ofrece una experiencia de usuario fluida para gestionar tareas, proyectos y horarios.

---

## 🚀 Características y Módulos Clave

La aplicación está estructurada en torno a varios módulos centrales que interactúan para proporcionar un ecosistema de productividad completo:

### 1. Gestión de Tareas (`tasks`)
El núcleo del sistema.
- **Crear, Leer, Actualizar, Borrar (CRUD)**: Control total sobre las tareas.
- **Prioridades**: Asigna prioridad Baja, Media o Alta.
- **Fechas de Vencimiento**: Establece fechas límite para tus tareas.
- **Importante**: Marca tareas cruciales para un acceso rápido.
- **Estado**: Rastrea el estado de finalización.

### 2. Organización de Proyectos (`projects`)
Agrupa tareas relacionadas en Proyectos (ej. "Trabajo", "Personal", "Compras").
- Cada proyecto puede tener su propio color para una fácil identificación visual.
- Las tareas pueden asignarse a proyectos específicos.

### 3. Organización Inteligente
- **Etiquetas**: Añade etiquetas flexibles a las tareas para filtrado entre proyectos.
- **Mis Tareas**: Una vista unificada de todas tus responsabilidades.
- **Hoy**: Enfócate en lo que necesita hacerse hoy.
- **Calendario**: Una línea de tiempo visual de tus tareas próximas.
- **Papelera**: Sistema de borrado suave que te permite restaurar elementos eliminados accidentalmente.

### 4. Colaboración y Detalles
- **Subtareas**: Divide tareas complejas en pasos más pequeños y manejables.
- **Comentarios**: Añade notas o actualizaciones a tareas específicas.
- **Registro de Actividad**: Rastrea el historial de cambios (creación, finalización, actualizaciones) para auditoría y revisión.

### 5. Plantillas (`templates`)
Ahorra tiempo creando listas de tareas reutilizables para flujos de trabajo recurrentes (ej. "Lista de Empaque", "Inicio de Proyecto").

### 6. Analíticas (`statistics`)
Insights visuales sobre tu productividad, mostrando tasas de finalización y tendencias de actividad.

---

## 🛠 Tecnologías (Tech Stack)

### Backend
- **Framework**: [Django](https://www.djangoproject.com/) (Python)
- **API**: [Django REST Framework](https://www.django-rest-framework.org/)
- **Base de Datos**: SQLite (Por defecto) / Configurable para PostgreSQL
- **Autenticación**: Autenticación basada en Tokens

### Frontend
- **Framework**: [React](https://react.dev/)
- **Herramienta de Construcción**: [Vite](https://vitejs.dev/)
- **Estilos**: Bootstrap 5 y CSS Personalizado
- **Cliente HTTP**: Axios
- **Enrutamiento**: React Router DOM

---

## 💻 Guía de Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto localmente.

### Prerrequisitos
- **Node.js** (v16+ recomendado)
- **Python** (v3.8+ recomendado)
- **Git**

### 1. Clonar el Repositorio
```bash
git clone https://github.com/TheNewAarons/ToList.git
cd ToList
```

### 2. Configuración del Backend
Navega al directorio del backend y configura el entorno Python.

```bash
cd backend

# Crear un entorno virtual (Mac/Linux)
python3 -m venv venv
source venv/bin/activate

# Crear un entorno virtual (Windows)
# python -m venv venv
# venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar migraciones de la base de datos
python manage.py migrate

# Iniciar el servidor de desarrollo
python manage.py runserver
```
*La API del backend estará disponible en `http://127.0.0.1:8000/`*

### 3. Configuración del Frontend
Abre una nueva terminal, navega al directorio frontend e inicia la interfaz de usuario.

```bash
cd frontend

# Instalar módulos de Node
npm install

# Iniciar el servidor de desarrollo
npm run dev
```
*La aplicación debería estar corriendo ahora en `http://localhost:5173/` (o el puerto que se muestre en tu terminal)*

---

## 🔌 Referencia de la API

El backend expone una API REST completa. Aquí están los endpoints principales:

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/auth/register/` | POST | Registrar un nuevo usuario |
| `/api/auth/login/` | POST | Iniciar sesión y recibir token de autenticación |
| `/api/tasks/` | GET/POST | Listar todas las tareas o crear una nueva |
| `/api/tasks/{id}/` | PUT/DELETE| Actualizar o eliminar una tarea |
| `/api/projects/` | GET/POST | Gestionar proyectos |
| `/api/tags/` | GET/POST | Gestionar etiquetas |
| `/api/activity/` | GET | Ver historial de actividad del usuario |
| `/api/statistics/` | GET | Obtener estadísticas de productividad |
| `/api/templates/` | GET/POST | Gestionar plantillas de tareas |

---

## 📂 Estructura del Proyecto

```
ToList/
├── backend/            # Django Backend
│   ├── accounts/       # App de autenticación de usuarios
│   ├── todos/          # Lógica principal (Tareas, Proyectos, etc.)
│   ├── config/         # Configuraciones del proyecto y rutas URL
│   ├── manage.py       # Punto de entrada CLI de Django
│   └── requirements.txt
│
└── frontend/           # React Frontend
    ├── public/         # Archivos estáticos
    ├── src/
    │   ├── components/ # Componentes UI reutilizables
    │   ├── pages/      # Vistas de páginas (TodoList, Login, Calendar, etc.)
    │   ├── App.jsx     # Componente principal de React
    │   └── main.jsx    # Punto de entrada
    └── package.json    # Dependencias del frontend
```

---

## ✨ Consejos de Uso

1.  **Regístrate** crea una nueva cuenta al cargar por primera vez.
2.  **Crea un Proyecto** para categorizar tu trabajo.
3.  **Añade Tareas** dentro de proyectos o en la vista general "Mis Tareas".
4.  **Revisa las Estadísticas** ¡para ver qué tan productivo has sido!

---
Desarrollado por **TheNewAarons**
