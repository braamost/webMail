import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserForTab } from './SessionManager';

const ProtectedRoute = ({ user, children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const savedUser = getUserForTab();
    if (!user && !savedUser) {
      navigate('/');
    }
  }, [user, navigate]);

  return user || getUserForTab() ? children : null;
};

export default ProtectedRoute;