// import React, { createContext, useContext, useState } from 'react';
// import { loginUser } from '../api/users';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   const login = async (token, userData) => {
//     localStorage.setItem('token', token); // Store token in localStorage or other storage
//     setUser(userData); // Update context user data
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, fetchUserData } from '../api/users'; // Ensure you have a function to fetch user data if needed

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Optionally, fetch user data based on the token
      // Example: fetchUserData(token).then(data => setUser(data));
      // For now, just assume token is valid and set user as needed
      setUser({}); // Replace with actual logic to set user data if necessary
    }
  }, []);

  const login = async (token, userData) => {
    localStorage.setItem('token', token); // Store token in localStorage or other storage
    setUser(userData); // Update context user data
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
