import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import TodoList from './pages/Dashboard/TodoList';
import CreateTodo from './pages/Tasks/CreateTodo';
import MyTasks from './pages/MyTasks/MyTasks';
import TaskDetail from './pages/Tasks/TaskDetail';
import Calendar from './pages/Calendar/Calendar';
import Projects from './pages/Projects/Projects';
import ImportantTasks from './pages/Important/ImportantTasks';
import Settings from './pages/Settings/Settings';
import Activity from './pages/Activity/Activity';
import Statistics from './pages/Statistics/Statistics';
import ProtectedRoute from './components/ProtectedRoute';
import EditTodo from './pages/Tasks/EditTodo';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/todos"
          element={
            <ProtectedRoute>
              <TodoList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-tasks"
          element={
            <ProtectedRoute>
              <MyTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/:id"
          element={
            <ProtectedRoute>
              <TaskDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateTodo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/important"
          element={
            <ProtectedRoute>
              <ImportantTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activity"
          element={
            <ProtectedRoute>
              <Activity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/statistics"
          element={
            <ProtectedRoute>
              <Statistics />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
