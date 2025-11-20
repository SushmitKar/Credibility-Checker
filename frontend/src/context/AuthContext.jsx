import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const initialToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const [token, setToken] = useState(initialToken);
    const [user, setUser] = useState(() => deriveUserFromToken(initialToken));

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(deriveUserFromToken(newToken));
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

const deriveUserFromToken = (jwt) => {
    if (!jwt) {
        return null;
    }

    try {
        const payload = parseJwt(jwt);
        const username = payload?.sub || payload?.username || 'Analyst';
        return { username };
    } catch {
        return null;
    }
};

const parseJwt = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        window
            .atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join(''),
    );

    return JSON.parse(jsonPayload);
};
