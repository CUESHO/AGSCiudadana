import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('ags_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        // Simulate login - in a real app, check against DB
        const storedUsers = JSON.parse(localStorage.getItem('ags_users') || '[]');
        const foundUser = storedUsers.find(u => u.email === email && u.password === password);

        if (foundUser) {
            const { password, ...userWithoutPass } = foundUser;
            setUser(userWithoutPass);
            localStorage.setItem('ags_user', JSON.stringify(userWithoutPass));
            return { success: true };
        }
        return { success: false, error: 'Credenciales inválidas' };
    };

    const signup = (name, email, password) => {
        const storedUsers = JSON.parse(localStorage.getItem('ags_users') || '[]');

        if (storedUsers.find(u => u.email === email)) {
            return { success: false, error: 'El correo ya está registrado' };
        }

        const newUser = { name, email, password, id: Date.now() };
        storedUsers.push(newUser);
        localStorage.setItem('ags_users', JSON.stringify(storedUsers));

        // Auto login after signup
        const { password: _, ...userWithoutPass } = newUser;
        setUser(userWithoutPass);
        localStorage.setItem('ags_user', JSON.stringify(userWithoutPass));

        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('ags_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
