import React, { createContext, useState, useContext } from 'react';
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
 const [rollNo, setRollNo] = useState(null);
  return (
   <AuthContext.Provider value={{ rollNo, setRollNo }}>
     {children}
   </AuthContext.Provider>
 );
}
export const useAuth = () => useContext(AuthContext);