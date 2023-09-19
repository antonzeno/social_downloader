import React, { createContext, useState, useContext } from 'react';
import jwt_decode from 'jwt-decode';

interface AuthContextProps {
    children: React.ReactNode;
}

interface DecodedToken {
    username: string;
    exp: number;
}

export const AuthContext = createContext({
    userLoggedIn: false,
    login: () => { },
    logout: () => { },
});

export function AuthProvider({ children }: AuthContextProps) {
    const [userLoggedIn, setUserLoggedIn] = useState(isLoggedIn());

    function isLoggedIn() {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];

        if (!token) {
            return false; // Token does not exist
        }

        // Decode the token and check if it's expired
        const decodedToken = jwt_decode(token) as DecodedToken;

        const currentTime = Date.now() / 1000;

        const loggedIn = decodedToken.exp > currentTime;
        return loggedIn;
    }

    const login = () => {
        setUserLoggedIn(true);
    };

    const logout = () => {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        setUserLoggedIn(false);
    };


    return (
        <AuthContext.Provider value={{ userLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
