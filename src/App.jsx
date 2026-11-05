import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Students from './pages/Students.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './hooks/useAuth.jsx';

function Home() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/students' : '/login'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <Students />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}