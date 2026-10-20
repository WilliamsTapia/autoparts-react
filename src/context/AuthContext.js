import { createContext, useContext, useState } from "react";
import { sesionDB } from "../data/db";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(sesionDB.leer);

  const iniciar = (u) => { sesionDB.guardar(u); setUsuario(u); };
  const cerrar = () => { sesionDB.borrar(); setUsuario(null); };

  return (
    <AuthContext.Provider value={{ usuario, iniciar, cerrar, esAdmin: usuario?.tipoUsuario === "Administrador" }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
