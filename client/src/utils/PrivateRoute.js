import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function PrivateRoute({ children, adminOnly = false, ...rest }) {
    const location = useLocation();
    const token = localStorage.getItem('token');

    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchUserRole() {
            const response = await fetch('http://localhost:5000/user-role', {
                headers: {
                    'authorization': token
                }
            });
            const data = await response.json();
            setUserRole(data.role);
            setIsLoading(false);
        }

        if (token) {
            fetchUserRole().then(r => {});
        } else {
            setIsLoading(false);
        }
    }, [token]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!token) {
        return <Navigate to="/" state={{ from: location }} />
    }

    if (adminOnly && userRole !== 'admin') {
        return <Navigate to="/" state={{ from: location }} />
    }

    return children;
}

export default PrivateRoute;