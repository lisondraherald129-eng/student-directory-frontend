import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

const API_URL = 'http://localhost:3000';

export default function Students() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function fetchStudents() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}/api/students`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          // Expired / invalid token — force re-login
          logout();
          navigate('/login');
          return;
        }

        if (!res.ok) {
          throw new Error(`Failed to load students (${res.status})`);
        }

        const data = await res.json();
        if (!cancelled) {
          setStudents(Array.isArray(data) ? data : data.students || []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Something went wrong');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchStudents();
    return () => {
      cancelled = true;
    };
  }, [token, logout, navigate]);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="students-page">
      <header className="navbar">
        <h1>Student Directory</h1>
        <button onClick={handleLogout}>Log Out</button>
      </header>

      {loading && <p>Loading students…</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <ul className="student-list">
          {students.length === 0 && <li>No students found.</li>}
          {students.map((s) => (
            <li key={s._id || s.id || s.email}>
              <div>
                <strong>{s.name || 'Unnamed'}</strong>
                <br />
                <span>{s.email}</span>
              </div>
              <small>
                {s.course || ''}
                {s.year ? ` · Year ${s.year}` : ''}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}